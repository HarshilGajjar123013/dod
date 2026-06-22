# Designs of Dreams (DOD) Industry-Level Production Checklist

This document compiles the comprehensive pending task list ("panding list") required to transition the Designs of Dreams e-commerce application from a beautiful client-side prototype to a high-scale, production-ready, industry-level enterprise website.

---

## 1. Database & Persistence Layer (Pending)

*   [ ] **Database Provisioning**: Set up a managed **PostgreSQL** instance on Supabase, AWS RDS, or Neon.
*   [ ] **Prisma ORM Initialization**: Define relation schemas for Users, Products, Carts, Wishlists, and Orders. Run `prisma migrate dev` to compile tables.
*   [ ] **Zustand Store Server Syncing**: Replace `localStorage` client persistence with asynchronous API syncing. Cart/Wishlist items should automatically sync with the DB upon user session status changes.
*   [ ] **Connection Pooling**: Configure PgBouncer or Prisma Accelerate to handle concurrent database queries during peak traffic.

---

## 2. Authentication & Route Guards (Pending)

*   [ ] **Auth.js v5 (NextAuth) Integration**: Connect NextAuth with credentials validation (using Bcrypt hashing) and Google/Apple OAuth providers.
*   [ ] **Server-Side Middleware Guards**:
    *   Protect `/profile`, `/order`, and `/settings` routes from unauthenticated users.
    *   Protect `/admin` pages, ensuring only accounts with `role === "ADMIN"` can view administration metrics.
*   [ ] **Two-Factor Authentication (2FA)**: Integrate OTP validation via SMS/email (using Twilio or Resend) for premium atelier accounts.

---

## 3. Core E-Commerce API Endpoints (Pending)

*   [ ] **Dynamic Product Catalog API**:
    *   Endpoint `/api/products` supporting full-text search, subcategory filters (e.g. Banarasi, Anarkali), sorting (price low-high), and pagination.
*   [ ] **Server-Side Pricing Validation**:
    *   Cart checkout API `/api/checkout` must calculate order values using backend DB values, preventing clients from modifying prices.
*   [ ] **Order Management Engine**:
    *   API endpoints to track shipments, process returns, handle refunds, and issue order cancellations.
*   [ ] **Admin Inventory APIs**:
    *   Provide endpoints for CRUD actions on products, user roles, and return desks.

---

## 4. Media Storage & Image Management (Pending)

*   [ ] **Cloudinary / AWS S3 Integration**:
    *   Setup serverless route `/api/profile/upload` to parse incoming images and upload them directly to Cloud Storage.
    *   Store return URLs in the database `User` or `Product` tables.
*   [ ] **Next.js Image Optimization**:
    *   Replace all HTML `<img>` elements with Next.js `<Image>` tags. Configure remote Unspslash/Cloudinary domains in `next.config.ts` to support automated image sizing, WebP compression, and layout shift prevention.

---

## 5. Payments, Shipping & Notification Integrations (Pending)

*   [ ] **Razorpay or Stripe Gateway SDK**:
    *   Secure checkout flow: Create Order ID on server -> Load payment sheet -> Verify checksum signature server-side.
*   [ ] **Shipping Logistics Integration**:
    *   Connect Shiprocket or Delhivery APIs to automatically generate shipping labels and update tracking AWB codes.
*   [ ] **Email & SMS Notifications**:
    *   Wire **Resend** or **Nodemailer** to send transactional emails (Order Confirmed, Dispatched, Refund Settled).
    *   Set up Twilio to dispatch SMS OTP alerts.

---

## 6. SEO, Performance & Core Web Vitals (Pending)

*   [ ] **Dynamic Metadata & OpenGraph**:
    *   Generate dynamic title/meta description tags for product details pages.
    *   Configure OpenGraph sharing cards for Twitter, WhatsApp, and Facebook.
*   [ ] **Structured JSON-LD Schema**:
    *   Inject Product schema markup (`ld+json`) on `/product/[id]` pages to ensure Google lists prices, ratings, and stock status directly in search results.
*   [ ] **Sitemaps & Robots**:
    *   Automate `sitemap.xml` and `robots.txt` generation in Next.js to guide search crawlers.

---

## 7. DevOps, Infrastructure & Monitoring (Pending)

*   [ ] **Production Hosting**: Deploy the codebase onto **Vercel** or **AWS Amplify** for global edge server caching.
*   [ ] **CI/CD Integration**: Setup GitHub Actions to run ESLint, Prettier formatting, and compilation checks before merging code changes.
*   [ ] **Observability & Error Tracking**:
    *   Integrate **Sentry** for real-time frontend/backend exception logging.
    *   Set up **Vercel Speed Insights** or Lighthouse Audits to monitor page loading speeds and layout shifts.
