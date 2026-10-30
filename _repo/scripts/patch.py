import io, re, sys

root = "/home/xinreal/makers"

def patch(path, pairs, required=True):
    with io.open(path, encoding="utf-8") as f:
        s = f.read()
    orig = s
    for old, new in pairs:
        if old not in s:
            print("MISS in %s: %r" % (path, old[:70]))
        s = s.replace(old, new)
    if s != orig:
        with io.open(path, "w", encoding="utf-8") as f:
            f.write(s)
    print("patched", path, "changed" if s != orig else "unchanged")

# 1) payment panel: make price the total, monthly the monthly figure
pairs = []
for monthly, total in [
    ("55,833", "6,700,000"),
    ("90,833", "10,900,000"),
    ("110,000", "13,200,000"),
    ("117,500", "14,100,000"),
    ("125,250", "15,030,000"),
    ("218,767", "26,252,000"),
]:
    pairs.append(('price: "%s", monthly: "per month"' % monthly,
                  'price: "%s", monthly: "%s"' % (total, monthly)))
    pairs.append(('price: "%s", monthly: "شهريًا"' % monthly,
                  'price: "%s", monthly: "%s"' % (total, monthly)))

patch(root + "/data/content.ts", pairs)

# 2) collection counter wording
patch(root + "/components/Collection.tsx", [("{t.units}", "{t.collections}")])

# 3) labels: add collections key
patch(root + "/lib/labels.ts", [
    ('units: "units",', 'units: "units",\n    collections: "offerings",'),
    ('units: "وحدة",', 'units: "وحدة",\n    collections: "مجموعات",'),
])

# 4) layout: ReactNode import
patch(root + "/app/layout.tsx", [
    ('import type { Metadata, Viewport } from "next";',
     'import type { Metadata, Viewport } from "next";\nimport type { ReactNode } from "react";'),
    ("{ children: React.ReactNode }", "{ children: ReactNode }"),
])
print("done")