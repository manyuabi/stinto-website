# stinto.com website (static)

A static copy of www.stinto.com, taken from the WordPress site on one.com,
so the site can be edited without WordPress, plugins or updates.

- `site/` is the website. Every page is `site/<page-name>/index.html`. The homepage is `site/index.html`.
- `tools/mirror.mjs` re-downloads the live WordPress site into `site/`. **This overwrites any edits**, so only run it before you start editing.
- `tools/serve.mjs` runs a local preview at http://localhost:4321/stinto-website/

## Staging

Every push to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`.
The staging copy is blocked from search engines with a `noindex` tag and `robots.txt`,
and it has no Google Analytics, Facebook Pixel, HubSpot tracking or cookie banner.

## Before going live on stinto.com

- Remove the `noindex` meta tag and replace `site/robots.txt`.
- Put analytics and the cookie banner back.
- Make forms (book a demo, contact) work without WordPress. They currently post to WordPress `admin-ajax.php`.
