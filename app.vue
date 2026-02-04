<script setup>
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});

useHead(() => ({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | CSV Converter` : "CSV Converter";
  },
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [
    { property: "og:site_name", content: "CSV Converter" },
    {
      property: "og:image",
      content: "https://csvconverter.online/csv-converter-logo.png",
    },
    ...(i18nHead.value.meta || []),
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
