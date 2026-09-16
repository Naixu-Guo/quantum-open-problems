#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Independent full-matrix audit of the flagged Petz-CMI witness.

The calculation starts from the printed sparse 8-by-8 state and imports no
scalar verification routine. This is a high-precision point audit, not the
directed-rounding certificate.
"""

import argparse
import itertools
import json

import mpmath as mp


def index(bits):
    result = 0
    for bit in bits:
        result = 2 * result + bit
    return result


def marginal(state, keep):
    basis = list(itertools.product(range(2), repeat=3))
    traced = [position for position in range(3) if position not in keep]
    result = mp.zeros(2 ** len(keep))
    for i, left in enumerate(basis):
        for j, right in enumerate(basis):
            if all(left[k] == right[k] for k in traced):
                row = index([left[k] for k in keep])
                column = index([right[k] for k in keep])
                result[row, column] += state[i, j]
    return result


def spectral(state, rank):
    values, vectors = mp.eigsy(state)
    nullity = len(values) - rank
    residual = max(
        [abs(values[i]) for i in range(nullity)] + [mp.mpf(0)]
    )
    if residual > mp.power(10, -mp.mp.dps + 10):
        raise ArithmeticError("Spectrum inconsistent with the exact rank")
    positive = list(values)[nullity:]
    if min(positive) <= 0:
        raise ArithmeticError("Nonpositive eigenvalue on the exact support")
    roots = mp.diag([0] * nullity + [mp.sqrt(value) for value in positive])
    root = vectors * roots * vectors.T
    entropy = -sum(value * mp.log(value, 2) for value in positive)
    return root, entropy, residual


def calculate(digits):
    mp.mp.dps = digits
    state = mp.zeros(8)
    state[0, 0] = mp.mpf(3) / 6002
    state[5, 5] = mp.mpf(5997) / 6002
    state[0, 5] = state[5, 0] = -mp.mpf(40) / 3001
    state[2, 2] = mp.mpf(3) / 12004
    state[7, 7] = mp.mpf(1) / 12004
    state[2, 7] = state[7, 2] = mp.sqrt(3) / 12004

    ac = marginal(state, (0, 2))
    bc = marginal(state, (1, 2))
    c = marginal(state, (2,))
    root_ac, entropy_ac, null_ac = spectral(ac, 2)
    root_state, entropy_abc, null_state = spectral(state, 3)
    _, entropy_bc, _ = spectral(bc, 4)
    _, entropy_c, _ = spectral(c, 2)

    if c[0, 1] != 0 or c[1, 0] != 0:
        raise ArithmeticError("The exact C marginal should be diagonal")

    recovered = mp.zeros(8)
    completeness = mp.zeros(2)
    for a in range(2):
        insertion = mp.zeros(4, 2)
        for z in range(2):
            insertion[2 * a + z, z] = 1 / mp.sqrt(c[z, z])
        kraus = root_ac * insertion
        completeness += kraus.T * kraus

        lift = mp.zeros(8, 4)
        for aa, b, cc, z in itertools.product(range(2), repeat=4):
            lift[4 * aa + 2 * b + cc, 2 * b + z] = kraus[
                2 * aa + cc, z
            ]
        recovered += lift * bc * lift.T

    root_recovered, _, null_recovered = spectral(recovered, 4)
    singular_values = mp.svd(root_state * root_recovered, compute_uv=False)
    root_fidelity = sum(singular_values)
    cmi = entropy_ac + entropy_bc - entropy_c - entropy_abc
    rhs = -2 * mp.log(root_fidelity, 2)
    return {
        "digits": digits,
        "cmi_bits": cmi,
        "rhs_bits": rhs,
        "gap_bits": cmi - rhs,
        "fidelity": root_fidelity**2,
        "entropy_ac": entropy_ac,
        "entropy_bc": entropy_bc,
        "entropy_c": entropy_c,
        "entropy_abc": entropy_abc,
        "kraus_completeness_residual": mp.norm(
            completeness - mp.eye(2)
        ),
        "state_trace_residual": abs(sum(state[i, i] for i in range(8)) - 1),
        "recovery_trace_residual": abs(
            sum(recovered[i, i] for i in range(8)) - 1
        ),
        "state_root_residual": mp.norm(root_state * root_state - state),
        "recovery_root_residual": mp.norm(
            root_recovered * root_recovered - recovered
        ),
        "largest_discarded_null_eigenvalue": max(
            null_ac, null_state, null_recovered
        ),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--digits", type=int, nargs="+", default=[60, 100])
    args = parser.parse_args()

    reports = []
    for digits in args.digits:
        result = calculate(digits)
        if not result["gap_bits"] < -mp.mpf(31) / 10**6:
            raise ArithmeticError("Full-matrix point check is not negative")
        for key, value in result.items():
            if key.endswith("_residual") or key == (
                "largest_discarded_null_eigenvalue"
            ):
                if not value < mp.power(10, -digits + 10):
                    raise ArithmeticError(f"Residual is too large: {key}")
        reports.append(
            {
                key: value if isinstance(value, int) else mp.nstr(value, digits - 10)
                for key, value in result.items()
            }
        )

    if len(reports) >= 2:
        first_gap = mp.mpf(reports[-2]["gap_bits"])
        final_gap = mp.mpf(reports[-1]["gap_bits"])
        expected_agreement = mp.power(10, -min(args.digits[-2:]) + 12)
        if abs(first_gap - final_gap) >= expected_agreement:
            raise ArithmeticError("Precision runs do not agree")

    report = {
        "method": "Full ABC partial traces, Kraus recovery, full-matrix SVD",
        "evidence": "independent point evaluation, not interval arithmetic",
        "runs": reports,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
