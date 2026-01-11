#!/usr/bin/env python3
"""
update-gallery.py

Small helper to bulk-update gallery cards inside index.html.

Usage:
  python scripts/update-gallery.py mapping.json [--file index.html] [--mode index|title] [--backup]

Mapping format (example file provided alongside):
{
  "items": [
    {"index": 1, "image": "new1.png", "date": "1 Jan 2026", "title": "New Title 1", "description": "New description 1"},
    {"index": 3, "image": "new3.png", "title": "Another title"}
  ]
}

Behavior: default matching mode is by index (1-based). The script will create a backup of the input file
called <file>.bak unless you pass --no-backup. It uses BeautifulSoup (bs4).
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except Exception:
    print("ERROR: BeautifulSoup (bs4) is required. Install with: pip install beautifulsoup4 lxml")
    sys.exit(1)


def load_mapping(path: Path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def find_gallery_cards(soup):
    # Gallery cards: within section #galeri .grid > > .card-hover (six items)
    gal = soup.select('#galeri .grid')[0] if soup.select('#galeri .grid') else None
    if not gal:
        # fallback: the first .grid under #galeri
        gal = soup.find(id='galeri') and soup.find(id='galeri').find('div', class_='grid')
    if not gal:
        return []
    cards = [e for e in gal.find_all(recursive=False) if 'card-hover' in ' '.join(e.get('class', []))]
    # fallback: allow deeper
    if not cards:
        cards = gal.find_all(class_='card-hover')
    return cards


def update_by_index(soup, mapping_items):
    cards = find_gallery_cards(soup)
    if not cards:
        raise RuntimeError('No gallery cards found in #galeri')
    for item in mapping_items:
        idx = int(item.get('index', 0))
        if idx <= 0 or idx > len(cards):
            print(f"Warning: index {idx} is out of bounds (1..{len(cards)}) - skipping")
            continue
        card = cards[idx - 1]
        apply_updates_to_card(card, item)


def apply_updates_to_card(card, item):
    # Update image <img> inside the first .ratio-3-2 or any <img> inside
    img_tag = card.find('img')
    if item.get('image') is not None and img_tag:
        img_tag['src'] = item['image']

    # Update date located inside a <span> following the calendar icon
    if item.get('date') is not None:
        date_span = card.select_one('div.flex.items-center.text-gray-500 span') or card.select_one('span')
        if date_span:
            date_span.string = item['date']

    # Title --- first h3
    if item.get('title') is not None:
        h3 = card.find('h3')
        if h3:
            h3.string = item['title']

    # description --- first paragraph under card
    if item.get('description') is not None:
        p = None
        # description paragraph often is <p class="text-gray-0"> or similar
        for candidate in card.find_all('p'):
            # skip date span already handled
            if candidate.find('i'):
                continue
            # choose the longer paragraph (heuristic)
            p = candidate
            break
        if p:
            p.string = item['description']


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mapping', type=Path, help='JSON mapping file describing updates')
    ap.add_argument('--file', type=Path, default=Path('index.html'), help='HTML file to edit')
    ap.add_argument('--mode', choices=['index', 'title'], default='index', help='Match mode (index=position OR title)')
    ap.add_argument('--no-backup', action='store_true', help='Do not create a backup copy')
    args = ap.parse_args()

    if not args.mapping.exists():
        print('mapping file not found:', args.mapping)
        sys.exit(2)
    if not args.file.exists():
        print('target file not found:', args.file)
        sys.exit(2)

    mapping = load_mapping(args.mapping)
    items = mapping.get('items', [])

    content = args.file.read_text(encoding='utf-8')
    soup = BeautifulSoup(content, 'lxml')

    if args.mode == 'index':
        update_by_index(soup, items)
    else:
        # title match (safe fallback): match by existing h3 text
        cards = find_gallery_cards(soup)
        title_map = {c.find('h3').get_text(strip=True): c for c in cards if c.find('h3')}
        for item in items:
            key = item.get('title_match') or item.get('title')
            if not key:
                print('Skipping item without title/title_match for title matching mode')
                continue
            card = title_map.get(key)
            if not card:
                print(f'No gallery card matched title "{key}"')
                continue
            apply_updates_to_card(card, item)

    # create backup
    if not args.no_backup:
        bak = args.file.with_suffix(args.file.suffix + '.bak')
        print('Creating backup:', bak)
        shutil.copyfile(args.file, bak)

    args.file.write_text(str(soup), encoding='utf-8')
    print('Updated', args.file)


if __name__ == '__main__':
    main()
