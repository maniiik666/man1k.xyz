# Changelog — man1k.xyz

All notable changes to this site and its data files are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-03-08
## build 26.3 / JS v2.0 / SW v1.2 / Polyfills v1.0

### Added
- Website published!!!!

## [1.1.0] — 2026-04-09
## build 26.4

### Added
- Merch shop launched at shop.man1k.xyz (Fourthwall)
- /contact page

### Changed
- /merch page replaced with redirect to shop.man1k.xyz
- Documentation updated to reflect new shop integration (Spring widget removed)
- Minor copy and SEO optimizations across several pages

### Fixed
- Skeleton image removed from VOID SIGNAL game
- Minor bug fixes

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
