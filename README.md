# ARKA — Cinematic Creative Production House & Digital Marketing Studio

پلتفرم فول‌استک، سینمایی و **راست‌چین (RTL/فارسی)** برای آژانس خلاق «آرکا» — به‌همراه یک **پنل مدیریت (CMS) اختصاصی و کامل**.

> Design. Create. Impact. — طراحی کن. خلق کن. تأثیر بگذار.

---

## ⚡️ اجرا (Quick start)

```bash
npm install
npm run setup      # ساخت دیتابیس SQLite + داده نمونه (prisma db push && seed)
npm run dev        # http://localhost:3100
```

- **سایت:** http://localhost:3100
- **پنل مدیریت:** http://localhost:3100/admin
- **ورود مدیر ارشد:** `ali.jafari@arka.studio` / `Arka@2026!`
  - ویرایشگر: `editor@arka.studio` · نویسنده: `author@arka.studio` (همان رمز)

اسکریپت‌ها: `npm run db:reset` (ریست کامل داده) · `npm run build` · `npm run start`

---

## 🧱 معماری

| لایه | فناوری |
|---|---|
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 |
| Motion | framer-motion · lenis (smooth scroll) · custom cursor |
| Fonts | Vazirmatn (فارسی) · Syne (لاتین) |
| Backend | Next.js Server Actions + Route Handlers |
| Database | **Prisma + SQLite** (روابط ۱:۱، ۱:N، M:N) |
| Auth | JWT در کوکی httpOnly (jose) + bcrypt + **RBAC** |
| SEO | Metadata API · JSON-LD · sitemap · robots · manifest |

> در پرامپت اصلی NestJS/Postgres/Docker خواسته شده بود؛ برای «یک‌دستور اجراشدن» و تمرکز روی پنل مدیریت، همان مدل داده روی Next.js + Prisma/SQLite پیاده شد و در پروداکشن به‌راحتی به S3/Postgres/NestJS منتقل می‌شود.

---

## 🗂 ساختار

```
app/
  (site)/            صفحات عمومی (لندینگ، خدمات، نمونه‌کار، صنایع، ژورنال، درباره، تماس)
  admin/             پنل مدیریت (داشبورد + مدیریت محتوا) — محافظت‌شده با middleware
  api/               auth (login/logout) · contact
components/          brand · fx · theme · layout · ui · home · work · journal · industries · admin
lib/                 db · auth · session · rbac · actions · queries · seo · constants · utils
prisma/              schema.prisma · seed.ts
```

## ✨ پنل مدیریت (تمرکز اصلی)
داشبورد آنالیتیکس (نمودار SVG اختصاصی) · **مدیریت نمونه‌کار** با پیش‌نمایش زنده + پیش‌نمایش SERP + چارچوب داستان‌سرایی + تگینگ · ژورنال (ادیتور مارک‌داون + پیش‌نمایش) · کتابخانه رسانه (Drag & Drop) · CRM مشتریان · نظرات · **کاربران و نقش‌ها با چک‌باکس دسترسی سطح‌کاربر** · **پایپ‌لاین سرنخ‌ها (کانبان)** · تنظیمات چندزبانه.

## 🎨 برند
لوگوی «▶▶» آرکا از روی برگه‌ی هویت بازسازی شده. پالت: `#162d73` · `#6699ff` · `#a6c9ff` · `#d3ebfe`. حالت **تاریک/روشن** با یک کلیک.

## 🖼 رسانه نمونه
تصاویر از Picsum، آواتار از Pravatar، ویدیو از نمونه‌های عمومی Google — همه از طریق **کتابخانه رسانه** قابل جایگزینی. `images.unoptimized` روشن است تا این هاست‌ها مستقیم در مرورگر لود شوند (در پروداکشن با CDN خودتان خاموش کنید).
