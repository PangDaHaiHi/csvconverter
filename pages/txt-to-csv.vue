<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Upload,
  Download,
  Copy,
  Trash2,
  Settings,
  Check,
} from "lucide-vue-next";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const csvOutput = ref<string>("");
const error = ref<string>("");
const isConverting = ref(false);
const isCopied = ref(false);
const delimiter = ref(",");

const delimiters = [
  { label: "comma", value: "," },
  { label: "tab", value: "\t" },
  { label: "pipe", value: "|" },
  { label: "semicolon", value: ";" },
  { label: "space", value: " " },
];

useSeoMeta({
  title: t("tools.txtToCsv.metaTitle"),
  description: t("tools.txtToCsv.metaDescription"),
});

const seoExampleTxt = `Name,Email,Phone
John Doe,john@example.com,555-555-5555
Jane Smith,jane@example.com,555-555-1234`;

const seoExampleCsv = `Name,Email,Phone
John Doe,john@example.com,555-555-5555
Jane Smith,jane@example.com,555-555-1234`;

const handleFile = (f: File) => {
  if (f.type && !f.type.startsWith("text/") && !f.name.endsWith(".txt")) {
    error.value = "Invalid file type. Please upload a TXT file.";
    return;
  }
  file.value = f;
  error.value = "";
  convert();
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files.length) {
    handleFile(e.dataTransfer.files[0] as File);
  }
};

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    handleFile(target.files[0] as File);
  }
};

const convert = async () => {
  if (!file.value) return;
  isConverting.value = true;

  const Papa = (window as any).Papa;
  if (!Papa) {
    error.value = "CSV parser not ready. Please try again.";
    isConverting.value = false;
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;

    // Parse using the selected delimiter
    Papa.parse(text, {
      delimiter: delimiter.value,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          error.value = "Could not parse text file with selected delimiter.";
          isConverting.value = false;
          return;
        }
        // Unparse back to standard CSV (comma separated, quoted if needed)
        try {
          csvOutput.value = Papa.unparse(results.data);
          error.value = "";
        } catch (err) {
          error.value = "Error converting to CSV.";
        }
        isConverting.value = false;
      },
      error: (err) => {
        error.value = "Error parsing file: " + err.message;
        isConverting.value = false;
      },
    });
  };
  reader.onerror = () => {
    error.value = "Error reading file.";
    isConverting.value = false;
  };
  reader.readAsText(file.value);
};

// Re-convert when delimiter changes
watch(delimiter, () => {
  if (file.value && !isConverting.value) {
    convert();
  }
});

const downloadCsv = () => {
  if (!csvOutput.value) return;
  // Add BOM for Excel compatibility
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvOutput.value], {
    type: "text/csv;charset=utf-8;",
  });
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
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
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
      {{ $t("tools.txtToCsv.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-8">
      {{ $t("tools.txtToCsv.subtitle") }}
    </p>

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
        accept=".txt,text/plain"
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
            {{ $t("tools.txtToCsv.upload.dropText") }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ $t("tools.txtToCsv.upload.browse") }}
          </p>
        </div>
        <p class="text-xs text-gray-400">
          {{ $t("tools.txtToCsv.upload.support") }}
        </p>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm"
    >
      {{ error }}
    </div>

    <!-- Conversion Area -->
    <div v-if="csvOutput" class="mt-8">
      <div class="space-y-4">
        <!-- Delimiter Selection -->
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2 text-gray-700 font-medium">
              <Settings class="w-5 h-5" />
              {{ $t("tools.txtToCsv.delimiter.label") }}
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="d in delimiters"
                  :key="d.value"
                  @click="delimiter = d.value"
                  class="px-3 py-1.5 rounded text-sm transition-colors border"
                  :class="
                    delimiter === d.value
                      ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  "
                >
                  {{ $t(`tools.txtToCsv.delimiter.options.${d.label}`) }}
                </button>
              </div>
              <p class="text-xs text-gray-500">
                {{ $t("tools.txtToCsv.delimiter.hint") }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ $t("tools.common.csvOutput") }}
          </h2>
          <div class="flex gap-2">
            <button
              @click="copyToClipboard"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200"
              :class="
                isCopied
                  ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              "
            >
              <Check v-if="isCopied" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{
                isCopied
                  ? $t("tools.common.actions.copied")
                  : $t("tools.common.actions.copy")
              }}
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
    </div>

    <!-- SEO Content -->
    <div class="prose prose-lg max-w-none text-gray-600 mt-16">
      <!-- How Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ $t("tools.txtToCsv.seo.how.title") }}
        </h2>
        <ol class="space-y-4 list-decimal pl-5">
          <li
            v-for="(step, index) in tm('tools.txtToCsv.seo.how.steps')"
            :key="index"
            class="pl-2"
          >
            <span v-html="rt(step)"></span>
          </li>
        </ol>
      </section>

      <!-- Guide Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ $t("tools.txtToCsv.seo.guide.title") }}
        </h2>
        <p class="mb-4">{{ $t("tools.txtToCsv.seo.guide.content") }}</p>
        <p class="mb-4">
          {{ $t("tools.txtToCsv.seo.guide.linkText") }}
          <NuxtLink
            :to="localePath('/what-is-csv')"
            class="text-blue-600 hover:underline"
          >
            {{ $t("pages.guides.whatIsCsv.title") }}
          </NuxtLink>
        </p>
      </section>

      <!-- Example Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ $t("tools.txtToCsv.seo.example.title") }}
        </h2>
        <div>
          <p class="mb-4">{{ $t("tools.txtToCsv.seo.example.intro") }}</p>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2">
                {{ $t("tools.txtToCsv.seo.example.txtLabel") }}
              </h3>
              <pre
                class="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto"
                >{{ seoExampleTxt }}</pre
              >
            </div>
            <div>
              <h3 class="font-semibold mb-2">
                {{ $t("tools.txtToCsv.seo.example.csvLabel") }}
              </h3>
              <pre
                class="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto"
                >{{ seoExampleCsv }}</pre
              >
            </div>
          </div>
        </div>
      </section>

      <!-- More Tools Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ $t("tools.txtToCsv.seo.moreTools.title") }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            :to="localePath('/json-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">JSON to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.jsonToCsv.desc") }}
            </p>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/xlsx-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">XLSX to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.xlsxToCsv.desc") }}
            </p>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/xml-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow no-underline"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">XML to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.xmlToCsv.desc") }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
