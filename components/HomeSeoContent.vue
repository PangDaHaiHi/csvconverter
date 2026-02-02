<script setup lang="ts">
import { FileQuestion, Monitor } from "lucide-vue-next";
const localePath = useLocalePath();
</script>

<template>
  <div class="container mx-auto px-4 mt-20 mb-4 max-w-screen-xl pb-4">
    <!-- 1. Educational Guides (What is CSV) -->
    <div class="mb-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t("home.guides.title") }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ $t("home.guides.subtitle") }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <!-- 1. What Does CSV Stand For -->
        <NuxtLink
          :to="localePath('/what-is-csv#stand-for')"
          class="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-blue-200"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors"
            >
              <FileQuestion class="w-6 h-6" />
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                {{ $t("home.guides.whatDoesCsvStandFor.title") }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ $t("home.guides.whatDoesCsvStandFor.description") }}
              </p>
            </div>
          </div>
        </NuxtLink>

        <!-- 2. What is CSV Format -->
        <NuxtLink
          :to="localePath('/what-is-csv#format')"
          class="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:border-blue-200"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors"
            >
              <FileQuestion class="w-6 h-6" />
            </div>
            <div>
              <h3
                class="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                {{ $t("home.guides.whatIsCsvFormat.title") }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ $t("home.guides.whatIsCsvFormat.description") }}
              </p>
            </div>
          </div>
        </NuxtLink>

        <!-- 3. What is a CSV File -->
        <NuxtLink
          :to="localePath('/what-is-csv')"
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

        <!-- 4. How to Open CSV Files -->
        <NuxtLink
          :to="localePath('/how-to-open-csv-file')"
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
