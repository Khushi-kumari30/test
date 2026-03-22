from __future__ import annotations

from io import BytesIO

import fitz  # PyMuPDF
from fastapi import UploadFile


def extract_text_from_pdf(upload_file: UploadFile, max_chars: int = 60_000) -> str:
    """
    Best-effort PDF text extraction.
    If extraction fails, return empty string so the system can still run heuristics.
    """
    data = upload_file.file.read()
    if not data:
        return ""

    try:
        doc = fitz.open(stream=BytesIO(data), filetype="pdf")
        parts: list[str] = []
        for page in doc:
            parts.append(page.get_text("text") or "")
            if sum(len(p) for p in parts) >= max_chars:
                break
        return "\n".join(parts)[:max_chars]
    except Exception:
        return ""

