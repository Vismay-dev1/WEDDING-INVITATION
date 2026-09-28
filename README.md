# 💍 Premium Digital Wedding Invitation — Hindu Wedding Edition

A cinematic, mobile-first digital wedding invitation in the style of modern premium wedding
websites — reimagined around a traditional Indian Hindu wedding, with the original
**Nadaswaram (Raga Valachi) background score retained**.

## ✨ The Experience

- **Sealed-envelope opening ceremony** — break the wax monogram seal, the flap lifts,
  the invitation card rises, the maroon curtains part and marigold petals rain down as the
  nadaswaram begins.
- **Premium motion system (hand-rolled, zero animation libraries)**
  - Letter-by-letter name reveals, line-mask reveals, blur/zoom/slide scroll reveals.
  - Ken Burns breathing + scroll parallax hero, rotating gold mandalas, swaying marigold *toran*.
  - Falling marigold-petal canvas (ambient + celebratory bursts), custom gold cursor,
    magnetic 3D tilt cards, scroll-progress bar, section dot-navigation.
  - Flip-tick countdown to the muhurtham, infinite gold marquee ribbon.
  - `prefers-reduced-motion` fully respected.
- **Hindu wedding programme** — Ganesh Pooja, Mehendi, Haldi, Sangeet Sandhya,
  the Wedding Muhurtham and Grand Reception, each with time, venue and dress code.
- **Muhurtham rituals timeline** — Kashi Yatra → Kanyadaanam → Mangalya Dharana →
  Saptapadi → Aashirvadam, on a deep-maroon gold stage.
- **Sanskrit invocation** (॥ श्री गणेशाय नमः ॥ and the Sarve Bhavantu Sukhinah shloka)
  set in Tiro Devanagari.
- **Digital invitation card** in a gold-arch frame with 3D tilt and tap-to-enlarge lightbox.
- **Sticky two-column love-story timeline** with a scroll-drawn gold line.
- **Gallery** — masonry grid with lightbox (keyboard: ←/→/Esc).
- **RSVP + Blessings Wall** — responses are sealed onto a wall of wishes (stored locally),
  with a petal-burst celebration on "joyfully accepts".
- **Venue** — map, travel notes, *Open in Maps*, *Save the Date* (.ics download)
  and *Share on WhatsApp*.
- **Music player** — floating gold disc with animated equaliser and spinning zari ring;
  the traditional nadaswaram track is unchanged.

## 🎨 Design Language

Ivory parchment · deep maroon · zari gold · marigold — harmonised with the printed
invitation card. Type: Cormorant Garamond (display), Marcellus (caps), Great Vibes
(script), Jost (body), Tiro Devanagari Sanskrit (Sanskrit).

## 🗂️ Files

| File | Purpose |
|---|---|
| `index.html` | Structure + inline SVG ornament library (mandala, toran, paisley, diya, kalash) |
| `style.css` | Full design system, reveals, responsive + reduced-motion rules |
| `script.js` | Gate ceremony, reveals, parallax, petals, countdown, RSVP, lightbox, share |
| `assets/` | Generated ceremony imagery (mandap, Ganesh pooja, sangeet, reception) + optimised hero |
| `saseendran-…mp3` | Retained nadaswaram background score |

## ✒️ Customisation

1. Search-replace `GROOM` / `BRIDE` (and the `G`/`B` seal/monogram letters) in `index.html`.
2. Edit dates, times and venues directly in the event cards and hero in `index.html`.
3. Countdown / muhurtham target: `WEDDING_TS` at the top of `script.js`.
4. Swap photos in the root and `assets/` folders; gallery entries live in `#gallery`.

## 🚀 Run

```bash
python3 -m http.server 8080   # or just open index.html
```

Handcrafted with ❤️ and आशीर्वाद.
