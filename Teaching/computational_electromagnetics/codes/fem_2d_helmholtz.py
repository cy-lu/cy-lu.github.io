#!/usr/bin/env python3
"""
2D FEM scalar Helmholtz example
- triangular mesh built from a structured grid split into triangles
- dielectric inclusion assigned by element centroid
- sparse assembly
- homogeneous Dirichlet boundary conditions
- compact Gaussian forcing inside the domain

Pedagogical code only.
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.tri as mtri
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

c0 = 299792458.0


def local_matrices(xy):
    x1, y1 = xy[0]
    x2, y2 = xy[1]
    x3, y3 = xy[2]

    area = 0.5 * abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1))

    b = np.array([y2 - y3, y3 - y1, y1 - y2], dtype=float)
    c = np.array([x3 - x2, x1 - x3, x2 - x1], dtype=float)

    grad_term = (np.outer(b, b) + np.outer(c, c)) / (4.0 * area)
    mass_term = (area / 12.0) * np.array(
        [[2, 1, 1], [1, 2, 1], [1, 1, 2]], dtype=float
    )
    return area, grad_term, mass_term


def main():
    f = 2.0e9
    omega = 2.0 * np.pi * f
    k0 = omega / c0

    lx, ly = 0.30, 0.20
    nx, ny = 41, 31

    xs = np.linspace(0.0, lx, nx)
    ys = np.linspace(0.0, ly, ny)
    xx, yy = np.meshgrid(xs, ys, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel()])

    def node_id(i, j):
        return i * ny + j

    tris = []
    for i in range(nx - 1):
        for j in range(ny - 1):
            n1 = node_id(i, j)
            n2 = node_id(i + 1, j)
            n3 = node_id(i, j + 1)
            n4 = node_id(i + 1, j + 1)
            tris.append([n1, n2, n4])
            tris.append([n1, n4, n3])
    tris = np.array(tris, dtype=int)

    a = lil_matrix((len(points), len(points)), dtype=np.complex128)
    b = np.zeros(len(points), dtype=np.complex128)

    xc, yc, rc = 0.20, 0.10, 0.030

    for tri in tris:
        xy = points[tri]
        centroid = xy.mean(axis=0)
        eps_elem = 4.0 if (centroid[0] - xc) ** 2 + (centroid[1] - yc) ** 2 <= rc ** 2 else 1.0

        area, k_local, m_local = local_matrices(xy)
        a_local = k_local - (k0**2 * eps_elem) * m_local

        source_center = np.array([0.08, 0.10])
        sigma = 0.010
        g = np.exp(-np.sum((centroid - source_center) ** 2) / (2.0 * sigma**2))
        b_local = g * area / 3.0 * np.ones(3)

        for i_local in range(3):
            ii = tri[i_local]
            b[ii] += b_local[i_local]
            for j_local in range(3):
                jj = tri[j_local]
                a[ii, jj] += a_local[i_local, j_local]

    # Dirichlet boundaries
    boundary = np.where(
        (np.isclose(points[:, 0], 0.0))
        | (np.isclose(points[:, 0], lx))
        | (np.isclose(points[:, 1], 0.0))
        | (np.isclose(points[:, 1], ly))
    )[0]

    for idx in boundary:
        a[idx, :] = 0.0
        a[:, idx] = 0.0
        a[idx, idx] = 1.0
        b[idx] = 0.0

    u = spsolve(a.tocsr(), b)

    tri_obj = mtri.Triangulation(points[:, 0], points[:, 1], tris)

    fig, ax = plt.subplots(1, 2, figsize=(12, 5), constrained_layout=True)

    ax[0].triplot(tri_obj, lw=0.6, color="0.65")
    circ = plt.Circle((xc, yc), rc, color="tab:blue", fill=False, lw=2)
    ax[0].add_patch(circ)
    ax[0].set_aspect("equal")
    ax[0].set_title("Triangular mesh and dielectric inclusion")
    ax[0].set_xlabel("x (m)")
    ax[0].set_ylabel("y (m)")

    tpc = ax[1].tripcolor(tri_obj, np.abs(u), shading="gouraud", cmap="viridis")
    ax[1].set_aspect("equal")
    ax[1].set_title("|u| from 2D FEM Helmholtz solve")
    ax[1].set_xlabel("x (m)")
    ax[1].set_ylabel("y (m)")
    fig.colorbar(tpc, ax=ax[1], shrink=0.85, label="|u|")

    plt.show()


if __name__ == "__main__":
    main()
