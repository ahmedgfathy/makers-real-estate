# -*- coding: utf-8 -*-
import io
p = "/home/xinreal/makers/data/content.ts"
s = io.open(p, encoding="utf-8").read()
orig = s
pairs = [
    ('55% open", image: "/img/lakes-beach.jpg"', '55% open", image: "/img/master-plan.jpg"'),
    ('55% مفتوحة", image: "/img/lakes-beach.jpg"', '55% مفتوحة", image: "/img/master-plan.jpg"'),
    ('Waterfront clusters at golden hour', 'Waterfront living'),
    ('المجموعات السكنية على المياه', 'الحياة على المياه'),
]
for old, new in pairs:
    print(("ok  " if old in s else "MISS"), old[:48])
    s = s.replace(old, new)
# sodic-east panel heroes (image key) -> master plan
cnt = s.count('image: "/img/lakes-beach.jpg"')
print("panel hero occurrences:", cnt)
s = s.replace('image: "/img/lakes-beach.jpg"', 'image: "/img/master-plan.jpg"')
io.open(p, "w", encoding="utf-8").write(s)
print("changed:", s != orig)