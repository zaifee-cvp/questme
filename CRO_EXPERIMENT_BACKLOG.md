# Questme.ai CRO Experiment Backlog

## Objective
Move conversion performance from the current strong baseline into sustained 9.3+ territory using low-risk, front-end-first experiments.

## North Star
Primary north-star KPI: visitor-to-trial-start rate (homepage and SEO landing pages).

Secondary KPIs:
1. Visitor-to-sign-up CTR from primary CTA.
2. Pricing-section click-through rate.
3. Visitor-to-lead capture rate on lead-intent pages.
4. Scroll depth to CTA sections.

Guardrail KPIs:
1. Bounce rate.
2. Time to interactive (no regression).
3. Core web vitals (LCP/INP/CLS, no regression).
4. Sign-in and dashboard route success rates (must stay flat or improve).

## Prioritization Framework
Scoring method: Impact (1-5) x Confidence (1-5) x Ease (1-5).
Run highest ICE first unless a dependency blocks launch.

## Experiment Backlog

### E1. Homepage Hero Framing
Type: A/B/n
ICE: 5 x 4 x 5 = 100

Hypothesis:
Pain-first framing will increase primary CTA clicks by making the cost of inaction more immediate.

Variants:
1. Control: current hero framing.
2. Variant A: pain-first headline.
3. Variant B: outcome-first headline.

Primary KPI:
Primary hero CTA CTR.

Secondary KPIs:
1. Scroll to pricing.
2. Visitor-to-trial-start rate.

Guardrails:
1. Bounce rate at hero.
2. Time on page.

Success criterion:
Minimum +8% relative lift in primary CTA CTR with no guardrail regression.

### E2. Primary CTA Language
Type: A/B/n
ICE: 5 x 4 x 5 = 100

Hypothesis:
Commercial-intent CTA labels will outperform generic trial language on high-intent traffic.

Variants:
1. Start Free Trial.
2. Add AI Answers to My Website.
3. Convert More Visitors.

Primary KPI:
Hero CTA click-through rate.

Secondary KPIs:
1. Sign-up completion rate.
2. Pricing section engagement.

Success criterion:
Minimum +6% relative lift in trial starts with flat sign-up completion quality.

### E3. Trust Layer Placement
Type: A/B
ICE: 4 x 4 x 4 = 64

Hypothesis:
Placing the trust layer directly below hero increases confidence earlier and lifts trial intent.

Variants:
1. Control: current trust block position.
2. Variant: trust block immediately after hero CTA.

Primary KPI:
Visitor-to-trial-start rate.

Secondary KPIs:
1. Scroll to mid-page sections.
2. Pricing CTR.

Success criterion:
Minimum +5% relative lift in visitor-to-trial-start rate.

### E4. Pricing Plan Emphasis
Type: A/B
ICE: 4 x 4 x 4 = 64

Hypothesis:
A clearer Pro-plan value narrative reduces choice friction and improves pricing-to-trial conversion.

Variants:
1. Control: current pricing cards.
2. Variant: stronger Pro plan value statement plus ROI microcopy in-card.

Primary KPI:
Pricing card CTA click-through.

Secondary KPIs:
1. Plan distribution (Starter/Pro/Scale).
2. Trial starts from pricing section.

Success criterion:
Minimum +7% relative lift in pricing CTA CTR with no negative skew in completion quality.

### E5. Final CTA Promise
Type: A/B/n
ICE: 3 x 4 x 5 = 60

Hypothesis:
A promise aligned to the visitor's dominant motivation (lead growth vs support reduction) increases end-page conversion.

Variants:
1. Capture more leads with AI answers.
2. Reduce support load now.
3. Launch my product bot.

Primary KPI:
Final CTA click-through rate.

Secondary KPIs:
1. Scroll completion.
2. Trial starts from final CTA.

Success criterion:
Minimum +8% relative lift in final CTA CTR.

### E6. Video Block Position
Type: A/B
ICE: 3 x 3 x 4 = 36

Hypothesis:
Moving video below How It Works may increase narrative continuity and improve downstream CTA conversion.

Variants:
1. Control: current placement.
2. Variant: video placed after How It Works.

Primary KPI:
Trial starts per session.

Secondary KPIs:
1. Video engagement rate.
2. Scroll depth to pricing.

Success criterion:
Minimum +4% relative lift in trial starts per session.

## Measurement Plan
Event taxonomy (required before testing):
1. page_view_home
2. cta_click_hero_primary
3. cta_click_hero_secondary
4. section_view_trust
5. section_view_pricing
6. cta_click_pricing_plan_starter
7. cta_click_pricing_plan_pro
8. cta_click_pricing_plan_scale
9. cta_click_final
10. signup_start
11. signup_complete

Attribution window:
1. Session-level primary reporting.
2. 24-hour assisted conversion check.

Segmentation cuts:
1. Device: mobile vs desktop.
2. Traffic source: organic, direct, paid, referral.
3. Page cohort: homepage vs SEO landing pages.

## Sample Size and Runtime Rules
Use this baseline approach per experiment:
1. Baseline conversion rate p from last 28 days for the experiment's primary KPI.
2. Minimum detectable effect (MDE): 8% relative for hero/CTA tests, 5% relative for layout placement tests.
3. Confidence level: 95%.
4. Power: 80%.

Approximate per-variant sample formula:
n ~= 16 x p x (1 - p) / d^2
where d is absolute lift target.

Runtime rules:
1. Minimum 14 days to capture weekday/weekend behavior.
2. Do not stop early before reaching required sample.
3. If traffic is low, run fewer variants (A/B before A/B/n).

## Rollout Sequence (Recommended)
Week 1-2:
1. E1 Hero Framing.
2. E2 Primary CTA Language.

Week 3-4:
1. E3 Trust Layer Placement.
2. E4 Pricing Plan Emphasis.

Week 5-6:
1. E5 Final CTA Promise.
2. E6 Video Block Position.

## Decision Rules
1. Ship winner when primary KPI meets lift threshold and no guardrail regresses.
2. If no winner, keep control and document learnings.
3. Re-test only with a materially different hypothesis.

## Implementation Safety Constraints
1. Front-end copy/layout only.
2. No backend, auth, billing, API, or data-flow changes.
3. No added heavy assets that risk performance regressions.
4. Keep SEO metadata, routes, and canonical structures intact.
