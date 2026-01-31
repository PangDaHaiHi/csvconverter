<script setup lang="ts">
import {
  FileQuestion,
  Monitor,
  Upload,
  Zap,
  Download,
  HelpCircle,
} from "lucide-vue-next";
const localePath = useLocalePath();
</script>

<template>
  <div class="container mx-auto px-4 mt-20 mb-10 max-w-screen-xl pb-10">
    <!-- 1. Educational Guides (What is CSV) -->
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

    <!-- 2. How to Convert (Generic) -->
    <div class="mb-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t("home.howItWorks.title") }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ $t("home.howItWorks.subtitle") }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        <!-- Connecting Line (Desktop) -->
        <div
          class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10"
        ></div>

        <!-- Step 1 -->
        <div
          class="relative bg-white p-6 rounded-xl border border-gray-100 text-center"
        >
          <div
            class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm"
          >
            <Upload class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">
            {{ $t("home.howItWorks.steps.step1.title") }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ $t("home.howItWorks.steps.step1.desc") }}
          </p>
        </div>

        <!-- Step 2 -->
        <div
          class="relative bg-white p-6 rounded-xl border border-gray-100 text-center"
        >
          <div
            class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm"
          >
            <Zap class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">
            {{ $t("home.howItWorks.steps.step2.title") }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ $t("home.howItWorks.steps.step2.desc") }}
          </p>
        </div>

        <!-- Step 3 -->
        <div
          class="relative bg-white p-6 rounded-xl border border-gray-100 text-center"
        >
          <div
            class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold border-4 border-white shadow-sm"
          >
            <Download class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-3">
            {{ $t("home.howItWorks.steps.step3.title") }}
          </h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ $t("home.howItWorks.steps.step3.desc") }}
          </p>
        </div>
      </div>
    </div>

    <!-- 3. FAQ Section -->
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t("home.faq.title") }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ $t("home.faq.subtitle") }}
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(item, key) in $tm('home.faq.items')"
          :key="key"
          class="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-colors"
        >
          <h3
            class="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3"
          >
            <HelpCircle class="w-6 h-6 text-blue-600 shrink-0" />
            {{ $rt(item.question) }}
          </h3>
          <p class="text-gray-600 leading-relaxed pl-9">
            {{ $rt(item.answer) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
