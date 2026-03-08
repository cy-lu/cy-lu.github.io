#!/usr/bin/env python3
"""
1D FEM layered Helmholtz example
- linear finite elements
- piecewise dielectric profile
- sparse matrix assembly
- Dirichlet boundary conditions

This is a pedagogical scalar Helmholtz example.
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

c0 = 299792458.0


def main():
    f = 1.0e9
    omega = 2.0 * np.pi * f
    k0 = omega / c0

    length = 1.0
    ne = 300
    nn = ne + 1
    x = np.linspace(0.0, length, nn)

    eps_r_node = np.ones(nn)
    eps_r_node[(x >= 0.45) & (x <= 0.65)] = 4.0

    a = lil_matrix((nn, nn), dtype=np.complex128)
    b = np.zeros(nn, dtype=np.complex128)

    for e in range(ne):
        x1 = x[e]
        x2 = x[e + 1]
        h = x2 - x1

        eps_elem = 0.5 * (eps_r_node[e] + eps_r_node[e + 1])

        k_local = (1.0 / h) * np.array([[1, -1], [-1, 1]], dtype=np.complex128)
        m_local = (h / 6.0) * np.array([[2, 1], [1, 2]], dtype=np.complex128)

        a_local = k_local - (k0**2 * eps_elem) * m_local
        dofs = [e, e + 1]

        for i in range(2):
            for j in range(2):
                a[dofs[i], dofs[j]] += a_local[i, j]

    # simple interior forcing
    x0 = 0.20
    sigma = 0.02
    rhs_continuous = np.exp(-((x - x0) / sigma) ** 2)
    b[:] = rhs_continuous

    # Dirichlet BCs: u(0)=0, u(L)=0
    for idx, value in [(0, 0.0), (nn - 1, 0.0)]:
        a[idx, :] = 0.0
        a[:, idx] = 0.0
        a[idx, idx] = 1.0
        b[idx] = value

    u = spsolve(a.tocsr(), b)

    fig, ax = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
    ax[0].plot(x, np.real(u), label="Re(u)")
    ax[0].plot(x, np.imag(u), label="Im(u)")
    ax[0].plot(x, np.abs(u), label="|u|")
    ax[0].set_ylabel("Field")
    ax[0].set_title("1D FEM layered Helmholtz example")
    ax[0].legend()

    ax[1].plot(x, eps_r_node, color="tab:orange")
    ax[1].set_xlabel("x (m)")
    ax[1].set_ylabel(r"$\varepsilon_r$")
    ax[1].set_title("Piecewise dielectric profile")

    fig.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
