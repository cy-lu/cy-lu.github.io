#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <cstring>
#include <vector>
#include <cuda_runtime.h>

#define CUDA_CHECK(call) do {                                     \
  cudaError_t e = (call);                                         \
  if (e != cudaSuccess) {                                         \
    std::printf("CUDA error %s:%d: %s\n",                         \
      __FILE__, __LINE__, cudaGetErrorString(e));                 \
    std::exit(1);                                                 \
  }                                                               \
} while(0)

__host__ __device__ inline int idx2d(int i, int j, int nx) {
  return j * nx + i;
}

__global__ void ker_laplace2d_naive(float* y, const float* x, int nx, int ny) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  int j = blockIdx.y * blockDim.y + threadIdx.y;
  if (i >= nx || j >= ny) return;

  int im = (i == 0)      ? nx - 1 : i - 1;
  int ip = (i == nx - 1) ? 0      : i + 1;
  int jm = (j == 0)      ? ny - 1 : j - 1;
  int jp = (j == ny - 1) ? 0      : j + 1;

  int c  = idx2d(i , j , nx);
  int xm = idx2d(im, j , nx);
  int xp = idx2d(ip, j , nx);
  int ym = idx2d(i , jm, nx);
  int yp = idx2d(i , jp, nx);

  y[c] = x[xp] + x[xm] + x[yp] + x[ym] - 4.0f * x[c];
}

__global__ void ker_laplace2d_ldg(float* y, const float* __restrict__ x, int nx, int ny) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  int j = blockIdx.y * blockDim.y + threadIdx.y;
  if (i >= nx || j >= ny) return;

  int im = (i == 0)      ? nx - 1 : i - 1;
  int ip = (i == nx - 1) ? 0      : i + 1;
  int jm = (j == 0)      ? ny - 1 : j - 1;
  int jp = (j == ny - 1) ? 0      : j + 1;

  int c  = idx2d(i , j , nx);
  int xm = idx2d(im, j , nx);
  int xp = idx2d(ip, j , nx);
  int ym = idx2d(i , jm, nx);
  int yp = idx2d(i , jp, nx);

  y[c] = __ldg(&x[xp]) + __ldg(&x[xm]) + __ldg(&x[yp]) + __ldg(&x[ym]) - 4.0f * __ldg(&x[c]);
}

__global__ void ker_laplace2d_tex_obj(float* y, cudaTextureObject_t tex, int nx, int ny) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  int j = blockIdx.y * blockDim.y + threadIdx.y;
  if (i >= nx || j >= ny) return;

  int im = (i == 0)      ? nx - 1 : i - 1;
  int ip = (i == nx - 1) ? 0      : i + 1;
  int jm = (j == 0)      ? ny - 1 : j - 1;
  int jp = (j == ny - 1) ? 0      : j + 1;

  int c  = idx2d(i , j , nx);
  int xm = idx2d(im, j , nx);
  int xp = idx2d(ip, j , nx);
  int ym = idx2d(i , jm, nx);
  int yp = idx2d(i , jp, nx);

  y[c] = tex1Dfetch<float>(tex, xp)
       + tex1Dfetch<float>(tex, xm)
       + tex1Dfetch<float>(tex, yp)
       + tex1Dfetch<float>(tex, ym)
       - 4.0f * tex1Dfetch<float>(tex, c);
}

__global__ void ker_laplace2d_shared(float* y, const float* x, int nx, int ny) {
  extern __shared__ float s[];

  const int tx = threadIdx.x;
  const int ty = threadIdx.y;
  const int bx = blockDim.x;
  const int by = blockDim.y;

  const int i = blockIdx.x * bx + tx;
  const int j = blockIdx.y * by + ty;

  const int sw = bx + 2;

  if (i >= nx || j >= ny) return;

  int im = (i == 0)      ? nx - 1 : i - 1;
  int ip = (i == nx - 1) ? 0      : i + 1;
  int jm = (j == 0)      ? ny - 1 : j - 1;
  int jp = (j == ny - 1) ? 0      : j + 1;

  s[(ty + 1) * sw + (tx + 1)] = x[idx2d(i, j, nx)];

  if (tx == 0) {
    s[(ty + 1) * sw + 0] = x[idx2d(im, j, nx)];
  }
  if (tx == bx - 1 || i == nx - 1) {
    s[(ty + 1) * sw + (tx + 2)] = x[idx2d(ip, j, nx)];
  }

  if (ty == 0) {
    s[0 * sw + (tx + 1)] = x[idx2d(i, jm, nx)];
  }
  if (ty == by - 1 || j == ny - 1) {
    s[(ty + 2) * sw + (tx + 1)] = x[idx2d(i, jp, nx)];
  }

  if (tx == 0 && ty == 0) {
    s[0 * sw + 0] = x[idx2d(im, jm, nx)];
  }
  if ((tx == bx - 1 || i == nx - 1) && ty == 0) {
    s[0 * sw + (tx + 2)] = x[idx2d(ip, jm, nx)];
  }
  if (tx == 0 && (ty == by - 1 || j == ny - 1)) {
    s[(ty + 2) * sw + 0] = x[idx2d(im, jp, nx)];
  }
  if ((tx == bx - 1 || i == nx - 1) && (ty == by - 1 || j == ny - 1)) {
    s[(ty + 2) * sw + (tx + 2)] = x[idx2d(ip, jp, nx)];
  }

  __syncthreads();

  const float xc = s[(ty + 1) * sw + (tx + 1)];
  const float xl = s[(ty + 1) * sw + tx];
  const float xr = s[(ty + 1) * sw + (tx + 2)];
  const float yd = s[ty * sw + (tx + 1)];
  const float yu = s[(ty + 2) * sw + (tx + 1)];

  y[idx2d(i, j, nx)] = xr + xl + yu + yd - 4.0f * xc;
}

