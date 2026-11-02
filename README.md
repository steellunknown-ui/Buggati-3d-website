# Bugatti Bolide EB.01 — Interactive Scroll Experience

A premium bespoke **Next.js 14** scroll-driven animation website featuring the Bugatti Bolide EB.01 hypercar exploded-view sequence.

## Features

- **276 frames** at 2560×1440 (39.7 MB WebP at Quality 86)
- **60 FPS** locked Canvas RAF loop — scroll is the sole source of truth
- **Eager 16-worker preloader** with `img.decode()` into GPU RAM
- **Bespoke design system**: Obsidian void, Glacier Blue, Titanium White
- Telemetry HUD (frame counter, FPS, asset load status)
- HUD annotations appearing at specific scroll ranges
- Technical Specifications drawer
- Vertical stage rail (ASSEMBLED → CLOSURES → POWERTRAIN → SKELETON)
- Grain overlay, cinematic vignette, ambient glow
- Custom cursor
- Mobile responsive
- Reduced-motion respect

## Color Palette

| Token        | Hex       | Role                |
|--------------|-----------|---------------------|
| `--bg`       | `#07070A` | Obsidian Void       |
| `--surface`  | `#0D0D12` | Card / drawer       |
| `--ink`      | `#F5F5F0` | Titanium White type |
| `--accent`   | `#C9F0FF` | Glacier Blue        |
| `--gold`     | `#B8A882` | Old Gold accent     |
| `--dim`      | `#6E6E7A` | Subdued text        |
| `--line`     | `#1E1E26` | Rule / border       |

## Dev Server

```bash
npm run dev      # → http://localhost:3001
npm run build    # production build
```

## Frame Pipeline

```bash
python scripts/convert_frames.py
# Source: D:\3d-Website\public\frame_001.jpg → frame_276.jpg
# Output: public/frames/frame_0001.webp → frame_0276.webp
# Quality: 86 WebP (Lanczos) — 39.7 MB total
```

## Credits

Bugatti Automobiles S.A.S. — Bolide EB.01 (2020).  
Built by steellunknown-ui.
