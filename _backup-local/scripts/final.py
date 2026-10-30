import io, json
root = "/home/xinreal/makers/"

# metadataBase so social images resolve
p = root + "app/layout.tsx"
s = io.open(p, encoding="utf-8").read()
old = "export const metadata: Metadata = {\n  title: content.en.meta.title,"
new = ("export const metadata: Metadata = {\n"
       "  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? \"http://localhost:3000\"),\n"
       "  title: content.en.meta.title,")
print("layout patch:", old in s)
s = s.replace(old, new, 1)
io.open(p, "w", encoding="utf-8").write(s)

# package scripts: preview helper
p = root + "package.json"
pkg = json.load(io.open(p, encoding="utf-8"))
pkg["scripts"] = {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "preview": "next build && next start",
    "lint": "next lint",
}
io.open(p, "w", encoding="utf-8").write(json.dumps(pkg, indent=2) + "\n")
print("scripts:", pkg["scripts"])