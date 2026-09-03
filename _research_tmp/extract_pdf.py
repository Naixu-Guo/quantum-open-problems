from pathlib import Path

from pypdf import PdfReader


pdf_path = Path("_research_tmp/1106.1445.pdf")
text_path = Path("_research_tmp/1106.1445.txt")

reader = PdfReader(pdf_path)
with text_path.open("w", encoding="utf-8") as output:
    for page_number, page in enumerate(reader.pages, start=1):
        output.write(f"\n\n===== PDF PAGE {page_number} =====\n\n")
        output.write(page.extract_text() or "")

print(f"Extracted {len(reader.pages)} pages to {text_path}")
