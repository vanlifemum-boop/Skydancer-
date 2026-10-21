"""Dependency-free SEO, content and asset regression checks."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://vanlifemum-boop.github.io/Skydancer-/'

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.elements = []
        self.ids = []
        self.text = []
        self.scripts = []
        self.current_script = None
        self.script_attrs = None
        self.hidden = 0
        self.faq_summaries = []
        self.summary = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'script':
            self.current_script = []
            self.script_attrs = attrs
        if tag == 'summary':
            self.summary = []
        if tag in ('script', 'style'):
            self.hidden += 1
    def handle_endtag(self, tag):
        if tag == 'script' and self.current_script is not None:
            self.scripts.append((self.script_attrs, ''.join(self.current_script)))
            self.current_script = None
        if tag == 'summary' and self.summary is not None:
            self.faq_summaries.append(''.join(self.summary))
            self.summary = None
        if tag in ('script', 'style'):
            self.hidden -= 1
    def handle_data(self, data):
        if self.current_script is not None:
            self.current_script.append(data)
        if self.summary is not None:
            self.summary.append(data)
        if not self.hidden:
            self.text.append(data)

page = Page()
page.feed((ROOT / 'index.html').read_text())
visible = ' '.join(' '.join(page.text).split())
meta = {attrs.get('name', attrs.get('property')): attrs.get('content') for tag, attrs in page.elements if tag == 'meta'}
assert len(page.ids) == len(set(page.ids)), 'Duplicate element IDs'
assert sum(tag == 'h1' for tag, _ in page.elements) == 1, 'Need exactly one H1'
assert any(tag == 'html' and attrs.get('lang') == 'de' for tag, attrs in page.elements)
assert any(tag == 'link' and attrs.get('rel') == 'canonical' and attrs.get('href') == BASE for tag, attrs in page.elements)
assert 110 <= len(meta['description']) <= 170
assert 'noindex' not in meta['robots']
assert meta['og:url'] == BASE and meta['og:image'].startswith(BASE)
assert meta['twitter:card'] == 'summary_large_image'
assert len(visible) > 6000 and 'Cabrio-Dach' in visible and 'Skydancer Diamond' in visible
assert not re.search('garage|apero', visible, re.I), 'Obsolete product emphasis'
assert not re.search(r'#(?:ecd6b4|f5f5dc)', (ROOT/'assets/site-v2.css').read_text(), re.I), 'Beige accent remains'
for tag, attrs in page.elements:
    if tag == 'img':
        assert attrs.get('alt') and int(attrs['width']) > 0 and int(attrs['height']) > 0
        if attrs.get('class') == 'vehicle-image':
            assert attrs.get('fetchpriority') == 'high' and attrs.get('loading') == 'eager'
    for field in ('href', 'src'):
        url = attrs.get(field, '')
        if not url:
            continue
        parsed = urlsplit(url)
        if url.startswith('#'):
            assert unquote(url[1:]) in page.ids, f'Broken fragment {url}'
        elif not parsed.scheme and not parsed.netloc:
            assert (ROOT / unquote(parsed.path)).is_file(), f'Missing local asset {url}'
    if attrs.get('target') == '_blank':
        assert 'noopener' in attrs.get('rel', '')
    if tag == 'source':
        for candidate in attrs['srcset'].split(','):
            assert (ROOT / candidate.strip().split(' ')[0]).is_file()
schema = [json.loads(content) for attrs, content in page.scripts if attrs.get('type') == 'application/ld+json']
assert len(schema) == 1
graph = schema[0]['@graph']
faq = next(node for node in graph if node['@type'] == 'FAQPage')
vehicle = next(node for node in graph if node['@type'] == 'Vehicle')
assert [entry['name'] for entry in faq['mainEntity']] == page.faq_summaries
for entry in faq['mainEntity']:
    assert entry['acceptedAnswer']['text'] in visible
assert vehicle['vehicleSeatingCapacity'] == 4 and 'offers' not in vehicle
assert len(faq['mainEntity']) == 8
radios = [attrs for tag, attrs in page.elements if tag == 'input' and attrs.get('type') == 'radio']
for name in ('furniture','upholstery','edition','weight'):
    assert sum(attrs.get('name') == name and 'checked' in attrs for attrs in radios) == 1
xml = ET.parse(ROOT / 'sitemap.xml')
ns = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
assert [entry.text for entry in xml.findall('.//s:loc',ns)] == [BASE]
assert 'noindex,follow' in (ROOT / '404.html').read_text()
assert '<script' not in (ROOT / '404.html').read_text()
assert not any(attrs.get('src','').endswith('index-BU_CIuCB.js') for tag,attrs in page.elements if tag == 'script')
print(f'PASS: {len(visible)} characters of visible static content, one H1, {len(faq["mainEntity"])} matching FAQs, metadata, schema, image assets, fragments, sitemap, 404, radio defaults.')
