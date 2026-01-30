<script setup lang="ts">
import { FileQuestion, Monitor } from "lucide-vue-next";
const localePath = useLocalePath();
</script>

<template>
  <div class="container mx-auto px-4 mt-20 mb-10 max-w-screen-xl pb-10">
    <!-- 1. Educational Guides -->
    <div class="mb-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t("home.guides.title") }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ $t("home.guides.subtitle") }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <NuxtLink
          :to="localePath('/what-is-an-csv-file')"
          class="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-blue-200"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors"
            >
              <FileQuestion class="w-6 h-6" />
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                {{ $t("home.guides.whatIsCsv.title") }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ $t("home.guides.whatIsCsv.description") }}
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          :to="localePath('/how-to-open-csv')"
          class="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-blue-200"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-3 bg-sky-50 text-sky-600 rounded-lg group-hover:bg-sky-100 transition-colors"
            >
              <Monitor class="w-6 h-6" />
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                {{ $t("home.guides.howToOpenCsv.title") }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ $t("home.guides.howToOpenCsv.description") }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
