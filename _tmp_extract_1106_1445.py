from pathlib import Path
from pypdf import PdfReader

pdf = Path("paper_1106.1445.pdf")
out = Path("paper_1106.1445.txt")
reader = PdfReader(str(pdf))
with out.open("w", encoding="utf-8") as f:
    for i, page in enumerate(reader.pages, start=1):
        f.write(f"\n\n===== PDF PAGE {i} =====\n")
        f.write(page.extract_text() or "")
