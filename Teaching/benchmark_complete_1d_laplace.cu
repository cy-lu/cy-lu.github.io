#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <cstring>          // memset
#include <cuda_runtime.h>

// ------------------------------
// Basic CUDA error check macro
// ------------------------------
#define CUDA_CHECK(call) do {                                     \
  cudaError_t e = (call);                                         \
  if (e != cudaSuccess) {                                         \
    std::printf("CUDA error %s:%d: %s\n",                         \
      __FILE__, __LINE__, cudaGetErrorString(e));                 \
    std::exit(1);                                                 \
  }                                                               \
} while(0)

// ==========================================================
// Kernel 1: Naive (global memory direct loads)
// y[i] = x[next] - 2*x[i] + x[prev]   with periodic boundary
// ==========================================================
__global__ void ker_laplace_naive(float* y, const float* x, int n) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= n) return;

  int prev = (i == 0) ? n - 1 : i - 1;
  int next = (i == n - 1) ? 0 : i + 1;

  y[i] = x[next] - 2.0f * x[i] + x[prev];
}

// ==========================================================
// Kernel 2: LDG (read-only cache path via __ldg)
// ==========================================================
__global__ void ker_laplace_ldg(float* y, const float* __restrict__ x, int n) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= n) return;

  int prev = (i == 0) ? n - 1 : i - 1;
  int next = (i == n - 1) ? 0 : i + 1;

  y[i] = __ldg(&x[next]) - 2.0f * __ldg(&x[i]) + __ldg(&x[prev]);
}

// ==========================================================
// Kernel 3: Texture Object (tex1Dfetch)
// ==========================================================
__global__ void ker_laplace_tex_obj(float* y, cudaTextureObject_t tex, int n) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i >= n) return;

  int prev = (i == 0) ? n - 1 : i - 1;
  int next = (i == n - 1) ? 0 : i + 1;

  y[i] = tex1Dfetch<float>(tex, next)
       - 2.0f * tex1Dfetch<float>(tex, i)
       + tex1Dfetch<float>(tex, prev);
}

// ==========================================================
// Kernel 4: Shared memory tiling + halo
// shared layout: s[t+1] = x[i]
//                s[0]   = left halo
//                s[t+2] = right halo
// ==========================================================
__global__ void ker_laplace_shared(float* y, const float* x, int n) {
  extern __shared__ float s[];

  int t = threadIdx.x;
  int i = blockIdx.x * blockDim.x + t;

  if (i < n) s[t + 1] = x[i];

  if (t == 0) {
    int prev = (i == 0) ? n - 1 : i - 1;
    s[0] = x[prev];
  }

  if (t == blockDim.x - 1 || i == n - 1) {
    int next = (i == n - 1) ? 0 : i + 1;
    s[t + 2] = x[next];
  }

  __syncthreads();

  if (i < n) {
    y[i] = s[t + 2] - 2.0f * s[t + 1] + s[t];
  }
}

int main() {
  const int n = 16 * 1024 * 1024;
  const int loops = 500;
  const int threads = 512;
  const int blocks  = (n + threads - 1) / threads;

  size_t bytes = (size_t)n * sizeof(float);
  float* h_x = new float[n];

  for (int i = 0; i < n; i++) {
    h_x[i] = (float)std::rand() / (float)RAND_MAX;
  }

  float *d_x = nullptr, *d_y = nullptr;
  CUDA_CHECK(cudaMalloc(&d_x, bytes));
  CUDA_CHECK(cudaMalloc(&d_y, bytes));
  CUDA_CHECK(cudaMemcpy(d_x, h_x, bytes, cudaMemcpyHostToDevice));

  cudaResourceDesc resDesc;
  std::memset(&resDesc, 0, sizeof(resDesc));
  resDesc.resType = cudaResourceTypeLinear;
  resDesc.res.linear.devPtr = d_x;
  resDesc.res.linear.desc = cudaCreateChannelDesc<float>();
  resDesc.res.linear.sizeInBytes = bytes;

  cudaTextureDesc texDesc;
  std::memset(&texDesc, 0, sizeof(texDesc));
  texDesc.readMode = cudaReadModeElementType;

  cudaTextureObject_t texObj = 0;
  CUDA_CHECK(cudaCreateTextureObject(&texObj, &resDesc, &texDesc, nullptr));

  cudaEvent_t start, stop;
  CUDA_CHECK(cudaEventCreate(&start));
  CUDA_CHECK(cudaEventCreate(&stop));

  float ms = 0.0f;

  auto run_test = [&](const char* name, auto launch) {
    launch();
    CUDA_CHECK(cudaGetLastError());
    CUDA_CHECK(cudaDeviceSynchronize());

    CUDA_CHECK(cudaEventRecord(start));
    for (int k = 0; k < loops; k++) launch();
    CUDA_CHECK(cudaEventRecord(stop));
    CUDA_CHECK(cudaEventSynchronize(stop));
    CUDA_CHECK(cudaEventElapsedTime(&ms, start, stop));

    std::printf("GPU %-12s: %.4f ms\n", name, ms / loops);
  };

  run_test("Naive", [&](){
    ker_laplace_naive<<<blocks, threads>>>(d_y, d_x, n);
  });

  run_test("LDG", [&](){
    ker_laplace_ldg<<<blocks, threads>>>(d_y, d_x, n);
  });

  run_test("TexObject", [&](){
    ker_laplace_tex_obj<<<blocks, threads>>>(d_y, texObj, n);
  });

  run_test("Shared", [&](){
    ker_laplace_shared<<<blocks, threads, (threads + 2) * sizeof(float)>>>(d_y, d_x, n);
  });

  CUDA_CHECK(cudaDestroyTextureObject(texObj));
  CUDA_CHECK(cudaEventDestroy(start));
  CUDA_CHECK(cudaEventDestroy(stop));
  CUDA_CHECK(cudaFree(d_x));
  CUDA_CHECK(cudaFree(d_y));
  delete[] h_x;

  return 0;
}
