<script setup lang="ts">
import { ref } from "vue";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Upload, Download, Trash2 } from "lucide-vue-next";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const excelWorkbook = ref<XLSX.WorkBook | null>(null);
const error = ref<string>("");
const isConverting = ref(false);
const isDone = ref(false);

useSeoMeta({
  title: t("tools.csvToExcel.metaTitle"),
  description: t("tools.csvToExcel.metaDescription"),
});

const handleFile = (f: File) => {
  if (f.type && !f.type.includes("text") && !f.name.endsWith(".csv")) {
    error.value = "Invalid file type. Please upload a CSV file.";
    return;
  }
  file.value = f;
  error.value = "";
  convert();
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
};

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    handleFile(target.files[0]);
  }
};

const convert = () => {
  if (!file.value) return;
  isConverting.value = true;

  Papa.parse(file.value, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        const worksheet = XLSX.utils.json_to_sheet(results.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        excelWorkbook.value = workbook;
        isConverting.value = false;
        isDone.value = true;
      } catch (err) {
        error.value = "Error converting to Excel.";
        isConverting.value = false;
      }
    },
    error: (err) => {
      error.value = err.message;
      isConverting.value = false;
    },
  });
};

const downloadExcel = () => {
  if (!excelWorkbook.value) return;
  XLSX.writeFile(
    excelWorkbook.value,
    file.value
      ? file.value.name.replace(/\.[^/.]+$/, "") + ".xlsx"
      : "output.xlsx",
  );
};

const clear = () => {
  file.value = null;
  excelWorkbook.value = null;
  isDone.value = false;
  error.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-3xl font-bold text-center mb-4">
      {{ $t("tools.csvToExcel.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-2">
      {{ $t("tools.csvToExcel.subtitle") }}
    </p>

    <div class="mt-4 text-sm text-gray-600 text-center mb-8">
      {{ $t("tools.common.whatIsCsvLink.text") }}
      <NuxtLink
        :to="localePath('/what-is-an-csv-file')"
        class="text-green-600 hover:text-green-700 font-medium hover:underline"
      >
        {{ $t("tools.common.whatIsCsvLink.linkText") }}
      </NuxtLink>
    </div>

    <!-- Upload Area -->
    <div
      v-if="!isDone"
      @dragover.prevent
      @drop="onDrop"
      class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
      @click="fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv,text/csv"
        class="hidden"
        @change="onFileSelect"
      />
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
        >
          <Upload class="w-8 h-8" />
        </div>
        <div>
          <p class="text-lg font-medium text-gray-900">
            {{ $t("tools.csvToExcel.upload.dropText") }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ $t("tools.csvToExcel.upload.browse") }}
          </p>
        </div>
        <p class="text-xs text-gray-400">
          {{ $t("tools.csvToExcel.upload.support") }}
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Result Area -->
    <div v-if="isDone" class="mt-8 text-center">
      <div class="p-8 bg-green-50 rounded-xl border border-green-100 mb-6">
        <p class="text-green-800 text-lg font-medium mb-4">
          {{ $t("tools.common.status.ready") }}
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="downloadExcel"
            class="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm"
          >
            <Download class="w-5 h-5" />
            {{ $t("tools.common.actions.download") }} Excel
          </button>
          <button
            @click="clear"
            class="flex items-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Trash2 class="w-5 h-5" />
            {{ $t("tools.common.actions.convertAnother") || "Convert Another" }}
          </button>
        </div>
      </div>
    </div>

    <!-- SEO Content -->
    <div class="prose prose-lg max-w-none text-gray-600 mt-16">
      <div class="grid md:grid-cols-2 gap-12 mb-12">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t("tools.csvToExcel.seo.why.title") }}
          </h2>
          <p>{{ $t("tools.csvToExcel.seo.why.content") }}</p>
        </section>
      </div>

      <section class="bg-green-50 rounded-2xl p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ $t("tools.csvToExcel.seo.how.title") }}
        </h2>
        <ul class="space-y-4">
          <li
            v-for="(step, index) in tm('tools.csvToExcel.seo.how.steps')"
            :key="index"
            class="flex items-start"
          >
            <span
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full font-bold mr-4"
            >
              {{ index + 1 }}
            </span>
            <span class="pt-1">{{ rt(step) }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
