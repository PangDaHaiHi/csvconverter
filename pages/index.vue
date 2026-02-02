<script setup lang="ts">
import {
  FileJson,
  FileSpreadsheet,
  FileText,
  Shield,
  Zap,
  MousePointer,
  Code,
  Laptop,
  File,
} from "lucide-vue-next";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t("home.hero.title"),
  description: t("home.hero.subtitle"),
  ogTitle: t("home.hero.title"),
  ogDescription: t("home.hero.subtitle"),
});

const tools = [
  {
    path: "/json-to-csv",
    icon: FileJson,
    title: "home.tools.jsonToCsv.title",
    desc: "home.tools.jsonToCsv.desc",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    path: "/txt-to-csv",
    icon: FileText,
    title: "home.tools.txtToCsv.title",
    desc: "home.tools.txtToCsv.desc",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
  {
    path: "/excel-to-csv",
    icon: FileSpreadsheet,
    title: "home.tools.excelToCsv.title",
    desc: "home.tools.excelToCsv.desc",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    path: "/xml-to-csv",
    icon: Code,
    title: "home.tools.xmlToCsv.title",
    desc: "home.tools.xmlToCsv.desc",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];
</script>

<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div
      class="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-24 sm:py-32"
    >
      <!-- Background effects -->
      <div
        class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-3xl"
      ></div>

      <div class="relative container mx-auto px-2 text-center max-w-screen-xl">
        <h1
          class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg"
        >
          {{ $t("home.hero.title") }}
        </h1>
        <p
          class="text-lg sm:text-xl text-slate-300 mb-10 mx-auto leading-relaxed max-w-4xl"
        >
          {{ $t("home.hero.subtitle") }}
        </p>

        <!-- Quick Tool Links -->
        <div
          id="tools"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 w-full max-w-7xl mx-auto"
        >
          <NuxtLink
            v-for="tool in tools"
            :key="tool.path"
            :to="localePath(tool.path)"
            class="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all group text-left w-full min-w-0 hover:scale-105 duration-300 hover:shadow-xl hover:shadow-blue-900/20"
          >
            <div
              :class="`w-12 h-12 ${tool.bg} rounded-lg flex items-center justify-center shrink-0 shadow-sm`"
            >
              <component :is="tool.icon" :class="`w-6 h-6 ${tool.color}`" />
            </div>
            <div class="min-w-0">
              <div
                class="font-bold text-white group-hover:text-blue-200 transition-colors leading-tight"
              >
                {{ $t(tool.title) }}
              </div>
              <div class="text-xs text-slate-400 leading-snug">
                {{ $t(tool.desc) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- CSV Guides Section -->
    <HomeSeoContent />

    <!-- Features / Why Choose Us -->
    <div class="py-12 bg-gray-50">
      <div class="container mx-auto px-4 max-w-screen-xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t("home.whyChoose.title") }}
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            {{ $t("home.whyChoose.subtitle") }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"
            >
              <Shield class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t("home.whyChoose.items.privacy.title") }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t("home.whyChoose.items.privacy.desc") }}
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"
            >
              <Zap class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t("home.whyChoose.items.speed.title") }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t("home.whyChoose.items.speed.desc") }}
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6"
            >
              <MousePointer class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t("home.whyChoose.items.simple.title") }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t("home.whyChoose.items.simple.desc") }}
            </p>
          </div>

          <div
            class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div
              class="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6"
            >
              <Laptop class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $t("home.whyChoose.items.device.title") }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t("home.whyChoose.items.device.desc") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
