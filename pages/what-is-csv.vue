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
        })
      ),
    },
  ],
});

const comparisonRows = computed(() => {
  const rows = tm("pages.guides.whatIsCsv.sections.vsExcel.table.rows") as any;
  if (Array.isArray(rows)) {
    return rows.map((row: any) => {
       // row is an array of strings
       return row.map((cell: any) => rt(cell));
    });
  }
  return [];
});

const tableHeaders = computed(() => {
  const headers = tm("pages.guides.whatIsCsv.sections.vsExcel.table.headers") as any;
  if (Array.isArray(headers)) {
    return headers.map((h: any) => rt(h));
  }
  return [];
});

const internalLinks = computed(() => {
    const list = tm("pages.guides.whatIsCsv.internalLinks.list") as any;
    if (Array.isArray(list)) {
        return list.map((item: any) => ({
            text: rt(item.text),
            path: rt(item.path)
        }));
    }
    return [];
});
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

        <!-- What Does CSV Stand For -->
        <div class="mt-12 mb-6 border-l-4 border-indigo-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.sections.standFor.title") }}
          </h2>
        </div>
        <div class="text-lg text-gray-700 leading-relaxed mb-12" v-html="$t('pages.guides.whatIsCsv.sections.standFor.content')"></div>

        <!-- What Is CSV Format -->
        <div class="mt-12 mb-6 border-l-4 border-blue-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.sections.format.title") }}
          </h2>
        </div>
        <div class="text-lg text-gray-700 leading-relaxed mb-12" v-html="$t('pages.guides.whatIsCsv.sections.format.content')"></div>

        <!-- What Is CSV Used For -->
        <div class="mt-12 mb-6 border-l-4 border-green-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.sections.usedFor.title") }}
          </h2>
        </div>
        <div class="text-lg text-gray-700 leading-relaxed mb-12" v-html="$t('pages.guides.whatIsCsv.sections.usedFor.content')"></div>

        <!-- Example -->
        <div class="mt-12 mb-6 border-l-4 border-yellow-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.sections.example.title") }}
          </h2>
        </div>
        <div class="text-lg text-gray-700 leading-relaxed mb-4">
            {{ $t("pages.guides.whatIsCsv.sections.example.content") }}
        </div>
        <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto mb-4"><code>{{ $t("pages.guides.whatIsCsv.sections.example.code") }}</code></pre>
        <p class="text-gray-600 italic mb-12">{{ $t("pages.guides.whatIsCsv.sections.example.explanation") }}</p>

        <!-- CSV vs Excel -->
        <div class="mt-12 mb-6 border-l-4 border-red-500 pl-4">
          <h2 class="text-2xl font-bold text-gray-900 m-0">
            {{ $t("pages.guides.whatIsCsv.sections.vsExcel.title") }}
          </h2>
        </div>
        <p class="text-lg text-gray-700 leading-relaxed mb-8">
          {{ $t("pages.guides.whatIsCsv.sections.vsExcel.content") }}
        </p>

        <div class="overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-xl mb-16">
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
                  <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-6 py-4 whitespace-nowrap text-gray-600 first:font-medium first:text-gray-900">
                      {{ cell }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Internal Links -->
        <div class="mt-16 pt-8 border-t border-gray-200">
            <h3 class="text-xl font-bold mb-4">{{ $t("pages.guides.whatIsCsv.internalLinks.title") }}</h3>
            <ul class="flex flex-col gap-3">
                <li v-for="link in internalLinks" :key="link.path">
                    <NuxtLink :to="localePath(link.path)" class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2">
                        <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {{ link.text }}
                    </NuxtLink>
                </li>
            </ul>
        </div>

      </div>
    </div>
  </div>
</template>
