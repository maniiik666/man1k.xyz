# Changelog — man1k.xyz

All notable changes to this site and its data files are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [3.0.1] — 2026-08-03

### Added
- `/event` — temporary redirect page for Ternopil flyer QR code; fires GA4 event `qr_scan_event_ternopil` (transport: beacon) before redirecting to WayForPay payment page; `noindex, nofollow` set; not added to sitemap or robots.txt

---

## [3.0.0] — 2026-07-24
## build 26.7 / JS v2.1 / artist.json v1.3

Major relaunch. Comprehensive overhaul of structure, content, identity data, artist metadata, legal, and technical infrastructure.

### Added

**Pages & Structure**
- `/press` — full EPK landing page with press materials and booking info
- `/press/faq` — press FAQ subpage
- `/press/genre` — Witch House genre explainer subpage
- `/legal/privacy`, `/legal/cookies`, `/legal/terms`, `/legal/copyright` — split legal docs into dedicated subpages under `/legal/`
- `/subscribe` — newsletter signup page (Buttondown integration)
- `/services` — booking & services page (Production, Mixing & Mastering, DJ, Management & Events)
- `/game/` — VOID SIGNAL VHS Arcade easter egg mini-game (Canvas 2D, vanilla JS, no dependencies)

**Artist Identity & Metadata**
- `artist.json` v1.3 — expanded Schema.org `MusicGroup`/`Person` structured data with full identity block
- ISNI `0000 0005 1101 6662`, IPI `01219097059`, MBID, VIAF, LOC authority record (`no2026031735`) added to structured data
- Wikidata entity `Q138478677` linked in sameAs
- Membership: The Ivors Academy (2026) recorded in artist data
- Wild Heart Tour (8 Ukrainian cities, 2026) documented in bio and structured data
- Amazing Radio airplay (40+ rotations) and 30,000+ DSP streams noted in description
- `pronouns: he/him` declared in identity block
- Japan performance history (CHERN Tokyo, Osaka) documented

**AI & Machine-Readable Layer**
- `llms.txt` — plain-text LLM-readable site manifest
- `ai.txt` (`.well-known/`) — AI crawl policy
- `ai:entity:*` meta tags (`artist`, `site`, `genre`, `location`, `agent`, `data:schema`) on all HTML pages
- `<link rel="alternate" type="application/ld+json">` pointing to `artist.json` on all pages
- `dataset-card.md` — Hugging Face dataset card

**Feeds & Discovery**
- `feed.xml` — RSS feed for new releases
- `events-feed.xml` — RSS feed for upcoming shows
- `shop-feed.xml` — RSS feed for merch & shop
- `<link rel="webmention">` pointing to webmention.io
- Three RSS `<link rel="alternate">` tags on homepage

**Analytics & Privacy**
- Simple Analytics (cookieless) added as primary analytics alongside GA4 and TikTok Pixel
- All three analytics providers suppressed when DNT or GPC signals are active
- GPC signal support (`gpc.json` in `.well-known/`)
- `dnt-policy.txt`, `privacy.txt`, `security.txt`, `security-policy.txt`, `mta-sts.txt`, `copyright.txt` under `.well-known/`
- `ads.txt` — official ads.txt for ad tech verification

**Security & Infrastructure**
- Full `Content-Security-Policy` header hardened across all pages (script-src, style-src, font-src, connect-src, frame-src, worker-src, object-src: none, upgrade-insecure-requests)
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, interest-cohort all denied) declared via meta tags
- `browserconfig.xml` for Windows tile configuration
- DMCA site verification meta tag
- Yandex verification meta tag

**SEO & Social**
- Full `hreflang` set (`en`, `uk`, `ru`, `x-default`) on all pages
- `geo.*` and ICBM meta tags (Ukraine, lat/lon)
- `content-language` declared (`en,ru,uk`)
- `music:musician` Open Graph type on homepage
- `fb:app_id` declared
- `citation_author` / `citation_title` meta tags
- `speakable` Schema.org spec pointing to `.artist-description` and `meta[name=description]`
- Expanded FAQ Schema on homepage (streaming platforms, booking contacts)
- `apple-mobile-web-app-title` and `application-name` meta tags
- Three `<link rel="me">` entries added: Bandsintown, TIDAL, LOC authority

**Game — VOID SIGNAL VHS Arcade**
- Full Canvas 2D space shooter: player ship, enemies, boss waves, bullets, sparks, power-ups, combos
- Weapon types: default, laser, shotgun, homing
- Dash mechanic with cooldown
- Slow-mo and freeze power-ups
- Boss fights with wave-based progression
- Web Audio API procedural SFX (no audio assets)
- VHS scanline, glitch, screen shake, and flash effects via `effects.js`
- High score persisted to `localStorage`
- Touch controls (left / right / fire zones)
- DPR-aware canvas scaling
- Minigame button injected into site nav (`icons/minigame.svg`)

