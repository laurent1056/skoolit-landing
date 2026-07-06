# SEO Goal Loop — Getskoolit.com

**Date:** July 2, 2026
**Owner:** Laurent
**Goal period:** 5 iterations (3–4 weeks total)
**Related:** [2026-06-18 SEO check-in (Matt)](./2026-06-18-seo-checkin-matt.md) · project-beachhead-brain `source/adhoc/2026-06-22-seo-phase1-ship.md`

---

## End Goal

By the end of iteration 5, Getskoolit.com will:

- Rank in **top 3 positions for 15 high-intent keywords** (currently tracking <5)
- Achieve **40% month-over-month organic traffic growth**
- Have **5+ high-quality backlinks** from edu/industry sites
- Maintain an **on-page SEO score of 85+** for all core pages

---

## Where We Already Are (baseline, July 2)

Work shipped since the June 18 check-in that pre-completes parts of iterations 1–3:

- **Technical foundation done:** `robots.txt`, `sitemap.xml` (13 live pages), canonical tags, JSON-LD schema (SoftwareApplication, Organization, FAQPage, BreadcrumbList) on all pages, `/prototype/` noindexed and blocked in robots.txt
- **Keyword-mapped page inventory:** 13 pages live and indexed; **18 more pages written, noindex-gated, and scheduled** to auto-publish July 20 → Nov 1 via GitHub Actions cron (`publish-schedule.json` + `scripts/publish.py`)
- **Comparison surface built:** vs/cozi, vs/skylight, vs/google-calendar, vs/apple-calendar, vs/ourfamilywizard, vs/fantastical live; vs/sense + sense-alternative scheduled Aug 1/8
- **Search consoles verified:** Google Search Console and Bing Webmaster Tools (via GSC token); sitemap submitted
- **Analytics live:** GA4 (`G-G06C694J1V`) on all pages; **UTM + referrer attribution pipeline live as of today** (first-touch capture → /subscribe → Google Sheet columns F–K)
- **Positioning locked:** widened scope copy (school, tutors, coaches, teams), no-forwarding differentiator vs Sense, privacy/no-ads contrast vs Cozi on /privacy/

This means the loop below starts from a real foundation, not zero. Iteration 1 is mostly *measurement*, not remediation.

---

## ITERATION 1: Keyword Research & Audit

**Duration:** 3–4 days · **Focus:** Build the SEO measurement foundation

**Outcome:** Complete keyword map + audit report

- [ ] Identify 50 high-intent keywords (search volume 100+, low-to-medium competition)
- [ ] Audit current site: crawl errors, indexing issues, page speed, Core Web Vitals
- [ ] Map keywords to existing pages + content gaps
- [ ] Document 3–5 quick wins (low-effort, high-impact fixes)

**Key actions:**

- Run SEO audit tool (Ahrefs, SE Ranking, or equivalent — see Decisions)
- Create keyword priority matrix (volume × relevance × difficulty)
- Identify top 15 target keywords for iterations 2–5
- Screenshot baseline metrics (current rankings, traffic, CLS/LCP/INP)

**Candidate keyword pools to draw from** (per the June 18 competitive analysis — structurally-ours angles first):

1. No-forwarding angle: "school email organizer no forwarding", "app that monitors school emails automatically"
2. Displacement: "Cozi alternative", "Skylight Calendar alternative", "Sense app alternative"
3. White space: "share family schedule with nanny", "soccer coach email to calendar", caregiver relay terms
4. Category: "best family calendar app 2026", "school email organizer", "back to school apps for parents"

**Success metric:** Audit report + keyword map ready; 15 target keywords locked in

---

## ITERATION 2: On-Page & Quick Wins

**Duration:** 4–5 days · **Focus:** Fix technical debt + optimize core pages

**Outcome:** 5 core pages optimized; technical issues resolved

- [ ] Fix crawl errors, broken links, robots.txt issues (audit-driven; most already clean)
- [ ] Optimize title tags, meta descriptions for top 15 keywords
- [ ] Verify schema markup coverage (FAQPage, Organization, BreadcrumbList already deployed — validate with Rich Results Test)
- [ ] Improve Core Web Vitals (target: LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] Deploy internal linking strategy (contextual links to target pages)

**Key actions:**

- Update title/meta on homepage + top 5 landing pages against locked keywords
- Audit on-page keyword usage (target keyword density 1–2%, natural)
- Optimize image alt text, heading hierarchy (H1 → H2 → H3)
- Run PageSpeed Insights; address top 3 performance issues
- Validate JSON-LD via Google Rich Results Test on all core pages

**Success metric:** All 5 core pages scoring 85+ on SEO audit; Core Web Vitals in "good" range

---

## ITERATION 3: Content & Keyword Targeting

**Duration:** 5–7 days · **Focus:** Content for high-intent keywords

**Outcome:** 3 new high-quality pages + 2 existing pages expanded

- [ ] Create 3 new pillar/cluster content pages targeting 9 keywords **not already covered by the 18 scheduled pages** (avoid duplication — check `publish-schedule.json` first)
- [ ] Expand 2 existing high-traffic pages with keyword targets + FAQ sections
- [ ] Ensure 2,000+ word count on core target pages
- [ ] Add CTAs, internal links, and readability optimization

