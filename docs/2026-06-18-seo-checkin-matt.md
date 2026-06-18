# SEO Check-In — Laurent → Matt
**Date:** June 18, 2026  
**Re:** Pre-launch SEO posture, competitive content gap, and August content sprint

---

## Bottom Line Up Front

We have a September launch window with a real back-to-school traffic spike available to us — but we need content indexed by **mid-July** to benefit from it. The biggest risk isn't that we have bad SEO; it's that we have *no* SEO surface area, and our closest content competitor (Sense) is aggressively publishing comparison posts targeting the exact searches our buyers are making right now.

Three decisions needed from you before we move. See end of doc.

---

## What We Found

### The site today

The landing page copy and positioning are strong. The technical SEO is essentially zero:

- No `robots.txt`, no `sitemap.xml` — Google cannot efficiently crawl us
- No canonical tag, no schema markup, no FAQ schema
- Title tag is brand-only (`Skoolit — Less inbox. More parenting.`) — no keywords a parent would Google
- No blog, no comparison pages, no content at all beyond the one landing page
- Prototype pages (`/prototype/`) will be indexed as public content

None of this is a crisis for a pre-launch site. But the window to fix it before September is now.

### The competitive content landscape

Sense is not just a product competitor — they are winning the **content** game in our category. They have already published:

- "Best Cozi Alternatives 2026" (ranking, capturing Cozi displacement traffic)
- "Skylight Calendar 2 Review 2026" (ranking, capturing Skylight frustration traffic)
- "Best Family Calendar Apps 2026" (ranking, positioning themselves at the center of every comparison)

These are exactly the searches our buyers make before they find us. Right now, they find Sense instead.

FamilyHero, Nori, and Calendara are also producing comparison content. The "Cozi alternative" and "Skylight Calendar alternative" SERPs already have 5–7 competitors ranking. **We are not in any of them.**

The displacement signals are confirmed and live:
- Cozi's May 2024 free-tier restriction is actively sending parents searching for alternatives
- Skylight's AI features paywalled behind $79/yr Plus subscription (on top of $299 hardware) is a documented, widespread complaint. "Skylight shows you the calendar; Skoolit builds it for you" maps perfectly onto that frustration — we just need a page for Google to find

### Where Skoolit can win that no one else can write

A few keyword angles are structurally ours because competitors would disqualify themselves by writing them:

1. **"No forwarding required"** — Sense, Nori, Gether, and Calendara all require manual forwarding. We are the only product (alongside Fambot) that watches the inbox automatically. Sense cannot write "apps that monitor your inbox automatically" without ranking themselves last.

2. **"Soccer coach Gmail to family calendar"** — Out-of-school activity channels are entirely unserved by every school tool. This specific use case has no content owner.

3. **"Share family schedule with your nanny without giving inbox access"** — Caregiver relay is white space. No competitor has it, no one is writing about it.

---

## Proposed Plan

### Phase 1 — Technical foundation (this week, ~3 hours total)

- Rewrite title tag and meta description with target keywords
- Add `robots.txt` and `sitemap.xml`
- Add canonical tag and `robots` meta
- Add JSON-LD schema: `SoftwareApplication`, `Organization`, `FAQPage`
- Add FAQ section to homepage (7 questions targeting People Also Ask)
- Noindex `/prototype/` pages

All of this can be done without touching the visual design of the site.

### Phase 2 — Comparison pages (weeks 1–2, July 1–15)

Two pages, prioritized by search demand and displacement signal:

**`/vs/cozi`** — "Best Cozi Alternative 2026: AI Family Calendar That Actually Reads School Emails"  
Copy hook: Cozi is manual. We're automatic. Cozi cut their free tier. We never had manual entry.

**`/vs/skylight`** — "Skylight Calendar Alternative: Get AI-Built Family Calendars Without the Hardware"  
Copy hook: Skylight costs $300 + $79/year and still requires you to forward emails. Skoolit is $5/month and watches your inbox automatically.

Both pages follow the same structure: one-line differentiator → side-by-side feature table → "who each product is for" → early access CTA.

### Phase 3 — Content sprint (July 1 – August 12, 6–8 posts)

Target: all content published and indexed before the back-to-school traffic spike.

| Publish By | Post | Target Keyword |
|---|---|---|
| July 8 | "How to Stop Missing School Emails" | school email organizer |
| July 15 | "Best Skylight Calendar Alternative" | Skylight alternative |
| July 22 | "Managing Two Kids' School Schedules" | school activity organizer multiple kids |
| July 29 | "Back to School Organization Apps 2026 — Ranked" | back to school apps for parents |
| Aug 5 | "How to Share Your Family Schedule With Your Nanny" | caregiver schedule sharing app |
| Aug 12 | "Apps That Monitor Your School Inbox Automatically (No Forwarding)" | school email organizer no forwarding |

I can write drafts for all of these. The last post is the most strategically important — it's the only comparison frame where Skoolit and Fambot beat every other player, and no one is ranking for it yet.

### Phase 4 — Comparison page expansion (August, pre-launch)

- `/vs/classdojo` — "ClassDojo Alternative for Parents Who Don't Want to Wait for School Adoption"
- `/vs/sense` — "Sense App Alternative: Full Loop vs. Single Feature"
- `/vs/parentsquare` — for the Remind migration audience (ParentSquare acquired Remind, Jan 2026)

### Launch week (September 15)

- ProductHunt listing (generates backlinks, early reviews, and a launch spike that reinforces Google authority)
- Press page live at `/press` with logo pack, screenshots, founder quote
- Submit sitemap to Google Search Console and request indexing

---

## Three Decisions Needed

**1. Do we want comparison pages before launch?**  
Comparison pages convert well and rank fast. The risk is they're harder to maintain if the product changes, and they name competitors directly. My read: the Cozi and Skylight pages are low-risk (neither is a direct competitor we need a relationship with) and the displacement signal is confirmed. ClassDojo and Sense pages are higher-stakes — worth a call before we publish those.

**2. Who owns the content sprint?**  
I can produce the drafts. Someone needs to review for product accuracy (event types, pricing tiers, caregiver relay behavior) before they go live. Can we set up a lightweight review loop — draft → you or [team member] checks product claims → publish?

**3. Blog on the landing repo or a separate subdomain?**  
Options:
- `getskoolit.com/blog` — stronger SEO (same domain authority), slightly more complex to build
- `blog.getskoolit.com` — faster to spin up on a separate Cloudflare Pages deploy, slightly weaker SEO

I'd recommend `/blog` on the main domain for SEO consolidation, but it requires a routing decision in `wrangler.toml`. Worth 15 minutes together if you have a preference.

---

## What I Can Have Ready for Review This Week

- [ ] Title tag + meta description rewrites (3 variants)
- [ ] `robots.txt` and `sitemap.xml` files
- [ ] FAQ section copy + JSON-LD schema, ready to drop into `index.html`
- [ ] `/vs/cozi` comparison page draft
- [ ] `/vs/skylight` comparison page draft
- [ ] Outline for all 6 blog posts

Let me know how you want to prioritize and I'll move.
