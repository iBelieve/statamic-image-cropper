# CLAUDE.md

## Project Overview

Statamic Image Cropper is a Statamic CMS addon that provides an image cropping fieldtype. It allows users to crop images with multiple preset aspect ratios or freeform dimensions, beyond basic focal point cropping.

**Package:** `tv2regionerne/statamic-image-cropper`

## Tech Stack

- **Backend:** PHP 7.4+, Statamic CMS v4/v5, Laravel
- **Frontend:** Vue 2, CropperJS, Tailwind CSS
- **Build:** Vite, Node v18.15 (see `.nvmrc`)

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Build production assets to `public/build/`
- `npm run lint` — Format code with Prettier (resources directory)

There are no test commands configured for this project.

## Project Structure

- `src/ServiceProvider.php` — Addon service provider, registers fieldtype and Vite assets
- `src/Fieldtypes/ImageCropper.php` — Main fieldtype class (config, augmentation, dimensions)
- `resources/js/addon.js` — Vue component registration entry point
- `resources/js/components/fieldtypes/ImageCropper.vue` — Main fieldtype UI component
- `resources/js/components/fieldtypes/ImageCrop.vue` — CropperJS-based cropping UI
- `public/build/` — Pre-built distribution assets (committed)

## Code Style

- **PHP:** PSR-4 namespace `Tv2regionerne\StatamicImageCropper\`, follows Statamic addon patterns
- **JS/Vue:** Single quotes, no semicolons, trailing commas (ES5), camelCase methods — enforced by Prettier (`.prettierrc`)
- **Indentation:** 4 spaces (2 spaces for YAML) — see `.editorconfig`
- **Line length:** 120 characters max
