#!/usr/bin/env python3
"""
2D TEz-like FDTD with first-order Mur absorbing boundary
- pedagogical ABC
- not as good as PML/CPML, but useful for teaching the role of the boundary
"""

import numpy as np
import matplotlib.pyplot as plt

c0 = 299792458.0
mu0 = 4e-7 * np.pi
eps0 = 1.0 / (mu0 * c0**2)


def gaussian(t, t0, tau):
    return np.exp(-((t - t0) / tau) ** 2)


def main():
    nx, ny = 220, 220
    dx = dy = 1.5e-3
    dt = 0.99 / (c0 * np.sqrt(dx ** -2 + dy ** -2))
    nt = 450

    ez = np.zeros((nx, ny))
    ez_old = np.zeros_like(ez)
    hx = np.zeros((nx, ny - 1))
    hy = np.zeros((nx - 1, ny))

    eps_r = np.ones((nx, ny))

    # dielectric cylinder
    cx, cy, r = 150, 110, 18
    yy, xx = np.meshgrid(np.arange(ny), np.arange(nx))
    mask = (xx - cx) ** 2 + (yy - cy) ** 2 <= r ** 2
    eps_r[mask] = 4.0

    src_x, src_y = 60, 110
    snapshots = []

    mur_x = (c0 * dt - dx) / (c0 * dt + dx)
    mur_y = (c0 * dt - dy) / (c0 * dt + dy)

    for n in range(nt):
        t = n * dt

        hx -= (dt / (mu0 * dy)) * (ez[:, 1:] - ez[:, :-1])
        hy += (dt / (mu0 * dx)) * (ez[1:, :] - ez[:-1, :])

        ez_old[:, :] = ez

        curl_h = (
            (hy[1:, 1:-1] - hy[:-1, 1:-1]) / dx
            - (hx[1:-1, 1:] - hx[1:-1, :-1]) / dy
        )
        ez[1:-1, 1:-1] += (dt / (eps0 * eps_r[1:-1, 1:-1])) * curl_h

        ez[src_x, src_y] += gaussian(t, 40 * dt, 12 * dt)

        # Mur ABC on all four sides
        ez[0, 1:-1] = ez_old[1, 1:-1] + mur_x * (ez[1, 1:-1] - ez_old[0, 1:-1])
        ez[-1, 1:-1] = ez_old[-2, 1:-1] + mur_x * (ez[-2, 1:-1] - ez_old[-1, 1:-1])
        ez[1:-1, 0] = ez_old[1:-1, 1] + mur_y * (ez[1:-1, 1] - ez_old[1:-1, 0])
        ez[1:-1, -1] = ez_old[1:-1, -2] + mur_y * (ez[1:-1, -2] - ez_old[1:-1, -1])

        # simple corner handling
        ez[0, 0] = 0.5 * (ez[1, 0] + ez[0, 1])
        ez[0, -1] = 0.5 * (ez[1, -1] + ez[0, -2])
        ez[-1, 0] = 0.5 * (ez[-2, 0] + ez[-1, 1])
        ez[-1, -1] = 0.5 * (ez[-2, -1] + ez[-1, -2])

        if n in [60, 120, 200, 320, 430]:
            snapshots.append((n, ez.copy()))

    fig, axes = plt.subplots(1, len(snapshots), figsize=(18, 4), constrained_layout=True)
    vlim = max(np.max(np.abs(s[1])) for s in snapshots)

    for ax, (n, field) in zip(axes, snapshots):
        im = ax.imshow(field.T, origin="lower", cmap="RdBu", vmin=-vlim, vmax=vlim)
        ax.set_title(f"step {n}")
        ax.set_xticks([])
        ax.set_yticks([])

    fig.colorbar(im, ax=axes.ravel().tolist(), shrink=0.85, label="Ez")
    fig.suptitle("2D FDTD with first-order Mur absorbing boundary")
    plt.show()


if __name__ == "__main__":
    main()
