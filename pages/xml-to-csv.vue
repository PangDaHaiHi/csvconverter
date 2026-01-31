<script setup lang="ts">
import { ref } from "vue";
import Papa from "papaparse";
import { Upload, Download, Copy, Trash2 } from "lucide-vue-next";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const csvOutput = ref<string>("");
const error = ref<string>("");
const isConverting = ref(false);

useSeoMeta({
  title: t("tools.xmlToCsv.metaTitle"),
  description: t("tools.xmlToCsv.metaDescription"),
});

const handleFile = (f: File) => {
  if (f.type && !f.type.includes("xml") && !f.name.endsWith(".xml")) {
    error.value = "Invalid file type. Please upload an XML file.";
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

// Simple XML to JSON converter for flat structures
const xmlToJson = (xml: Document) => {
  // This is a simplified logic. In a real app, we might use a robust library.
  // We look for the first repeated child element and assume that's the row.

  const root = xml.documentElement;
  if (!root) return [];

  // Find the list of items. Usually root.children
  const children = Array.from(root.children);
  if (children.length === 0) return [];

  // Map children to objects
  const data = children.map((child) => {
    const obj: Record<string, any> = {};
    const attributes = Array.from(child.attributes);
    attributes.forEach((attr) => {
      obj[`@${attr.name}`] = attr.value;
    });

    // Process child nodes (fields)
    Array.from(child.children).forEach((field) => {
      // If field has no children, it's a value
      if (field.children.length === 0) {
        obj[field.tagName] = field.textContent;
      } else {
        // Nested objects - just stringify or ignore for MVP
        obj[field.tagName] = field.textContent;
      }
    });
    return obj;
  });

  return data;
};

const convert = () => {
  if (!file.value) return;
  isConverting.value = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const xmlStr = e.target?.result as string;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "text/xml");

      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("XML Parse Error");
      }

      const jsonData = xmlToJson(xmlDoc);

      if (jsonData.length === 0) {
        error.value = "Could not find tabular data in XML.";
        isConverting.value = false;
        return;
      }

      csvOutput.value = Papa.unparse(jsonData);
      isConverting.value = false;
    } catch (err) {
      error.value = "Invalid XML file.";
      isConverting.value = false;
    }
  };
  reader.onerror = () => {
    error.value = "Error reading file.";
    isConverting.value = false;
  };
  reader.readAsText(file.value);
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
      {{ $t("tools.xmlToCsv.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-2">
      {{ $t("tools.xmlToCsv.subtitle") }}
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
          {{ $t("tools.xmlToCsv.upload.dropText") }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ $t("tools.xmlToCsv.upload.support") }}
        </p>
        <button
          class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {{ $t("tools.xmlToCsv.upload.browse") }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".xml"
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
              <span class="font-bold text-gray-600">XML</span>
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

          <button
            @click="clear"
            class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove file"
          >
            <Trash2 class="w-5 h-5" />
          </button>
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
      <h2>{{ $t("tools.xmlToCsv.seo.why.title") }}</h2>
      <p>{{ $t("tools.xmlToCsv.seo.why.content") }}</p>

      <h2>{{ $t("tools.xmlToCsv.seo.how.title") }}</h2>
      <ul>
        <li v-for="(step, i) in tm('tools.xmlToCsv.seo.how.steps')" :key="i">
          {{ rt(step) }}
        </li>
      </ul>
    </div>

    <div class="mt-12 border-t border-gray-200 pt-8">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Related Tools</h3>
      <NuxtLink
        :to="localePath('/json-to-csv')"
        class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-2"
      >
        {{ $t("tools.jsonToCsv.title") }}
        <span aria-hidden="true">&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>