**Font**
- `vcrosdmonorus_vhsicons.ttf` — custom VCR OSD Mono with Cyrillic extension and icon glyphs, self-hosted

**Other Files**
- `humans.txt` — team/credits file, linked via `<link rel="author">`
- `550e8400-e29b-41d4-a716-446655440000.txt` — UUID-based domain verification file
- `copyrighted-8551dc6ca40f08e5.html` — DMCA/copyright verification page
- `icons/CM-Badge-2.png` — CertifiedMusician badge asset
- `icons/skulls.png` — decorative asset

### Changed

**Global JS (`global.js` v2.1)**
- Unified site-wide JS consolidated into single `global.js` loaded with `defer` on all pages
- Rate limiting logic: 300 req/window soft limit, 600 req/window ban, 60 s window
- GA4 `user_properties` extended with `site_version`
- Canonical URL management extracted into `Canon` module within global.js
- Meta/link injection via `addOnce` guard to prevent duplicate head elements
- Bot detection regex extended (Lighthouse, headless, facebookexternalhit, TelegramBot, WhatsApp, LinkedIn)
- `.html` extension stripping from URL via `history.replaceState` on all pages
- Trailing slash redirect for all paths except root

**About page**
- Bio updated: Wild Heart Tour (8 cities, 2026), The Ivors Academy membership, Spain performances added
- Japanese and Ukrainian/Russian language bio sections present

**Homepage**
- `data-build="26.7"` across all HTML files
- VHS noise background via inline SVG `feTurbulence` filter (no external image)
- CRT/VHS CSS shader applied via `mix-blend-mode` and `translate3d` (GPU-accelerated)
- `--font-vhs` CSS variable for VCR OSD Mono, `--font-nav` for Arial Black

**Structured Data**
- `artist.json` updated: `meta.version` → `1.3`, `meta.updated` → `2026-07-29`
- `availableLanguage` expanded to `["uk", "ru", "ja"]`
- `endpoints` block added: json, epk (press.man1k.xyz/epk.pdf), sitemap, rss (3 feeds)
- `cacheTTL: 86400` declared

**Cloudflare redirects (not in repo)**
- `/discography` → Discogs artist page
- `/merch` → shop.man1k.xyz
- `/donate` → PayPal donate link
- `tour.man1k.xyz` subdomain added, linked in `<link rel="me">` and structured data

**Legal**
- Legal docs reorganized under `/legal/` directory (privacy, cookies, terms, copyright)
- `/legal.html` serves as hub page linking to all subpages

### Fixed
- Navigation button alignment (flexbox `align-items: stretch`) inherited from 2.0.0 — confirmed stable
- iOS Safari `mix-blend-mode` + `translateZ` conflict in game overlays — confirmed resolved
- `.html` URLs no longer exposed in browser address bar (replaceState stripping)
- Duplicate `<link rel="icon">` entries prevented by `addOnce` guard

---

## [2.0.0] — 2026-04-13
## build 26.4 / JS v2.1 / SW v1.3

### Added
- AIO meta tags (`ai:entity:agent`, `ai:data:schema`) injected across all HTML pages
- Expanded SEO keywords and meta descriptions on homepage
- BFCache message handlers (`PAGE_SHOW`, `PAGE_HIDE`) in Service Worker

### Changed
- Service Worker bumped to v1.3 (cache keys: mk-v7, mk-game-v4, mk-gallery-v3)
- GPU-accelerated CSS rendering for VHS overlays (main site and game)
- Game tearline animation converted from `top` to `translate3d` for hardware acceleration
- Navigation button alignment fixed (flexbox `align-items: stretch`)
- All documentation updated to reflect v2.0.0 technical reality

### Fixed
- Mix-blend-mode + translateZ conflict on iOS Safari (game overlays)
- Double resize event listener leak in game engine
- SoundCloud audio unlock race condition on iOS (restored gesture handshake)

---

## [1.1.0] — 2026-04-09
## build 26.4

### Added
- Merch shop launched at shop.man1k.xyz (Fourthwall)
- `/contact` page

### Changed
- `/merch` page replaced with redirect to shop.man1k.xyz
- Documentation updated to reflect new shop integration (Spring widget removed)
- Minor copy and SEO optimizations across several pages

### Fixed
- Skeleton image removed from VOID SIGNAL game
- Minor bug fixes

---

## [1.0.0] — 2026-03-08
## build 26.3 / JS v2.0 / SW v1.2 / Polyfills v1.0

### Added
- Website published!!!!
