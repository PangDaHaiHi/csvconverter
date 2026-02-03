<script setup lang="ts">
import {
  FileSpreadsheet,
  FileText,
  Globe,
  Code,
  Laptop,
} from "lucide-vue-next";
import { computed } from "vue";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t("pages.guides.howToOpenCsv.seoTitle"),
  description: t("pages.guides.howToOpenCsv.seoDesc"),
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: t("pages.guides.howToOpenCsv.title"),
          description: t("pages.guides.howToOpenCsv.seoDesc"),
          author: {
            "@type": "Organization",
            name: t("brand.title"),
          },
        }),
      ),
    },
  ],
});
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-screen-xl">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">
        {{ $t("pages.guides.howToOpenCsv.title") }}
      </h1>

      <p class="lead text-xl text-gray-800 mb-6 leading-relaxed">
        {{ $t("pages.guides.howToOpenCsv.description") }}
      </p>

      <div class="mb-12 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <p class="text-gray-700 m-0">
          <i18n-t
            keypath="pages.guides.howToOpenCsv.learnMore"
            tag="span"
            scope="global"
          >
            <template #link>
              <NuxtLink
                :to="localePath('/what-is-csv')"
                class="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {{ $t("pages.guides.whatIsCsv.title") }}
              </NuxtLink>
            </template>
          </i18n-t>
        </p>
      </div>

      <!-- 5 Methods Section -->
      <h2 class="text-2xl font-bold text-gray-900 mb-8">
        {{ $t("pages.guides.howToOpenCsv.methods.title") }}
      </h2>

      <!-- Method 1: Excel -->
      <div class="mb-10 border-b border-gray-100 pb-8">
        <div class="flex items-center gap-3 mb-3">
          <FileSpreadsheet class="w-6 h-6 text-green-600" />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ $t("pages.guides.howToOpenCsv.methods.method1.title") }}
          </h3>
        </div>
        <p class="text-gray-700 mb-3 leading-relaxed">
          {{ $t("pages.guides.howToOpenCsv.methods.method1.desc") }}
        </p>
        <p
          class="mb-4 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method1.steps") }}
        </p>
        <span
          class="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded text-sm font-medium border border-yellow-100"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method1.cons") }}
        </span>
      </div>

      <!-- Method 2: Google Sheets -->
      <div class="mb-10 border-b border-gray-100 pb-8">
        <div class="flex items-center gap-3 mb-3">
          <Globe class="w-6 h-6 text-blue-600" />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ $t("pages.guides.howToOpenCsv.methods.method2.title") }}
          </h3>
        </div>
        <p class="text-gray-700 mb-3 leading-relaxed">
          {{ $t("pages.guides.howToOpenCsv.methods.method2.desc") }}
        </p>
        <p
          class="mb-4 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method2.steps") }}
        </p>
        <span
          class="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium border border-blue-100"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method2.cons") }}
        </span>
      </div>

      <!-- Method 3: Text Editor -->
      <div class="mb-10 border-b border-gray-100 pb-8">
        <div class="flex items-center gap-3 mb-3">
          <FileText class="w-6 h-6 text-gray-600" />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ $t("pages.guides.howToOpenCsv.methods.method3.title") }}
          </h3>
        </div>
        <p class="text-gray-700 mb-3 leading-relaxed">
          {{ $t("pages.guides.howToOpenCsv.methods.method3.desc") }}
        </p>
        <p
          class="mb-4 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method3.steps") }}
        </p>
        <span
          class="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium border border-gray-200"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method3.cons") }}
        </span>
      </div>

      <!-- Method 4: VS Code -->
      <div class="mb-10 border-b border-gray-100 pb-8">
        <div class="flex items-center gap-3 mb-3">
          <Code class="w-6 h-6 text-indigo-600" />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ $t("pages.guides.howToOpenCsv.methods.method4.title") }}
          </h3>
        </div>
        <p class="text-gray-700 mb-3 leading-relaxed">
          {{ $t("pages.guides.howToOpenCsv.methods.method4.desc") }}
        </p>
        <p
          class="mb-4 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method4.steps") }}
        </p>
        <span
          class="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-sm font-medium border border-indigo-100"
        >
          {{ $t("pages.guides.howToOpenCsv.methods.method4.cons") }}
        </span>
      </div>

      <!-- Method 5: Online Converter (CTA) -->
      <div class="mb-12">
        <div class="flex items-center gap-3 mb-3">
          <Laptop class="w-6 h-6 text-purple-600" />
          <h3 class="text-xl font-semibold text-gray-800">
            {{ $t("pages.guides.howToOpenCsv.methods.method5.title") }}
          </h3>
        </div>
        <p class="text-gray-700 mb-4 text-lg leading-relaxed">
          {{ $t("pages.guides.howToOpenCsv.methods.method5.desc") }}
        </p>

        <!-- CTA Box -->
        <div class="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <NuxtLink
              :to="localePath('/json-to-csv')"
              class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm text-center"
            >
              {{ $t("home.tools.jsonToCsv.title") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/xlsx-to-csv')"
              class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm text-center"
            >
              {{ $t("home.tools.xlsxToCsv.title") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/txt-to-csv')"
              class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm text-center"
            >
              {{ $t("home.tools.txtToCsv.title") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/xml-to-csv')"
              class="inline-flex items-center justify-center px-4 py-2.5 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm text-center"
            >
              {{ $t("home.tools.xmlToCsv.title") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
