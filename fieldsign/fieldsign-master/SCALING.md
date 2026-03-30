# FieldService Pro — Infrastructure & Scaling Proposal
## From Launch → 100 Companies → 1,000 Companies

---

## Current Architecture (Launch → ~100 companies)

| Layer | Service | Cost/mo | Limit |
|-------|---------|---------|-------|
| Database | Supabase Free | $0 | 500MB, 50K rows/mo |
| Hosting | Vercel Hobby | $0 | 100GB bandwidth |
| Email | Resend Free | $0 | 3,000 emails/mo |
| Storage | Supabase Free | $0 | 1GB |
| **Total** | | **$0** | ~20 active companies |

---

## Phase 2 — Growth (100–300 companies)

### Upgrade triggers:
- Database exceeding 500MB or 50K API calls
- Email volume exceeding 3,000/month
- Storage exceeding 1GB

### Stack:

| Layer | Service | Cost/mo | Capacity |
|-------|---------|---------|----------|
| Database | **Supabase Pro** | $25 | 8GB DB, 250K rows/mo, 100GB storage |
| Hosting | **Vercel Pro** | $20 | 1TB bandwidth, 1,000 serverless function hours |
| Email | **Resend Pro** | $20 | 50,000 emails/mo |
| Storage | Included in Supabase Pro | — | 100GB |
| **Total** | | **$65/mo** | ~300 active companies |

At 50 Growth plan companies ($149/mo each) = **$7,450 MRR**
Infrastructure cost = $65/mo = **0.87% of revenue**

---

## Phase 3 — Scale (300–1,000 companies)

### Architecture changes needed:

#### 1. Database — Supabase Pro + Read Replicas
```
Primary DB (writes) ─┬─ Read Replica 1 (dashboard queries)
                     └─ Read Replica 2 (report generation)
```
- **Supabase Pro** at $25/mo handles up to ~500 companies easily
- At 700+ companies, add **Supabase Team** ($599/mo) for:
  - Dedicated compute (8-core, 32GB RAM)
  - Point-in-time recovery
  - Priority support SLA
  - Read replicas

#### 2. PDF Generation — Offload to Queue
At high volume, PDF generation in the API route creates latency spikes.

**Solution**: Add a background job queue

```
Report Submission API
  → Save work order to DB (fast, <100ms)
  → Push job to queue (Upstash QStash or Inngest)
  → Return success immediately to technician
  
Queue Worker (separate serverless function)
  → Generate PDF
  → Upload to Supabase Storage  
  → Send emails via Resend
  → Update work_order.pdf_url
```

**Cost**: Upstash QStash free tier (500 msg/day) → $10/mo Pro (unlimited)

#### 3. Email Volume — Resend Scale
At 1,000 companies × avg 5 reports/day × 2 emails = 10,000 emails/day
- **Resend Business** ($89/mo): 300,000 emails/month ✓

#### 4. Storage — Organized CDN
At scale, Supabase Storage works fine but consider:
- Enable CDN on the bucket (Supabase does this automatically on Pro)
- Set PDF URL expiry or signed URLs for security
- Lifecycle policy: archive PDFs older than 2 years to cheaper tier

#### 5. Caching — Vercel Edge Cache
Add cache headers to frequently-read API routes:
- Company settings (changes rarely)
- Service lists
- Technician lists

```typescript
// In server components
export const revalidate = 60 // cache for 60 seconds
```

---

## 1,000-Company Infrastructure Stack

| Layer | Service | Cost/mo | Notes |
|-------|---------|---------|-------|
| Database | Supabase Team | $599 | Dedicated 8-core, 32GB, read replicas |
| Hosting | Vercel Pro | $20 | Scales automatically with usage |
| Email | Resend Business | $89 | 300K emails/mo |
| Queue | Upstash QStash Pro | $10 | PDF job queue |
| Monitoring | Sentry (Team) | $26 | Error tracking, performance |
| Analytics | Vercel Analytics | $10 | Page performance |
| **Total** | | **~$754/mo** | |

### Revenue at 1,000 companies (conservative mix):
- 400 × Starter ($59) = $23,600
- 450 × Growth ($149) = $67,050  
- 100 × Business ($299) = $29,900
- 50 × Enterprise (avg $599) = $29,950
- **Total MRR = $150,500**
- **Infrastructure = $754 (0.5% of revenue)**

---

## Database Optimization for Scale

### 1. Connection Pooling (critical at 500+ companies)
Supabase uses PgBouncer by default. Ensure you connect via the pooler URL:
```
# Use this for Next.js API routes (transaction mode):
postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true

# Keep the direct connection for migrations only
```

### 2. Partition work_orders by company (at 10M+ rows)
```sql
-- Future migration when work_orders table exceeds 5M rows
ALTER TABLE work_orders PARTITION BY HASH (company_id);
CREATE TABLE work_orders_0 PARTITION OF work_orders FOR VALUES WITH (MODULUS 4, REMAINDER 0);
-- etc.
```

### 3. Materialized view for reports dashboard
```sql
-- Refresh every 5 minutes for dashboard performance
CREATE MATERIALIZED VIEW reports_dashboard_view AS
SELECT 
  wo.id, wo.service_report_no, wo.client_name, ...
  s.service_name, sw.swo_no
FROM work_orders wo
LEFT JOIN services s ON s.id = wo.service_id
LEFT JOIN swos sw ON sw.id = wo.swo_id
WHERE wo.status = 'Completed';

CREATE UNIQUE INDEX ON reports_dashboard_view (id);
REFRESH MATERIALIZED VIEW CONCURRENTLY reports_dashboard_view;
```

---

## Pricing Strategy Notes

### Why this pricing maximizes revenue:

**Starter at $59/mo:**
- Covers: Supabase (~$0.05/company), Resend (~$0.10), Vercel (~$0.02)
- Real cost per Starter company: ~$0.50/mo
- Margin: ~98.5%
- Purpose: Low barrier entry, upsell to Growth

**Growth at $149/mo (your money maker):**
- Most field service companies have 5–20 technicians
- "Unlimited reports" removes anxiety about usage
- Custom templates is the feature they need most
- Target: 60% of your customer base at this tier

**Business at $299/mo:**
- "Unlimited technicians" is the key unlock
- Companies with 25+ technicians can't live without it
- White-label makes it feel enterprise

**Annual discount (20%):**
- Monthly: $59 / $149 / $299
- Annual: $47 / $119 / $239 (20% off)
- Annual plans dramatically improve cashflow and reduce churn
- Goal: convert 40%+ to annual billing

**Free Trial (14 days, no credit card):**
- Reduces sign-up friction by ~60%
- Companies will invest time setting up templates and inviting technicians
- After setup investment, churn on trial-to-paid is very low (~85% convert)

### Upsell levers built into the product:
1. Starter hits 100 reports → email nudge to Growth
2. Starter hits 5 technician limit → upgrade prompt in dashboard
3. Business tier → Enterprise conversation trigger when technicians > 80

---

## Implementation Checklist for Scale

- [ ] Switch to Supabase pooler connection string in production
- [ ] Add `NEXT_PUBLIC_APP_URL` to match production domain
- [ ] Enable Supabase Pro ($25/mo) at first paying customer
- [ ] Set up Resend sending domain with SPF/DKIM records
- [ ] Add Sentry for error monitoring (free tier initially)
- [ ] Set up Vercel Analytics for Core Web Vitals
- [ ] Implement PDF queue (Inngest) at 200+ companies
- [ ] Add Stripe for subscription billing (not included — integrate separately)
- [ ] Move to Supabase Team at 500+ companies
- [ ] Add read replica at 700+ companies
