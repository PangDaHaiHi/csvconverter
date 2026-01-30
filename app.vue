<script setup>
const i18nHead = useLocaleHead({
  addSeoAttributes: true,
});

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs.lang,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <CookieConsent />
  </NuxtLayout>
</template>
