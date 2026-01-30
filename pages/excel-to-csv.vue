<script setup lang="ts">
import { ref } from "vue";
import * as XLSX from "xlsx";
import { Upload, Download, Copy, Trash2 } from "lucide-vue-next";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const csvOutput = ref<string>("");
const error = ref<string>("");
const isConverting = ref(false);

useSeoMeta({
  title: t("tools.excelToCsv.metaTitle"),
  description: t("tools.excelToCsv.metaDescription"),
});

const handleFile = (f: File) => {
  if (
    f.type &&
    !f.type.includes("sheet") &&
    !f.type.includes("excel") &&
    !f.name.match(/\.xlsx?$/)
  ) {
    error.value = "Invalid file type. Please upload an Excel file.";
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

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      csvOutput.value = XLSX.utils.sheet_to_csv(worksheet);
      isConverting.value = false;
    } catch (err) {
      error.value = "Error reading Excel file.";
      isConverting.value = false;
    }
  };
  reader.onerror = () => {
    error.value = "Error reading file.";
    isConverting.value = false;
  };
  reader.readAsArrayBuffer(file.value);
};

const downloadCsv = () => {
  if (!csvOutput.value) return;
  const blob = new Blob([csvOutput.value], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.value
    ? file.value.name.replace(/\.[^/.]+$/, "") + ".csv"
    : "output.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(csvOutput.value);
};

const clear = () => {
  file.value = null;
  csvOutput.value = "";
  error.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-3xl font-bold text-center mb-4">
      {{ $t("tools.excelToCsv.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-2">
      {{ $t("tools.excelToCsv.subtitle") }}
    </p>

    <div class="mt-4 text-sm text-gray-600 text-center mb-8">
      {{ $t("tools.common.whatIsCsvLink.text") }}
      <NuxtLink
        :to="localePath('/what-is-an-csv-file')"
        class="text-blue-600 hover:text-blue-700 font-medium hover:underline"
      >
        {{ $t("tools.common.whatIsCsvLink.linkText") }}
      </NuxtLink>
    </div>

    <!-- Upload Area -->
    <div
      v-if="!csvOutput"
      @dragover.prevent
      @drop="onDrop"
      class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
      @click="fileInput?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
            {{ $t("tools.excelToCsv.upload.dropText") }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ $t("tools.excelToCsv.upload.browse") }}
          </p>
        </div>
        <p class="text-xs text-gray-400">
          {{ $t("tools.excelToCsv.upload.support") }}
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Result Area -->
    <div v-if="csvOutput" class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">CSV Output</h2>
        <div class="flex gap-2">
          <button
            @click="copyToClipboard"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Copy class="w-4 h-4" />
            {{ $t("tools.common.actions.copy") }}
          </button>
          <button
            @click="downloadCsv"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Download class="w-4 h-4" />
            {{ $t("tools.common.actions.download") }}
          </button>
          <button
            @click="clear"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
      <pre
        class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[500px] text-sm font-mono"
        >{{ csvOutput }}</pre
      >
    </div>

    <!-- SEO Content -->
    <div class="prose prose-lg max-w-none text-gray-600 mt-16">
      <div class="grid md:grid-cols-2 gap-12 mb-12">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t("tools.excelToCsv.seo.why.title") }}
          </h2>
          <p>{{ $t("tools.excelToCsv.seo.why.content") }}</p>
        </section>
      </div>

      <section class="bg-blue-50 rounded-2xl p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ $t("tools.excelToCsv.seo.how.title") }}
        </h2>
        <ul class="space-y-4">
          <li
            v-for="(step, index) in tm('tools.excelToCsv.seo.how.steps')"
            :key="index"
            class="flex items-start"
          >
            <span
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold mr-4"
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
