# Ikigai Engine — deploy & wiring guide

The site is a static site served from `site/`. A GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) force-pushes `site/` to the `gh-pages`
branch on every push to `claude/ikigai-five-websites-7j4i20`, and GitHub Pages
serves it.

## Structure (one front door)
```
site/
  index.html          ← production marketing site (the home page)
  privacy.html
  terms.html
  robots.txt
  sitemap.xml
  cinema/             ← redirect to / (old URL) + build guide
  showcase/           ← the 5-design capability gallery (secondary)
  blueprint/ editorial/ workshop/ kinetic/ cinema-variants/   ← the studies
  fonts/  cinema-variants/shared/   ← shared assets + particle engine
```

## Wiring the site (NOW phase)
Everything is gated behind one config block at the bottom of `site/index.html`:

```js
window.IKIGAI = {
  siteUrl:          "https://ikigaiengine.com",
  contactEmail:     "hello@ikigaiengine.com",
  bookingUrl:       "",   // Cal.com / Calendly link
  formAccessKey:    "",   // Web3Forms access key
  turnstileSiteKey: "",   // Cloudflare Turnstile (optional)
  plausibleDomain:  ""    // Plausible analytics
};
```

With nothing set, the site still works: CTAs fall back to email and the form
opens the visitor's mail app. Fill these in to light up the real pipeline:

| Key | Where to get it | Free? | What it turns on |
|---|---|---|---|
| `bookingUrl` | [cal.com](https://cal.com) → create an "Operations audit" event type | Yes | Every "Book" button opens self-serve scheduling |
| `formAccessKey` | [web3forms.com](https://web3forms.com) → create an access key for `hello@ikigaiengine.com` | Yes | Lead form posts to email + (optional) webhook |
| `turnstileSiteKey` | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | Yes | Spam shield on the form |
| `plausibleDomain` | [plausible.io](https://plausible.io) → add `ikigaiengine.com` | Paid | Privacy-friendly analytics + `Book click` / `Lead submit` events |

### Feed leads into HubSpot (system of record)
1. Create a free [HubSpot](https://hubspot.com) account.
2. In Web3Forms, add a **webhook** to your HubSpot form/contacts endpoint (or use a
   HubSpot native form and swap the fetch URL in `site/index.html`), so every
   submission becomes a contact automatically. Booking (Cal.com) can also push to
   HubSpot via its native integration.
3. Result: leads never get re-typed — website → form → HubSpot.

## Secrets
There are **no server secrets** in this repo, and there must not be. The keys
above are public client-side identifiers (safe to expose). Never commit private
API secrets (HubSpot private tokens, Stripe secret keys) to the repo — those live
only inside the respective SaaS or, if you later add serverless functions, in the
host's encrypted env vars.

## Custom domain (`ikigaiengine.com`)
The canonical/OG URLs and `sitemap.xml` already point at `https://ikigaiengine.com`.
To make that live:
1. In your DNS, add the GitHub Pages records for the apex domain
   (`185.199.108–111.153` A records) and a `www` CNAME to `ikigaiengine.github.io`.
2. **Only after DNS resolves,** add a file `site/CNAME` containing `ikigaiengine.com`
   and set the custom domain in the repo's Pages settings. (Adding `CNAME` before
   DNS is ready can make the site unreachable — do DNS first.)
3. For the future client portal, point `portal.ikigaiengine.com` (CNAME) at your
   portal SaaS (SuiteDash/Copilot) — separate plane, separate subdomain.

If you use a different domain, update the absolute URLs in `site/index.html`
(`<link rel="canonical">`, `og:*`, JSON-LD) and `site/sitemap.xml`.

## Social preview image
`og:image` points at `/og.png` (1200×630). Regenerate it with
`scratchpad/make-og.js` (Playwright) after any brand change, or replace the file.

## Optional upgrade: Cloudflare Pages
Moving hosting to Cloudflare Pages (or Netlify) adds **per-branch preview deploys**
and a place to run a serverless form function if you outgrow Web3Forms. Point it at
`site/` as the output directory; no build command needed.
