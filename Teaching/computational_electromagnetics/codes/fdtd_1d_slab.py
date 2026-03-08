#!/usr/bin/env python3
"""
1D FDTD slab example
- Gaussian pulse source
- dielectric slab
- simple Mur absorbing boundary
- reference run + slab run
- FFT-based reflection/transmission estimate

This is a teaching code, not a production solver.
"""

import numpy as np
import matplotlib.pyplot as plt

c0 = 299792458.0
mu0 = 4e-7 * np.pi
eps0 = 1.0 / (mu0 * c0**2)


def gaussian_pulse(t, t0, tau, f0):
    return np.exp(-((t - t0) / tau) ** 2) * np.sin(2.0 * np.pi * f0 * t)


def run_fdtd(eps_r, dx, dt, nt, src_idx, m1_idx, m2_idx, source_params):
    nx = len(eps_r)
    e = np.zeros(nx)
    h = np.zeros(nx - 1)

    e_prev = e.copy()
    left_old = 0.0
    right_old = 0.0

    src_history = np.zeros(nt)
    mon1 = np.zeros(nt)
    mon2 = np.zeros(nt)

    mur = (c0 * dt - dx) / (c0 * dt + dx)

    t0, tau, f0 = source_params

    for n in range(nt):
        t = n * dt

        # update H
        h += (dt / (mu0 * dx)) * (e[1:] - e[:-1])

        # save current E for Mur update
        e_prev[:] = e

        # update interior E
        curl_h = h[1:] - h[:-1]
        e[1:-1] += (dt / (eps0 * eps_r[1:-1] * dx)) * curl_h

        # source injection
        s = gaussian_pulse(t, t0, tau, f0)
        e[src_idx] += s

        # Mur ABC
        e[0] = e_prev[1] + mur * (e[1] - e_prev[0])
        e[-1] = e_prev[-2] + mur * (e[-2] - e_prev[-1])

        src_history[n] = s
        mon1[n] = e[m1_idx]
        mon2[n] = e[m2_idx]

    return src_history, mon1, mon2, e


def main():
    nx = 900
    dx = 1.0e-3
    courant = 0.99
    dt = courant * dx / c0
    nt = 3500

    src_idx = 120
    m1_idx = 220
    m2_idx = 700

    slab_start = 420
    slab_end = 540
    eps_slab = 4.0

    source_params = (80 * dt, 25 * dt, 1.2e9)

    eps_ref = np.ones(nx)
    eps_slab_profile = np.ones(nx)
    eps_slab_profile[slab_start:slab_end] = eps_slab

    src_ref, mon1_ref, mon2_ref, e_ref = run_fdtd(
        eps_ref, dx, dt, nt, src_idx, m1_idx, m2_idx, source_params
    )
    src_slab, mon1_slab, mon2_slab, e_slab = run_fdtd(
        eps_slab_profile, dx, dt, nt, src_idx, m1_idx, m2_idx, source_params
    )

    reflected_time = mon1_slab - mon1_ref

    window = np.hanning(nt)
    f = np.fft.rfftfreq(nt, d=dt)

    inc_spec = np.fft.rfft(mon1_ref * window)
    ref_spec = np.fft.rfft(reflected_time * window)
    trans_ref_spec = np.fft.rfft(mon2_ref * window)
    trans_spec = np.fft.rfft(mon2_slab * window)

    denom_inc = np.abs(inc_spec) ** 2 + 1e-30
    denom_tr = np.abs(trans_ref_spec) ** 2 + 1e-30

    r = np.abs(ref_spec) ** 2 / denom_inc
    t = np.abs(trans_spec) ** 2 / denom_tr

    band = (f > 0.2e9) & (f < 2.5e9)

    x = np.arange(nx) * dx

    fig, ax = plt.subplots(2, 2, figsize=(12, 8))

    ax[0, 0].plot(np.arange(nt) * dt * 1e9, mon1_ref, label="reference monitor")
    ax[0, 0].plot(np.arange(nt) * dt * 1e9, mon1_slab, label="slab monitor")
    ax[0, 0].set_xlabel("Time (ns)")
    ax[0, 0].set_ylabel("E")
    ax[0, 0].set_title("Monitor before slab")
    ax[0, 0].legend()

    ax[0, 1].plot(x, e_slab, label="final E field")
    ax[0, 1].axvspan(slab_start * dx, slab_end * dx, alpha=0.2, label="dielectric slab")
    ax[0, 1].set_xlabel("x (m)")
    ax[0, 1].set_ylabel("E")
    ax[0, 1].set_title("Final field snapshot")
    ax[0, 1].legend()

    ax[1, 0].plot(f[band] * 1e-9, r[band], label="R")
    ax[1, 0].plot(f[band] * 1e-9, t[band], label="T")
    ax[1, 0].plot(f[band] * 1e-9, r[band] + t[band], "--", label="R+T")
    ax[1, 0].set_xlabel("Frequency (GHz)")
    ax[1, 0].set_ylabel("Power ratio")
    ax[1, 0].set_ylim(0, 1.2)
    ax[1, 0].set_title("Estimated spectra")
    ax[1, 0].legend()

    ax[1, 1].plot(x, eps_slab_profile, color="tab:orange")
    ax[1, 1].set_xlabel("x (m)")
    ax[1, 1].set_ylabel(r"$\varepsilon_r$")
    ax[1, 1].set_title("Material profile")

    fig.suptitle("1D FDTD slab example")
    fig.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
