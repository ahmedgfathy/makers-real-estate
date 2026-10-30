# -*- coding: utf-8 -*-
import io
p = "/home/xinreal/makers/data/content.ts"
s = io.open(p, encoding="utf-8").read()

en_old = '''            { src: "/img/lakes-sunset.jpg", caption: "Waterfront living" },
            { src: "/img/lakes-garden.jpg", caption: "The water garden" },
            { src: "/img/lakes-walk.jpg", caption: "Sunken gardens and walkways" },
            { src: "/img/lakes-beach.jpg", caption: "Lagoon shoreline" },
            { src: "/img/lakes-building.jpg", caption: "Residential cluster" },'''
en_new = '''            { src: "/img/lakes-walk.jpg", caption: "The water garden" },
            { src: "/img/lakes-garden.jpg", caption: "Lagoon shoreline and beach" },
            { src: "/img/lakes-pool.jpg", caption: "The café pavilion" },
            { src: "/img/lakes-sunset.jpg", caption: "Residential clusters" },
            { src: "/img/lakes-building.jpg", caption: "Waterfront residences" },'''

ar_old = '''            { src: "/img/lakes-sunset.jpg", caption: "الحياة على المياه" },
            { src: "/img/lakes-garden.jpg", caption: "الحديقة المائية" },
            { src: "/img/lakes-walk.jpg", caption: "حدائق غاطسة وممرات" },
            { src: "/img/lakes-beach.jpg", caption: "شاطئ البحيرة" },
            { src: "/img/lakes-building.jpg", caption: "مجموعة سكنية" },'''
ar_new = '''            { src: "/img/lakes-walk.jpg", caption: "الحديقة المائية" },
            { src: "/img/lakes-garden.jpg", caption: "شاطئ البحيرة" },
            { src: "/img/lakes-pool.jpg", caption: "كشك المقهى" },
            { src: "/img/lakes-sunset.jpg", caption: "مجموعات سكنية" },
            { src: "/img/lakes-building.jpg", caption: "وحدات على المياه" },'''

for tag, old, new in (("EN", en_old, en_new), ("AR", ar_old, ar_new)):
    print(tag, "found:", old in s)
    s = s.replace(old, new)

io.open(p, "w", encoding="utf-8").write(s)
print("beach refs left:", s.count("lakes-beach"))