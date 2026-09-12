#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Reconstruct Peter's two states and certify their ordinary-Petz gaps.

Run: python3 scripts/verify-petz-counterexamples.py
Requires SymPy (verified with 1.14.0). See database/proofs/ordinary-petz.md.

Matrix identities use SymPy; scalar enclosures use exact rational arithmetic.
Only the defining vectors are taken as input, not submitted intermediate matrices.
"""
from fractions import Fraction as Q
from functools import lru_cache
from itertools import product
from math import isqrt
import json
import sympy as s


class Interval:
    def __init__(self, lo, hi=None):
        self.lo, self.hi = Q(lo), Q(lo if hi is None else hi)
        assert self.lo <= self.hi

    def __add__(self, other):
        return Interval(self.lo + other.lo, self.hi + other.hi)

    def __neg__(self):
        return Interval(-self.hi, -self.lo)

    def __sub__(self, other):
        return self + -other

    def __mul__(self, other):
        ends = [a * b for a in (self.lo, self.hi) for b in (other.lo, other.hi)]
        return Interval(min(ends), max(ends))

    def sqrt(self):
        assert self.lo >= 0
        scale = 10**40
        def floor_root(x):
            n = isqrt((x.numerator * scale**2) // x.denominator)
            assert Q(n, scale)**2 <= x < Q(n + 1, scale)**2
            return n
        return Interval(Q(floor_root(self.lo), scale), Q(floor_root(self.hi) + 1, scale))

    def reciprocal(self):
        assert self.lo > 0 or self.hi < 0
        return Interval(1 / self.hi, 1 / self.lo)

    def decimal_bounds(self, digits=18):
        scale = 10**digits
        lo = self.lo.numerator * scale // self.lo.denominator
        hi = -((-self.hi.numerator * scale) // self.hi.denominator)
        def show(n):
            return ('-' if n < 0 else '') + str(abs(n) // scale) + '.' + str(abs(n) % scale).zfill(digits)
        return [show(lo), show(hi)]


@lru_cache(None)
def enclose(expr):
    expr = s.sympify(expr)
    if expr.is_Rational:
        return Interval(Q(int(expr.p), int(expr.q)))
    if expr.is_Add or expr.is_Mul:
        value = Interval(0 if expr.is_Add else 1)
        for arg in expr.args:
            value = value + enclose(arg) if expr.is_Add else value * enclose(arg)
        return value
    if expr.is_Pow:
        base, exponent = expr.args
        if exponent == s.Rational(1, 2):
            return enclose(base).sqrt()
        if exponent == s.Rational(-1, 2):
            return enclose(base).sqrt().reciprocal()
        if exponent == -1:
            return enclose(base).reciprocal()
    raise ValueError(f'Unsupported algebraic expression: {expr}')


@lru_cache(None)
def ln_unit(x):
    assert 1 <= x <= 2
    z = (x - 1) / (x + 1)
    terms = 60
    total = sum((2 * z**(2*j + 1) / (2*j + 1) for j in range(terms)), Q(0))
    tail = 2 * z**(2*terms + 1) / ((2*terms + 1) * (1 - z*z))
    return Interval(total, total + tail)


def log_point(x):
    assert x > 0
    exponent = 0
    while x < 1:
        x *= 2
        exponent -= 1
    while x >= 2:
        x /= 2
        exponent += 1
    return Interval(exponent) + ln_unit(x) * ln_unit(Q(2)).reciprocal()


def log_interval(x):
    return Interval(log_point(x.lo).lo, log_point(x.hi).hi)


def entropy(matrix):
    result = Interval(0)
    spectrum = matrix.eigenvals()
    for eigenvalue, multiplicity in spectrum.items():
        if eigenvalue == 0:
            continue
        x = enclose(eigenvalue)
        assert x.lo > 0 and x.hi <= 1
        result = result - Interval(multiplicity) * x * log_interval(x)
    return result, {str(k): v for k, v in spectrum.items()}


def index(bits):
    return sum(bit << (len(bits) - 1 - j) for j, bit in enumerate(bits))


def marginal(rho, keep):
    """Sum over matching traced-out bits; keep is an ordered list of qubits."""
    lost = [i for i in range(3) if i not in keep]
    basis = list(product(range(2), repeat=len(keep)))
    result = s.zeros(len(basis))
    for i, left in enumerate(basis):
        for j, right in enumerate(basis):
            for hidden in product(range(2), repeat=len(lost)):
                a, b = [0]*3, [0]*3
                for k, l, r in zip(keep, left, right):
                    a[k], b[k] = l, r
                for k, v in zip(lost, hidden):
                    a[k] = b[k] = v
                result[i, j] += rho[index(a), index(b)]
    return result


def positive_root(matrix):
    # Derive 1x1 and 2x2 block roots from the computed matrix, not submitted values.
    root = s.zeros(matrix.rows)
    remaining = set(range(matrix.rows))
    while remaining:
        component = {min(remaining)}
        while True:
            expanded = component | {j for i in component for j in remaining if matrix[i, j] != 0}
            if expanded == component:
                break
            component = expanded
        indices = sorted(component)
        remaining -= component
        block = matrix.extract(indices, indices)
        if len(indices) == 1:
            block_root = s.Matrix([[s.sqrt(block[0, 0])]])
        else:
            assert len(indices) == 2 and block.is_positive_definite
            determinant_root = s.sqrt(block.det())
            block_root = (block + determinant_root*s.eye(2)) / s.sqrt(s.trace(block) + 2*determinant_root)
        for i, a in enumerate(indices):
            for j, b in enumerate(indices):
                root[a, b] = block_root[i, j]
    assert s.simplify(root * root - matrix) == s.zeros(matrix.rows)
    # Sylvester's criterion also checks that this is the positive square root.
    for size in range(1, matrix.rows + 1):
        assert enclose(s.simplify(root[:size, :size].det())).lo > 0
    return root


def verify(name, columns, norm, bracket):
    vectors = s.Matrix.hstack(*[s.Matrix(col) for col in columns])
    rho = vectors * vectors.T / norm
    assert s.trace(rho) == 1
    ac, bc, c = (marginal(rho, keep) for keep in ([0, 2], [1, 2], [2]))
    assert ac == bc and ac.is_positive_definite and c.is_positive_definite
    root, inverse = positive_root(ac), positive_root(c).inv()

    # Embed rho_BC with I_A, conjugate by the AC Petz operator in ABC order.
    order = [index([a, cbit, b]) for a, b, cbit in product(range(2), repeat=3)]
    petz_ac = root * s.kronecker_product(s.eye(2), inverse)
    left_acb = s.kronecker_product(petz_ac, s.eye(2))
    left_abc = left_acb.extract(order, order)
    sigma = s.simplify(left_abc * s.kronecker_product(s.eye(2), bc) * left_abc.T)
    assert sigma == sigma.T and s.trace(sigma) == 1
    # Positivity follows from this congruence of I_A tensor rho_BC.
    gram = s.simplify(vectors.T * sigma * vectors / norm)
    assert gram.is_diagonal()
    roots = Interval(0)
    for value in gram.diagonal():
        roots = roots + enclose(value).sqrt()
    fidelity = roots * roots
    assert 0 < fidelity.lo <= fidelity.hi <= 1
    h_ac, spec_ac = entropy(ac)
    h_bc, _ = entropy(bc)
    h_c, spec_c = entropy(c)
    h_rho, spec_rho = entropy(rho)
    cmi = h_ac + h_bc - h_c - h_rho
    surprisal = -log_interval(fidelity)
    gap = cmi - surprisal
    assert bracket[0] < gap.lo <= gap.hi < bracket[1] < 0
    return dict(name=name, rank=rho.rank(), marginal_ac=str(ac), marginal_c=str(c),
                spectrum_ac=spec_ac, spectrum_c=spec_c, spectrum_abc=spec_rho,
                fidelity_gram=str(gram), cmi=cmi.decimal_bounds(),
                fidelity=fidelity.decimal_bounds(), minus_log_fidelity=surprisal.decimal_bounds(),
                gap=gap.decimal_bounds(), certified=True)


if __name__ == '__main__':
    if not __debug__:
        raise SystemExit('Run without -O: exact certificate checks must remain enabled.')
    cases = [
        ('rank-two', [[10, 0, 0, 1, 0, 1, 0, 0], [0, 0, 1, 0, -1, 0, 0, 0]],
         104, (Q('-0.000881'), Q('-0.000880'))),
        ('rank-three', [[0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 0, 3, 0, -3, 0, 0],
                        [0, 5, 1, 0, 1, 0, 0, 0]],
         61, (Q('-0.004412'), Q('-0.0044'))),
    ]
    print(json.dumps({'sympy': s.__version__, 'certificates': [verify(*case) for case in cases]}, indent=2))
