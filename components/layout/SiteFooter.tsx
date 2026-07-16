import Link from "next/link";
import { ArrowUpLeft, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SocialIcon } from "./SocialIcon";
import { SITE, NAV } from "@/lib/constants";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";
import type { ContactContent } from "@/lib/queries";

const NAV_KEY: Record<string, string> = {
  "/": "navHome",
  "/services": "navServices",
  "/work": "navWork",
  "/industries": "navIndustries",
  "/about": "navAbout",
  "/journal": "navJournal",
  "/contact": "navContact",
};

export interface FooterSettings {
  footerCtaHeading: string;
  footerCtaBody: string;
  footerCtaButtonLabel: string;
  footerDescription: string;
  footerCopyright: string;
}

export function SiteFooter({
  services,
  industries,
  locale,
  footer,
  contact,
}: {
  services: { slug: string; title: string }[];
  industries: { slug: string; title: string }[];
  locale: Locale;
  footer: FooterSettings;
  contact: ContactContent;
}) {
  const t = ui(locale);
  // The admin-editable Settings fields are Persian-only for now (English/
  // Arabic content translation is a separate, paused stage) — fall back to
  // the static UI dictionary's own fa/en/ar copy for non-Persian visitors.
  const isFa = locale === "fa";
  const ctaHeading = isFa ? footer.footerCtaHeading : t.footerCtaHeading;
  const ctaBody = isFa ? footer.footerCtaBody : t.footerCtaBody;
  const ctaButton = isFa ? footer.footerCtaButtonLabel : t.footerCtaButton;
  const description = isFa ? footer.footerDescription : SITE.descriptionEn;
  const copyright = isFa ? footer.footerCopyright : t.footerRights;
  const navLabel = (href: string) => (t as Record<string, string>)[NAV_KEY[href]] ?? href;
  const year =
    locale === "fa"
      ? new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date())
      : new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-card-border bg-background-2">
      <div className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="container-x relative py-16">
        {/* CTA strip */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-card-border bg-surface/50 p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              {ctaHeading}
            </h3>
            <p className="mt-2 text-foreground-muted">{ctaBody}</p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            {ctaButton}
            <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* columns */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground-muted">
              {description}
            </p>
            <div className="mt-6 flex gap-2">
              {contact.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-card-border text-foreground-muted transition-all hover:border-primary hover:text-primary"
                >
                  <SocialIcon platform={s.platform} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title={t.footerServices} links={services.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` }))} />
          <FooterCol title={t.footerIndustries} links={industries.slice(0, 6).map((i) => ({ label: i.title, href: `/industries/${i.slug}` }))} />
          <div>
            <h4 className="mb-4 text-sm font-bold text-foreground">{t.footerContact}</h4>
            <ul className="flex flex-col gap-3 text-sm text-foreground-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span className="ltr-nums">{contact.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${contact.email}`} className="ltr-nums hover:text-primary">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-card-border pt-7 text-sm text-foreground-faint md:flex-row">
          <p>
            © {year} {SITE.legalName}. {copyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV.slice(1).map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-foreground">
                {navLabel(n.href)}
              </Link>
            ))}
            <Link href="/admin" className="text-primary/80 hover:text-primary">
              {t.footerAdminLogin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold text-foreground">{title}</h4>
      <ul className="flex flex-col gap-2.5 text-sm text-foreground-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
