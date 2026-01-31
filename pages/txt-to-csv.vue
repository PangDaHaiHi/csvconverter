<script setup lang="ts">
import { ref, computed } from "vue";
import Papa from "papaparse";
import { Upload, Download, Copy, Trash2, Settings } from "lucide-vue-next";

const { t } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const csvOutput = ref<string>("");
const error = ref<string>("");
const isConverting = ref(false);
const delimiter = ref(",");

const delimiters = [
  { label: "Comma (,)", value: "," },
  { label: "Tab (\\t)", value: "\t" },
  { label: "Pipe (|)", value: "|" },
  { label: "Semicolon (;)", value: ";" },
  { label: "Space ( )", value: " " },
];

useSeoMeta({
  title: t("tools.txtToCsv.metaTitle"),
  description: t("tools.txtToCsv.metaDescription"),
});

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
    const text = e.target?.result as string;

    // Parse using the selected delimiter
    Papa.parse(text, {
      delimiter: delimiter.value,
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
      {{ $t("tools.txtToCsv.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-2">
      {{ $t("tools.txtToCsv.subtitle") }}
    </p>

    <!-- Link back to Hub -->
    <div class="text-center mb-8">
      <NuxtLink
        :to="localePath('/what-is-csv')"
        class="text-sm text-blue-600 hover:underline"
      >
        ← {{ $t("pages.guides.whatIsCsv.title") }}
      </NuxtLink>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <!-- Upload Area -->
      <div
        v-if="!file"
        @dragover.prevent
        @drop="onDrop"
        class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50"
        @click="fileInput?.click()"
      >
        <div
          class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Upload class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-semibold mb-2">
          {{ $t("tools.txtToCsv.upload.dropText") }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ $t("tools.txtToCsv.upload.support") }}
        </p>
        <button
          class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {{ $t("tools.txtToCsv.upload.browse") }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".txt"
          class="hidden"
          @change="onFileSelect"
        />
      </div>

      <!-- Conversion Area -->
      <div v-else class="space-y-6">
        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <span class="font-bold text-gray-600">TXT</span>
            </div>
            <div>
              <p class="font-medium text-gray-900 truncate max-w-[200px]">
                {{ file.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ (file.size / 1024).toFixed(2) }} KB
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Delimiter Selector -->
            <div class="flex items-center gap-2">
              <Settings class="w-4 h-4 text-gray-500" />
              <select
                v-model="delimiter"
                class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              >
                <option
                  v-for="opt in delimiters"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <button
              @click="clear"
              class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove file"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          v-if="error"
          class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm"
        >
          {{ error }}
        </div>

        <div v-if="isConverting" class="text-center py-8">
          <div
            class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
          ></div>
          <p class="text-gray-600">Converting...</p>
        </div>

        <div v-if="csvOutput && !isConverting" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-700">CSV Output Preview</h3>
            <div class="flex gap-2">
              <button
                @click="copyToClipboard"
                class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Copy class="w-4 h-4" /> Copy
              </button>
            </div>
          </div>

          <div class="relative">
            <textarea
              readonly
              :value="csvOutput"
              class="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <button
            @click="downloadCsv"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:shadow-green-900/20 active:scale-[0.99]"
          >
            <Download class="w-5 h-5" />
            Download CSV
          </button>
        </div>
      </div>
    </div>

    <!-- SEO Content -->
    <div class="mt-16 prose prose-blue max-w-none">
      <h2>{{ $t("tools.txtToCsv.seo.why.title") }}</h2>
      <p>{{ $t("tools.txtToCsv.seo.why.content") }}</p>

      <h2>{{ $t("tools.txtToCsv.seo.how.title") }}</h2>
      <ul>
        <li v-for="(step, i) in tm('tools.txtToCsv.seo.how.steps')" :key="i">
          {{ rt(step) }}
        </li>
      </ul>
    </div>

    <div class="mt-12 border-t border-gray-200 pt-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Related Tools</h3>
      <NuxtLink
        :to="localePath('/xlsx-to-csv')"
        class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-2"
      >
        {{ $t("tools.excelToCsv.title") }}
        <span aria-hidden="true">&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