template <typename Launcher>
float run_test(const char* name, Launcher launch, cudaEvent_t start, cudaEvent_t stop, int loops) {
  float ms = 0.0f;

  launch();
  CUDA_CHECK(cudaGetLastError());
  CUDA_CHECK(cudaDeviceSynchronize());

  CUDA_CHECK(cudaEventRecord(start));
  for (int k = 0; k < loops; k++) launch();
  CUDA_CHECK(cudaEventRecord(stop));
  CUDA_CHECK(cudaEventSynchronize(stop));
  CUDA_CHECK(cudaEventElapsedTime(&ms, start, stop));

  float avg = ms / loops;
  std::printf("GPU %-12s: %.4f ms\n", name, avg);
  return avg;
}

int main() {
  const std::vector<int> sizes = {1024, 2048, 4096, 8192};
  const dim3 threads(16, 16);

  cudaEvent_t start, stop;
  CUDA_CHECK(cudaEventCreate(&start));
  CUDA_CHECK(cudaEventCreate(&stop));

  std::printf("============================================================\n");
  std::printf("2D Laplace stencil benchmark (periodic BC)\n");
  std::printf("Block size = %d x %d\n", threads.x, threads.y);
  std::printf("============================================================\n");

  for (size_t sidx = 0; sidx < sizes.size(); sidx++) {
    const int nx = sizes[sidx];
    const int ny = sizes[sidx];
    const size_t n = (size_t)nx * (size_t)ny;
    const size_t bytes = n * sizeof(float);
    const dim3 blocks((nx + threads.x - 1) / threads.x,
                      (ny + threads.y - 1) / threads.y);

    int loops = 300;
    if (nx >= 8192) loops = 100;
    if (nx <= 1024) loops = 500;

    std::printf("\n------------------------------------------------------------\n");
    std::printf("Grid size: %d x %d   (%zu points)\n", nx, ny, n);
    std::printf("Loops    : %d\n", loops);
    std::printf("------------------------------------------------------------\n");

    float* h_x = new float[n];
    for (size_t k = 0; k < n; k++) {
      h_x[k] = (float)std::rand() / (float)RAND_MAX;
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

    run_test("Naive", [&](){
      ker_laplace2d_naive<<<blocks, threads>>>(d_y, d_x, nx, ny);
    }, start, stop, loops);

    run_test("LDG", [&](){
      ker_laplace2d_ldg<<<blocks, threads>>>(d_y, d_x, nx, ny);
    }, start, stop, loops);

    run_test("TexObject", [&](){
      ker_laplace2d_tex_obj<<<blocks, threads>>>(d_y, texObj, nx, ny);
    }, start, stop, loops);

    run_test("Shared", [&](){
      size_t shmem = (threads.x + 2) * (threads.y + 2) * sizeof(float);
      ker_laplace2d_shared<<<blocks, threads, shmem>>>(d_y, d_x, nx, ny);
    }, start, stop, loops);

    CUDA_CHECK(cudaDestroyTextureObject(texObj));
    CUDA_CHECK(cudaFree(d_x));
    CUDA_CHECK(cudaFree(d_y));
    delete[] h_x;
  }

  CUDA_CHECK(cudaEventDestroy(start));
  CUDA_CHECK(cudaEventDestroy(stop));

  std::printf("\n============================================================\n");
  std::printf("Done.\n");
  std::printf("============================================================\n");

  return 0;
}
