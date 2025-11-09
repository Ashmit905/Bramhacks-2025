#!/usr/bin/env python3
"""Trim and smooth CSV data for plotting.

Operations:
1) Drop the second column (keep only the first numeric column).
2) Keep only rows from START..END (inclusive), counting from 1 for non-empty lines.
3) Smooth by averaging every WINDOW samples (non-overlapping). The final partial
   window is included using its average.

Defaults are set for this repository:
    --input bramhacks/public/data.csv
    --output bramhacks/public/data_smooth.csv
        --start 28383 --end 166493 --window 10 --scale 1

Usage:
  python trim_smooth.py -v
  python trim_smooth.py --start 100 --end 10000 --window 20 -i path/in.csv -o path/out.csv
"""

from __future__ import annotations

import argparse
import sys
from typing import Iterable, Tuple


def iter_first_col_in_range(path: str, start: int, end: int) -> Iterable[float]:
    """Yield first-column floats for non-empty CSV lines whose 1-based line index
    (counting only non-empty lines) falls within [start, end].
    """
    idx = 0
    with open(path, "r", encoding="utf-8") as f:
        for line_no, line in enumerate(f, 1):
            s = line.strip()
            if not s:
                continue
            idx += 1
            if idx < start:
                continue
            if idx > end:
                break
            # split on first comma, keep the first column
            first = s.split(",", 1)[0]
            try:
                yield float(first)
            except ValueError:
                # skip malformed lines within the range
                continue


def smooth_average(values: Iterable[float], window: int) -> Tuple[int, list[float]]:
    """Return (count_in, smoothed_values) averaging every `window` samples.
    Final partial window is included.
    """
    if window <= 0:
        raise ValueError("window must be > 0")
    out: list[float] = []
    buf: list[float] = []
    count_in = 0
    for v in values:
        count_in += 1
        buf.append(v)
        if len(buf) >= window:
            out.append(sum(buf) / len(buf))
            buf.clear()
    if buf:
        out.append(sum(buf) / len(buf))
    return count_in, out


def write_csv(path: str, values: Iterable[float]) -> int:
    n = 0
    with open(path, "w", encoding="utf-8") as out:
        out.write("value\n")
        for v in values:
            out.write(f"{v}\n")
            n += 1
    return n


def parse_args(argv: list[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Trim and smooth CSV data (drop 2nd column, slice lines, average windows)")
    p.add_argument("--input", "-i", default="bramhacks/public/data.csv", help="Input CSV path")
    p.add_argument("--output", "-o", default="bramhacks/public/data_smooth.csv", help="Output CSV path")
    p.add_argument("--start", type=int, default=28383, help="1-based start index (non-empty lines)")
    p.add_argument("--end", type=int, default=166493, help="1-based end index inclusive (non-empty lines)")
    p.add_argument("--window", type=int, default=10, help="Smoothing window size (average every N samples)")
    p.add_argument("--scale", type=float, default=1.0, help="Multiply each smoothed value by this factor (angle correction)")
    p.add_argument("--verbose", "-v", action="store_true", help="Print progress")
    return p.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    try:
        values_in_range = list(iter_first_col_in_range(args.input, args.start, args.end))
        count_in = len(values_in_range)
        _, smoothed = smooth_average(values_in_range, args.window)
        if args.scale != 1.0:
            smoothed = [v * args.scale for v in smoothed]
        count_out = write_csv(args.output, smoothed)
        if args.verbose:
            print(f"Input rows used: {count_in} (from {args.start}..{args.end})")
            print(f"Smoothed (window={args.window}) rows written: {count_out} -> {args.output}")
            print(f"Scale factor applied: {args.scale}")
    except FileNotFoundError:
        print(f"Input file not found: {args.input}", file=sys.stderr)
        return 1
    except Exception as e:  # pylint: disable=broad-except
        print(f"Error: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
