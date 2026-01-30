<script setup lang="ts">
const { t, tm, rt } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t("pages.guides.whatIsCsv.seoTitle"),
  description: t("pages.guides.whatIsCsv.seoDesc"),
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: t("pages.guides.whatIsCsv.title"),
          description: t("pages.guides.whatIsCsv.seoDesc"),
          author: {
            "@type": "Organization",
            name: t("brand.title"),
          },
        }),
      ),
    },
  ],
});

const comparisonRows = computed(() => {
  const rows = tm("pages.guides.whatIsCsv.comparison.table.rows") as any;
  if (Array.isArray(rows)) {
    return rows.map((row: any) => ({
      format: rt(row.format),
      readability: rt(row.readability),
      complexity: rt(row.complexity),
      size: rt(row.size),
      useCase: rt(row.useCase),
    }));
  }
  return [];
});

const tableHeaders = computed(() => {
  const headers = tm("pages.guides.whatIsCsv.comparison.table.header") as any;
  if (Array.isArray(headers)) {
    return headers.map((h: any) => rt(h));
  }
  return [];
});

const renderMarkdown = (text: string) => {
  return text;
};
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-screen-xl">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">
        {{ $t("pages.guides.whatIsCsv.title") }}
      </h1>

      <div class="prose prose-lg text-gray-600 max-w-none">
        <p class="lead text-xl text-gray-800 mb-8">
          {{ $t("pages.guides.whatIsCsv.intro") }}
        </p>

        <!-- Origins -->
        <div class="mt-12 mb-6 border-l-4 border-indigo-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.origins.title") }}
          </h2>
        </div>
        <div
          class="text-lg text-gray-700 leading-relaxed mb-12"
          v-html="renderMarkdown($t('pages.guides.whatIsCsv.origins.content'))"
        ></div>

        <!-- Features -->
        <div class="mt-12 mb-6 border-l-4 border-purple-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.features.title") }}
          </h2>
        </div>
        <ul class="grid md:grid-cols-2 gap-6 mb-16">
          <li
            class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            v-html="$t('pages.guides.whatIsCsv.features.list.simple')"
          ></li>
          <li
            class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            v-html="$t('pages.guides.whatIsCsv.features.list.compatible')"
          ></li>
          <li
            class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            v-html="$t('pages.guides.whatIsCsv.features.list.lightweight')"
          ></li>
          <li
            class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            v-html="$t('pages.guides.whatIsCsv.features.list.humanReadable')"
          ></li>
        </ul>

        <!-- Comparison Table -->
        <div class="mt-12 mb-6 border-l-4 border-pink-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.comparison.title") }}
          </h2>
        </div>
        <p class="text-lg text-gray-700 leading-relaxed mb-8">
          {{ $t("pages.guides.whatIsCsv.comparison.desc") }}
        </p>

        <div
          class="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-xl mb-16"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b whitespace-nowrap"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(row, rowIndex) in comparisonRows"
                  :key="rowIndex"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                  >
                    {{ row.format }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {{ row.readability }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {{ row.complexity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {{ row.size }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {{ row.useCase }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
