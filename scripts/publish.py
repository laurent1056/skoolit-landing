#!/usr/bin/env python3
"""
Publish scheduled pages for getskoolit.com.

Usage:
  python3 scripts/publish.py               # publish today's pages
  python3 scripts/publish.py 2026-08-08    # simulate a specific date (for testing)
  python3 scripts/publish.py --all         # publish everything (emergency catch-up)
"""

import json
import re
import sys
from datetime import date
from pathlib import Path

NOINDEX_BLOCK = '  <!-- publish:noindex -->\n  <meta name="robots" content="noindex,nofollow" />\n  <!-- /publish:noindex -->\n'
SITEMAP_CLOSE = '</urlset>'
SITEMAP_PATH = Path('public/sitemap.xml')
SCHEDULE_PATH = Path('publish-schedule.json')

def sitemap_entry(url, lastmod):
    return (
        f'  <url>\n'
        f'    <loc>{url}</loc>\n'
        f'    <lastmod>{lastmod}</lastmod>\n'
        f'  </url>\n'
    )

def publish_pages(pages):
    published = []
    sitemap = SITEMAP_PATH.read_text()

    for page in pages:
        filepath = Path(page['file'])
        if not filepath.exists():
            print(f'  WARNING: {filepath} not found — skipping')
            continue

        content = filepath.read_text()
        if NOINDEX_BLOCK in content:
            content = content.replace(NOINDEX_BLOCK, '')
            filepath.write_text(content)
            print(f'  ✓ Removed noindex from {filepath}')
        else:
            print(f'  — {filepath} already published (noindex block not found)')

        # Add to sitemap if not already present
        if page['url'] not in sitemap:
            entry = sitemap_entry(page['url'], date.today().isoformat())
            sitemap = sitemap.replace(SITEMAP_CLOSE, entry + SITEMAP_CLOSE)
            print(f'  ✓ Added {page["url"]} to sitemap')
        else:
            print(f'  — {page["url"]} already in sitemap')

        published.append(page['file'])

    SITEMAP_PATH.write_text(sitemap)
    return published

def main():
    if not SCHEDULE_PATH.exists():
        print('ERROR: publish-schedule.json not found')
        sys.exit(1)

    schedule = json.loads(SCHEDULE_PATH.read_text())

    # Determine which dates to publish
    if '--all' in sys.argv:
        target_dates = sorted(schedule.keys())
        print(f'Publishing ALL scheduled dates: {", ".join(target_dates)}')
    elif len(sys.argv) > 1 and not sys.argv[1].startswith('--'):
        target_dates = [sys.argv[1]]
        print(f'Publishing pages scheduled for {sys.argv[1]} (simulated)')
    else:
        today = date.today().isoformat()
        target_dates = [today]
        print(f'Publishing pages scheduled for {today}')

    total = 0
    for target_date in target_dates:
        pages = schedule.get(target_date, [])
        if not pages:
            print(f'  No pages scheduled for {target_date}')
            continue
        print(f'\n{target_date} — {len(pages)} page(s):')
        published = publish_pages(pages)
        total += len(published)

    print(f'\nDone. {total} page(s) published.')

if __name__ == '__main__':
    main()
