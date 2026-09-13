#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Arb certificate for the flagged ordinary-Petz CMI counterexample.

Successful whole-ball comparisons are directed-rounding certificates rather
than high-precision point estimates. See
database/proofs/ordinary-petz-flagged.md for the analytic reduction.
"""

import argparse
import json

from flint import arb, ctx


def add(first, second):
    return tuple(x + y for x, y in zip(first, second))


def scale(factor, matrix):
    return tuple(factor * value for value in matrix)


def determinant(matrix):
    a, c, b = matrix
    return a * b - c * c


def trace_product(first, second):
    a, c, b = first
    d, e, f = second
    return a * d + 2 * c * e + b * f


def square_root(matrix):
    """Return the principal root of a real 2-by-2 density matrix."""
    a, c, b = matrix
    root_determinant = determinant(matrix).sqrt()
    denominator = (arb(1) + 2 * root_determinant).sqrt()
    return (
        (a + root_determinant) / denominator,
        c / denominator,
        (b + root_determinant) / denominator,
    )


def diagonal_sandwich(root, diagonal):
    """Return root * diag(diagonal) * root in packed symmetric form."""
    u, v, w = root
    d, e = diagonal
    return (
        u * u * d + v * v * e,
        v * (u * d + w * e),
        v * v * d + w * w * e,
    )


def binary_entropy(probability):
    one = arb(1)
    log_two = arb(2).log()
    return -(
        probability * probability.log()
        + (one - probability) * (one - probability).log()
    ) / log_two


def qubit_entropy(matrix):
    a, c, b = matrix
    radius = ((a - b) * (a - b) + 4 * c * c).sqrt()
    return binary_entropy((arb(1) + radius) / 2)


def root_fidelity(first, second, first_is_pure=False):
    squared = trace_product(first, second)
    if not first_is_pure:
        squared += 2 * (determinant(first) * determinant(second)).sqrt()
    return squared.sqrt()


def petz_branch(average, branch):
    average_root = square_root(average)
    a, _, b = average
    branch_a, _, branch_b = branch
    return diagonal_sandwich(
        average_root, (branch_a / a, branch_b / b)
    )


def quantities(precision_bits=256):
    ctx.prec = precision_bits
    one = arb(1)
    p = arb(3000) / 3001
    q = one / 3001
    rho = (arb(3) / 4, arb(3).sqrt() / 4, one / 4)
    sigma = (one / 2000, -one / 75, arb(1999) / 2000)
    average = add(scale(p, sigma), scale(q, rho))

    recovered_sigma = petz_branch(average, sigma)
    recovered_rho = petz_branch(average, rho)
    branch_root_fidelity_sigma = root_fidelity(sigma, recovered_sigma)
    branch_root_fidelity_rho = root_fidelity(
        rho, recovered_rho, first_is_pure=True
    )
    total_root_fidelity = (
        p * branch_root_fidelity_sigma + q * branch_root_fidelity_rho
    )

    # The omitted q*S(rho) term is exactly zero because rho is a projector.
    cmi = (
        qubit_entropy(average)
        - p * qubit_entropy(sigma)
        - binary_entropy(average[0])
        + p * binary_entropy(sigma[0])
        + q * binary_entropy(rho[0])
    )
    rhs = -2 * total_root_fidelity.log() / arb(2).log()

    return {
        "sigma_determinant": determinant(sigma),
        "average_determinant": determinant(average),
        "recovered_sigma_determinant": determinant(recovered_sigma),
        "recovered_rho_determinant": determinant(recovered_rho),
        "branch_root_fidelity_sigma": branch_root_fidelity_sigma,
        "branch_root_fidelity_rho": branch_root_fidelity_rho,
        "root_fidelity": total_root_fidelity,
        "fidelity": total_root_fidelity * total_root_fidelity,
        "cmi_bits": cmi,
        "rhs_bits": rhs,
        "gap_bits": cmi - rhs,
    }


def certify(precision_bits=256):
    values = quantities(precision_bits)
    checks = {
        "sigma_is_positive_definite": values["sigma_determinant"] > 0,
        "average_is_positive_definite": values["average_determinant"] > 0,
        "recovered_branches_are_positive_definite": (
            values["recovered_sigma_determinant"] > 0
            and values["recovered_rho_determinant"] > 0
        ),
        "root_fidelity_is_strictly_between_zero_and_one": (
            values["root_fidelity"] > 0 and values["root_fidelity"] < 1
        ),
        "cmi_is_below_0.000435_bits": (
            values["cmi_bits"] < arb(435) / 10**6
        ),
        "rhs_is_above_0.000466_bits": (
            values["rhs_bits"] > arb(466) / 10**6
        ),
        "gap_is_below_minus_0.000031_bits": (
            values["gap_bits"] < -arb(31) / 10**6
        ),
    }
    if not all(checks.values()):
        failed = [name for name, passed in checks.items() if not passed]
        raise ArithmeticError(f"Arb could not certify: {failed}")
    return values, checks


def ball_text(value, digits=40):
    return value.str(digits, radius=True, more=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--precision-bits", type=int, default=256)
    args = parser.parse_args()
    values, checks = certify(args.precision_bits)
    report = {
        "problem": "op_87c77263c8bab523",
        "arithmetic": "Arb real-ball arithmetic via python-flint",
        "precision_bits": args.precision_bits,
        "exact_inputs": {
            "probabilities": ["3000/3001", "1/3001"],
            "rho": [
                ["3/4", "sqrt(3)/4"],
                ["sqrt(3)/4", "1/4"],
            ],
            "sigma": [
                ["1/2000", "-1/75"],
                ["-1/75", "1999/2000"],
            ],
        },
        "quantities": {
            name: ball_text(value) for name, value in values.items()
        },
        "checks": checks,
        "conclusion": (
            "Certified counterexample: I(A;B|C) < 0.000435 bits while "
            "-log2(F) > 0.000466 bits."
        ),
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
