import io
p = "/home/xinreal/makers/app/globals.css"
s = io.open(p, encoding="utf-8").read()
old = "  overflow: hidden;\n  transition: color 0.4s var(--ease), border-color 0.4s var(--ease), background 0.4s var(--ease);\n}"
new = "  overflow: hidden;\n  white-space: nowrap;\n  transition: color 0.4s var(--ease), border-color 0.4s var(--ease), background 0.4s var(--ease);\n}"
print("found:", old in s)
s = s.replace(old, new, 1)
io.open(p, "w", encoding="utf-8").write(s)