# Problem JSON pool

This directory contains one generated JSON record for each
`../problem_pool/problem_N.tex` file. The TeX files remain the authoritative
source; regenerate the JSON records after changing them by running
`../generate_problem_json.py` from any working directory.

Do not edit generated JSON records by hand. Problem tags originate from
`../_tag_list.json` and are validated during generation.

## Representation

- `problem_number`, `title`, `section_label`, `id`, `status`, and `tags` expose
  frequently queried metadata directly.
- `sections` stores the problem statement, status, source attribution,
  progress, references, comment, tags, and ID. Fields named `latex` preserve
  their TeX content.
- `sections.source.citations` lists the alpha key and TeX label of each paper
  or preprint cited as a source. It is empty only when the source names a
  contributor or is `unknown`.
- `sections.progress.items` separates the progress bullets without modifying
  their LaTeX.
- `sections.references.entries` exposes each alpha citation key, TeX label,
  and complete reference entry.
- `equations` lists every numbered equation with its label and original LaTeX.
- `source_tex` contains the complete source file for lossless round-trip
  recovery.
- `source.sha256` verifies that `source_tex` and the corresponding TeX file are
  synchronized.

All files use UTF-8. Backslashes, newlines, quotation marks, and other control
characters are encoded with standard JSON escaping; no mathematical content is
converted away from LaTeX.

## Extraction examples

Print the problem statement as TeX:

```sh
jq -r '.sections.problem_statement.latex' problem_1.json
```

Print the second progress item:

```sh
jq -r '.sections.progress.items[1].latex' problem_1.json
```

Print the source attribution:

```sh
jq -r '.sections.source.latex' problem_1.json
```

Emit the exact complete TeX source without adding a newline:

```sh
jq -rj '.source_tex' problem_1.json
```
