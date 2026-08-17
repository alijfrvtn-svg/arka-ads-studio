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
    // `footer-dark` (globals.css) redefines the colour tokens for this
    // subtree, so the logo, links, social pills and CTA button all invert
    // themselves rather than each carrying a dark-mode class.
    <footer className="footer-dark relative overflow-hidden">
      <div className="container-x relative py-20 md:py-24">
        {/* CTA strip */}
        <div className="glass mb-20 flex flex-col items-start justify-between gap-8 rounded-[2rem] p-10 md:flex-row md:items-center md:p-14">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {ctaHeading}
            </h3>
            <p className="mt-3 text-foreground-muted">{ctaBody}</p>
          </div>
          <Link
            href="/contact"
            className="liquid liquid-raised group inline-flex shrink-0 items-center gap-2 rounded-full px-8 py-4 font-semibold"
          >
            <span className="inline-flex items-center gap-2">
              {ctaButton}
              <ArrowUpLeft className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            </span>
          </Link>
        </div>

        {/* columns */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo tagline />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground-muted">
              {description}
            </p>
            <div className="mt-7 flex gap-2.5">
              {contact.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="footer-social liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground-muted"
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
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground-faint" />
                {contact.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-foreground-faint" />
                {/* A phone number on a phone should be tappable. */}
                <a href={`tel:${contact.phone}`} className="footer-link ltr-nums inline-flex min-h-11 items-center">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-foreground-faint" />
                <a href={`mailto:${contact.email}`} className="footer-link ltr-nums inline-flex min-h-11 items-center">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-card-border pt-8 text-sm text-foreground-faint md:flex-row">
          <p className="text-center md:text-right">
            © {year} {SITE.legalName}. {copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0 md:justify-start">
            {NAV.slice(1).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="footer-link inline-flex min-h-11 items-center px-1"
              >
                {navLabel(n.href)}
              </Link>
            ))}
            {/* The CMS link is deliberately gone. /admin is reached through the
                secret entry route in middleware.ts (ADMIN_ACCESS_PATH), so the
                public site advertises no way in at all. */}
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
      {/* min-h-11 on the link itself (not the li) keeps the underline hugging
          the text while the tap area reaches the 44px floor. */}
      <ul className="flex flex-col text-sm text-foreground-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="footer-link link-underline inline-flex min-h-11 items-center">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
