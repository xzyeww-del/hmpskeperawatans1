Update gallery helper (bulk-edit)
================================

Small helper to bulk-update the gallery cards inside `index.html`.

Files added:

- `scripts/update-gallery.py` — Python script that edits gallery cards by index or title match.
- `scripts/gallery-mapping.example.json` — an example mapping that updates multiple items.

Requirements
------------
- Python 3.8+
- BeautifulSoup4 + lxml parser

Install dependencies (PowerShell):

```powershell
python -m pip install --upgrade pip
pip install beautifulsoup4 lxml
```

Quick usage
-----------

1. Edit `scripts/gallery-mapping.example.json` or create `my-mapping.json` with the structure: {"items": [{"index":1, "image":"...", "date":"...", "title":"...", "description":"..."}, ...] }
2. Run the script (it will create a backup `index.html.bak` by default):

```powershell
python scripts/update-gallery.py scripts/gallery-mapping.example.json --file index.html
```

Default behavior: match by index (1-based). You can change `--mode title` to match by existing title.

Examples
--------
Update the first and last card using the example mapping:

```powershell
python scripts/update-gallery.py scripts/gallery-mapping.example.json --file index.html
```

Notes and safety
----------------
- The script backs up `index.html` to `index.html.bak` unless `--no-backup` is passed.
- The script uses a few heuristics (first <img>, first <h3>, first descriptive <p>) that match the current site structure — if you made structural changes, verify before running.
