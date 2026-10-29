set -uo pipefail
cd /home/xinreal/makers
Z2="_src/z2"
mk () {
  ffmpeg -y -loglevel error -i "$1" -vf "crop=iw-24:ih-36:12:12,scale=1280:-2,eq=$3" -q:v 3 "public/img/$2.jpg"
}
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.13 PM (3).jpeg" lakes-garden   "contrast=1.04:saturation=1.06"
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.13 PM (4).jpeg" lakes-building "contrast=1.04:saturation=1.06"
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.13 PM (5).jpeg" lakes-sunset   "contrast=1.04:saturation=1.06"
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.13 PM.jpeg"     lakes-beach    "contrast=1.04:saturation=1.06"
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.14 PM (1).jpeg" lakes-walk     "contrast=1.04:saturation=1.06"
mk "$Z2/WhatsApp Image 2026-10-26 at 7.24.14 PM.jpeg"     master-plan    "contrast=1.05:saturation=0.86:brightness=-0.03"

# tile 01 gets the garden/lagoon render; keep a dedicated pool image for the panel hero
ffmpeg -y -loglevel error -i "$Z2/WhatsApp Image 2026-10-26 at 7.24.13 PM (3).jpeg" \
  -vf "crop=iw-24:ih-36:12:12,scale=1280:-2,eq=contrast=1.04:saturation=1.06" -q:v 3 public/img/lakes-pool.jpg
ls -la public/img