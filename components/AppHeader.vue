<script setup lang="ts">
import {
  Earth,
  FileJson,
  FileSpreadsheet,
  FileText,
  Code,
} from "lucide-vue-next";
const { locale, locales, setLocale } = useI18n();
const localePath = useLocalePath();

const navItems = [
  { path: "/json-to-csv/", icon: FileJson, label: "nav.jsonToCsv" },
  { path: "/txt-to-csv/", icon: FileText, label: "nav.txtToCsv" },
  { path: "/xlsx-to-csv/", icon: FileSpreadsheet, label: "nav.xlsxToCsv" },
  { path: "/xml-to-csv/", icon: Code, label: "nav.xmlToCsv" },
];
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div
      class="container mx-auto px-4 h-16 flex items-center justify-between max-w-screen-xl"
    >
      <NuxtLink
        :to="localePath('/')"
        class="text-xl font-bold text-gray-900 flex items-center gap-2"
      >
        <img
          src="/favicon.ico"
          :alt="$t('brand.logoAlt')"
          class="w-8 h-8 rounded-lg"
        />
        {{ $t("brand.title") }}
      </NuxtLink>

      <nav class="hidden md:flex">
        <ul class="flex items-center gap-2">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="localePath(item.path)"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
              active-class="bg-blue-50 text-blue-600"
            >
              <component :is="item.icon" class="w-4 h-4" />
              {{ $t(item.label) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <button
            class="flex items-center gap-1 text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-50"
          >
            <Earth class="w-5 h-5" />
            <span class="uppercase font-medium">{{ locale }}</span>
          </button>
          <div
            class="absolute right-0 mt-0 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block"
          >
            <div class="py-1">
              <button
                v-for="l in locales"
                :key="l.code"
                @click="setLocale(l.code)"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                :class="{
                  'font-bold text-blue-600 bg-gray-50': locale === l.code,
                }"
              >
                {{ l.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
