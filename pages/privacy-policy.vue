<script setup lang="ts">
const { t, tm, rt } = useI18n();

useSeoMeta({
  title: t("privacyPolicy.metaTitle"),
  description: t("privacyPolicy.metaDescription"),
  robots: "noindex",
});
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-screen-lg">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ t("privacyPolicy.title") }}
    </h1>

    <div class="prose prose-lg text-gray-600 max-w-none">
      <p class="mb-4">
        {{ t("privacyPolicy.lastUpdated") }}
        {{ new Date().toLocaleDateString() }}
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {{ t("privacyPolicy.sections.intro.title") }}
        </h2>
        <p>{{ t("privacyPolicy.sections.intro.content") }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {{ t("privacyPolicy.sections.clientSide.title") }}
        </h2>
        <p v-html="t('privacyPolicy.sections.clientSide.content')"></p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {{ t("privacyPolicy.sections.dataCollection.title") }}
        </h2>
        <p>{{ t("privacyPolicy.sections.dataCollection.content") }}</p>
        <ul class="list-disc pl-6 mb-4">
          <li
            v-for="(item, index) in tm(
              'privacyPolicy.sections.dataCollection.items',
            )"
            :key="index"
          >
            {{ rt(item) }}
          </li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {{ t("privacyPolicy.sections.cookies.title") }}
        </h2>
        <p>{{ t("privacyPolicy.sections.cookies.content") }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {{ t("privacyPolicy.sections.contact.title") }}
        </h2>
        <p>
          {{ t("privacyPolicy.sections.contact.content") }}
          <a
            href="mailto:hostgu72@gmail.com"
            class="text-blue-600 hover:underline"
            >hostgu72@gmail.com</a
          >
        </p>
      </section>
    </div>
  </div>
</template>
