<script setup>
const { t } = useI18n();
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});

useHead(() => ({
  titleTemplate: (titleChunk) => {
    const brand = t("brand.title");
    if (!titleChunk) return brand;
    if (
      titleChunk.includes(brand) ||
      titleChunk.toLowerCase().includes("csv converter")
    ) {
      return titleChunk;
    }
    return `${titleChunk} | ${brand}`;
  },
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [
    ...(i18nHead.value.link || []).map((link) => {
      // Force trailing slash for homepage canonical and alternate links if missing
      if (
        (link.rel === "canonical" || link.rel === "alternate") &&
        link.href === "https://csvconverter.online"
      ) {
        return { ...link, href: "https://csvconverter.online/" };
      }
      return link;
    }),
  ],
  meta: [
    { property: "og:site_name", content: "CSV Converter" },
    {
      property: "og:image",
      content: "https://csvconverter.online/csv-converter-logo.png",
    },
    ...(i18nHead.value.meta || []).map((meta) => {
      // Force trailing slash for homepage og:url if missing
      if (
        meta.property === "og:url" &&
        meta.content === "https://csvconverter.online"
      ) {
        return { ...meta, content: "https://csvconverter.online/" };
      }
      return meta;
    }),
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "CSV Converter",
        url: "https://csvconverter.online",
      }),
    },
  ],
}));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <CookieConsent />
  </NuxtLayout>
</template>
