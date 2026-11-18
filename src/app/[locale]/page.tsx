import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/content/types";
import { ROUTES } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/m3/Button";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { PathFinder } from "@/components/sections/PathFinder";
import { ProgramGrid } from "@/components/sections/ProgramGrid";
import { HfosTeaser } from "@/components/sections/HfosTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrialCta } from "@/components/sections/TrialCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    ...pageMetadata(locale, "", t("metaTitle"), t("metaDescription")),
    // absolute: the homepage title already carries the brand, so it must not
    // also get the layout's "· Hanna Filia" suffix.
    title: { absolute: t("metaTitle") },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("cta");

  return (
    <main>
      <Hero
        title={t("heroTitle")}
        body={t("heroBody")}
        actions={
          <>
            <Button href={ROUTES.contact}>
              {tc("trial")}
            </Button>
            <Button href={ROUTES.programs} variant="outlined">
              {tc("seePrograms")}
            </Button>
          </>
        }
      />

      <ProgramGrid />
      <StatsBar />
      <PathFinder />
      <HfosTeaser />
      <Testimonials />
      <TrialCta />

    </main>
  );
}
