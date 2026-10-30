#!/usr/bin/env python3

import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import subprocess
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path


IGNORED_NAMES = {
    ".DS_Store",
    "Thumbs.db",
}

IGNORED_DIRECTORIES = {
    "__MACOSX",
    ".git",
    "node_modules",
}

DOCUMENT_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".txt",
}

ARCHIVE_EXTENSIONS = {
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
}


def format_size(size):
    units = ["B", "KB", "MB", "GB"]
    value = float(size)

    for unit in units:
        if value < 1024 or unit == units[-1]:
            return f"{value:.2f} {unit}"
        value /= 1024


def sha256_file(path):
    digest = hashlib.sha256()

    with path.open("rb") as file:
        for block in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(block)

    return digest.hexdigest()


def pdf_pages(path):
    if not shutil.which("pdfinfo"):
        return None

    try:
        result = subprocess.run(
            ["pdfinfo", str(path)],
            capture_output=True,
            text=True,
            check=False,
        )

        match = re.search(r"^Pages:\s+(\d+)", result.stdout, re.MULTILINE)
        return int(match.group(1)) if match else None
    except Exception:
        return None


def detect_category(relative_path):
    normalized = str(relative_path).lower()

    if "certificados de ana" in normalized:
        return "Certificado de análise"

    if "diagramas de hem" in normalized:
        return "Diagrama de hemácias"

    if "/fds/" in f"/{normalized}/" or normalized.startswith("fds/"):
        return "FDS"

    if "instru" in normalized and "uso" in normalized:
        return "Instrução de uso"

    if "apostila" in normalized:
        return "Apostila"

    if relative_path.suffix.lower() in ARCHIVE_EXTENSIONS:
        return "Arquivo compactado"

    return "Outro"


def detect_lot(path, category):
    if category != "Certificado de análise":
        return None

    filename = path.stem.strip()

    if re.fullmatch(r"[A-Za-z0-9_-]+", filename):
        return filename

    return None


def detect_validity(relative_path):
    patterns = [
        r"Val[_ ]*\s*(\d{2})-(\d{2})-(\d{4})",
        r"validade[_ -]*(\d{2})-(\d{2})-(\d{4})",
    ]

    text = str(relative_path)

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            day, month, year = match.groups()

            try:
                date = datetime(
                    int(year),
                    int(month),
                    int(day),
                )

                return date.strftime("%Y-%m-%d")
            except ValueError:
                return None

    return None


def suggested_for_github(path, size, category):
    extension = path.suffix.lower()

    if path.name in IGNORED_NAMES:
        return False, "Arquivo de sistema"

    if extension in ARCHIVE_EXTENSIONS:
        return False, "Arquivo compactado; conteúdo já existe descompactado"

    if size > 100 * 1024 * 1024:
        return False, "Arquivo acima do limite de 100 MB do GitHub"

    if category == "Certificado de análise":
        return False, "Recomendado armazenamento documental externo"

    return True, "Pode ser versionado no GitHub"


def main():
    parser = argparse.ArgumentParser(
        description="Analisa recursivamente os documentos da ImunoScan."
    )

    parser.add_argument(
        "directory",
        help="Diretório que será analisado",
    )

    parser.add_argument(
        "--output",
        default="inventario-documentos",
        help="Prefixo dos arquivos de saída",
    )

    args = parser.parse_args()

    root = Path(args.directory).expanduser().resolve()

    if not root.exists() or not root.is_dir():
        raise SystemExit(f"Diretório inválido: {root}")

    records = []
    hashes = defaultdict(list)
    categories = Counter()
    extensions = Counter()
    total_size = 0

    files = sorted(
        path
        for path in root.rglob("*")
        if path.is_file()
        and path.name not in IGNORED_NAMES
        and not any(part in IGNORED_DIRECTORIES for part in path.parts)
    )

    print(f"Analisando: {root}")
    print(f"Arquivos encontrados: {len(files)}")
    print()

    for index, path in enumerate(files, start=1):
        relative = path.relative_to(root)
        stat = path.stat()
        size = stat.st_size
        extension = path.suffix.lower()
        category = detect_category(relative)
        digest = sha256_file(path)
        pages = pdf_pages(path) if extension == ".pdf" else None
        lot = detect_lot(path, category)
        validity = detect_validity(relative)

        upload, reason = suggested_for_github(
            path,
            size,
            category,
        )

        modified = datetime.fromtimestamp(
            stat.st_mtime
        ).astimezone()

        record = {
            "relative_path": str(relative),
            "filename": path.name,
            "extension": extension,
            "category": category,
            "size_bytes": size,
            "size_formatted": format_size(size),
            "modified_at": modified.isoformat(timespec="seconds"),
            "pdf_pages": pages,
            "lot": lot,
            "valid_until": validity,
            "sha256": digest,
            "recommended_for_github": upload,
            "recommendation": reason,
        }

        records.append(record)
        hashes[digest].append(str(relative))
        categories[category] += 1
        extensions[extension or "(sem extensão)"] += 1
        total_size += size

        print(
            f"[{index:03}/{len(files):03}] "
            f"{category}: {relative}"
        )

    duplicates = {
        digest: paths
        for digest, paths in hashes.items()
        if len(paths) > 1
    }

    summary = {
        "analyzed_directory": str(root),
        "generated_at": datetime.now()
        .astimezone()
        .isoformat(timespec="seconds"),
        "total_files": len(records),
        "total_size_bytes": total_size,
        "total_size_formatted": format_size(total_size),
        "categories": dict(categories),
        "extensions": dict(extensions),
        "duplicate_groups": duplicates,
        "github_recommended_count": sum(
            1 for record in records
            if record["recommended_for_github"]
        ),
        "github_not_recommended_count": sum(
            1 for record in records
            if not record["recommended_for_github"]
        ),
    }

    output_prefix = Path(args.output)

    json_path = output_prefix.with_suffix(".json")
    csv_path = output_prefix.with_suffix(".csv")
    summary_path = output_prefix.with_name(
        output_prefix.name + "-resumo.json"
    )

    with json_path.open("w", encoding="utf-8") as file:
        json.dump(
            records,
            file,
            ensure_ascii=False,
            indent=2,
        )

    with csv_path.open(
        "w",
        encoding="utf-8-sig",
        newline="",
    ) as file:
        writer = csv.DictWriter(
            file,
            fieldnames=records[0].keys() if records else [],
        )

        if records:
            writer.writeheader()
            writer.writerows(records)

    with summary_path.open("w", encoding="utf-8") as file:
        json.dump(
            summary,
            file,
            ensure_ascii=False,
            indent=2,
        )

    print()
    print("Análise concluída.")
    print(f"Quantidade de arquivos: {len(records)}")
    print(f"Tamanho total: {format_size(total_size)}")
    print(f"Grupos de duplicados: {len(duplicates)}")
    print()
    print("Arquivos gerados:")
    print(f"- {json_path}")
    print(f"- {csv_path}")
    print(f"- {summary_path}")

    if not shutil.which("pdfinfo"):
        print()
        print(
            "Aviso: pdfinfo não está instalado; "
            "a quantidade de páginas não foi coletada."
        )
        print(
            "No Mac, instale com: brew install poppler"
        )


if __name__ == "__main__":
    main()
