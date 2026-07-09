# راهنمای دیپلوی ARKA روی Netlify

## چیزهایی که از قبل آماده شده

- سایت Netlify با نام **arka-ads-studio** ساخته شده → آدرس نهایی: `https://arka-ads-studio.netlify.app`
- اکستنشن **Neon** (Netlify DB / Postgres رایگان) روی این سایت نصب شده.
- `prisma/schema.prisma` از SQLite به `postgresql` تغییر کرد.
- `package.json` → اسکریپت `build` حالا این‌طوریه:
  `node scripts/setup-netlify-db.cjs && prisma generate && prisma db push && next build`
  یعنی هر بار که روی Netlify بیلد می‌شه: دیتابیس Neon وصل می‌شه، Prisma Client ساخته می‌شه، و اسکیمای دیتابیس sync می‌شه.
- فایل `scripts/setup-netlify-db.cjs` فقط روی Netlify اجرا می‌شه (لوکال دست نمی‌زنه).
- `netlify.toml` و `.gitignore` (اضافه شدن `.netlify/`) آماده‌ست.
- env var مربوط به `NEXT_PUBLIC_SITE_URL` روی سایت ست شده.

## مرحله ۱ — پوش کردن پروژه به گیت‌هاب

توی ترمینال خودتون، داخل پوشه‌ی پروژه:

```bash
git init
git add .
git commit -m "Initial commit"
```

بعد یک ریپوی جدید (خالی) توی گیت‌هاب بسازید (arka-ads-studio) و:

```bash
git remote add origin https://github.com/<username>/arka-ads-studio.git
git branch -M main
git push -u origin main
```

## مرحله ۲ — وصل کردن ریپو به سایت Netlify موجود

سایت از قبل ساخته شده، فقط باید بهش گیت وصل کنید:

1. `https://app.netlify.com/sites/arka-ads-studio/configuration/deploys` رو باز کنید
2. **Link repository** → گیت‌هاب رو انتخاب و ریپوی `arka-ads-studio` رو وصل کنید
3. Build command و Publish directory از `netlify.toml` خودکار خونده می‌شن — نیازی به تغییر نیست

از این به بعد هر `git push` به شاخه‌ی `main` یعنی دیپلوی خودکار.

## مرحله ۳ — تنظیم AUTH_SECRET

این مقدار برای امضای JWT ادمین استفاده می‌شه و باید تصادفی و امن باشه. توی ترمینال خودتون:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

خروجی رو کپی کنید و در Netlify دو راه دارید:
- Dashboard: Site configuration → Environment variables → Add variable → `AUTH_SECRET`
- یا با CLI: `netlify env:set AUTH_SECRET "<مقدار تولید شده>"`

## مرحله ۴ — اولین دیپلوی و seed کردن دیتابیس

بعد از وصل شدن ریپو، اولین دیپلوی خودش شروع می‌شه و دیتابیس Postgres رایگان (Neon) رو می‌سازه و اسکیمای Prisma رو روش push می‌کنه — نیازی به کار دستی نیست.

⚠️ ولی **seed** (داده‌ی نمونه اولیه + کاربر ادمین) خودکار اجرا نمی‌شه، چون `prisma/seed.ts` هر بار قبلش همه‌چیز رو پاک می‌کنه و اگه توی build خودکار بذاریمش، هر دیپلوی محتوای واقعی رو پاک می‌کنه. برای seed کردن یک‌بار:

1. از Netlify → Extensions → Neon، connection string دیتابیس پروداکشن رو کپی کنید
2. لوکال، توی `.env` مقدار `DATABASE_URL` رو موقتاً به همون بذارید
3. اجرا کنید:
   ```bash
   npm run db:seed
   ```
4. مقدار `DATABASE_URL` لوکال رو برگردونید سر جاش (یا برای دولوپمنت هم از همون Postgres استفاده کنید، چون دیگه اسکیمای SQLite ساپورت نمی‌شه)

## نکته مهم: آپلود فایل

`public/uploads` (کتابخانه‌ی رسانه‌ی لوکال) روی Netlify هیچ فایل سیستم دائمی نداره — هر فایلی که از پنل ادمین آپلود بشه، بعد از دیپلوی بعدی از بین می‌ره. برای پروداکشن باید آپلودها به یک storage خارجی (مثل Cloudinary، S3، یا Netlify Blobs) وصل بشه. این تغییر جدا از دیپلوی فعلیه — هر وقت خواستید انجامش بدیم بگید.

## خلاصه‌ی وضعیت دیتابیس لوکال بعد از این تغییر

چون `schema.prisma` حالا `postgresql` هست، دیگه SQLite لوکال (`dev.db`) کار نمی‌کنه. برای دولوپمنت لوکال یا از همون Neon connection string استفاده کنید، یا دستور `netlify dev` رو به‌جای `npm run dev` اجرا کنید تا خودش یه دیتابیس جدا برای دولوپمنت بسازه.