**Key actions:**

- Write/brief 3 new pages (landing pages, guides, comparisons)
- Add FAQ sections to top 5 pages (voice search + SERP features) — most already have FAQ + schema; extend where thin
- Optimize for long-tail variants + semantic keywords
- Add natural internal links (3–5 per page, contextual)
- Publish and submit updated sitemap to GSC

**Timing note:** This iteration overlaps the July 20 (`/best-family-calendar-apps/`) and July 25 (`/blog/back-to-school-guide/`) scheduled publishes — those count toward the content total and should get GSC index requests the day they go live.

**Success metric:** 5 new/revised pages live; all passing readability + keyword checks

---

## ITERATION 4: Authority & Backlinks

**Duration:** 5–7 days · **Focus:** Build domain authority via earned links

**Outcome:** 5+ high-quality backlinks acquired

- [ ] Identify 20 link targets (edu sites, parenting/industry blogs, resource pages, HARO)
- [ ] Execute outreach for 5–10 partnership/guest post opportunities
- [ ] Publish one linkable resource asset (guide, tool, or original data)
- [ ] Monitor new link acquisition; track referral traffic (UTM pipeline now live for this)

**Key actions:**

- List 20 relevant high-authority sites (DA 40+) in the parenting/edtech niche
- Craft personalized outreach (3–5 emails/day for 5 days)
- Pitch guest post or co-created resource
- Create 1 linkable asset — strongest existing candidate: the "94 school emails in 30 days" research post (already live at `/blog/school-email-overload/`); consider expanding it into a citable data page
- Monitor rank movement for 15 target keywords weekly

**Launch-week synergy:** ProductHunt listing + `/press` page (per June 18 plan) land in this window if iteration 4 runs into September — both are backlink generators.

**Success metric:** 3–5 backlinks secured; average referring domain DA 50+

---

## ITERATION 5: Monitor, Iterate & Scale

**Duration:** 3–5 days · **Focus:** Measure results + plan next cycle

**Outcome:** Validated SEO playbook + results summary

- [ ] Measure final rankings (target: 10+ of 15 keywords in top 5)
- [ ] Measure organic traffic lift (goal: +40% vs. iteration 1 baseline)
- [ ] Document what worked; identify next 15 keywords to target
- [ ] Create repeatable SEO process for ongoing optimization

**Key actions:**

- Pull final rank tracking report (15 target keywords)
- Compare organic traffic in GA4: sessions, users, conversions (signup rows now carry UTM/referrer attribution for source-level analysis)
- Calculate organic growth % (iteration 1 baseline → iteration 5)
- Review which content types / keywords drove most traffic
- List top 5 insights: what worked, what didn't, why
- Define playbook: weekly tasks (rank tracking, link monitoring, content optimization)

**Success metric:** Goal met (40% traffic growth + top 3 ranking on 10+ keywords) OR clear path to next cycle

---

## Tracking Dashboard

| Metric | Target | Iter 1 | Iter 2 | Iter 3 | Iter 4 | Iter 5 |
|---|---|---|---|---|---|---|
| Top-3 keywords | 15 | 0 | 2 | 5 | 8 | 15 |
| Organic traffic (MoM) | +40% | Baseline | +10% | +20% | +30% | +40% |
| Backlinks (DA 40+) | 5+ | 0 | 0 | 1 | 3 | 5 |
| Core pages optimized | 5 | 1 | 5 | 5 | 5 | 5 |
| New content | 3–5 pages | 0 | 0 | 3 | 3 | 3 |
| Core Web Vitals | Good | Check | Improving | Good | Good | Good |

---

## Notes

- **Weekly check-in:** Every Monday, update this dashboard with latest rank/traffic data
- **Dependencies:** GSC ✅ (verified) · GA4 ✅ (live) · Bing WMT ✅ (verified) · Rank tracking tool ❌ (decision needed)
- **Repo items:** 18 scheduled pages (`publish-schedule.json`), publish cron (`.github/workflows/publish-schedule.yml`), UTM attribution pipeline (`public/assets/tracking.js`, `functions/subscribe.js`)
- **Pre-launch caveat:** Site is pre-launch until Sept 15. Rankings on commercial-intent terms may lag until launch-driven engagement/backlink signals arrive; treat iterations 1–3 as compounding groundwork rather than expecting immediate top-3 movement
- **Risk:** If rankings don't move by iteration 3, reassess keyword difficulty and pivot to long-tail targets (the no-forwarding and caregiver-relay angles have the least competition)

---

## Next Steps

- **This week:** Run iteration 1 audit; lock in 15 target keywords
- **Decisions needed:**
  1. SEO tool preference — Ahrefs, SE Ranking, or Moz? (needed before iteration 1 can lock keywords with real volume/difficulty data)
  2. Publishing cadence — keep the existing scheduled-publish dates, or accelerate any of the 18 gated pages?
  3. Backlink targets — which vertical/audience first: parenting blogs, edtech press, or edu resource pages?
- **Resources:** Who executes content? Who manages outreach?
