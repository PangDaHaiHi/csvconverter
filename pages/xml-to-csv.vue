<script setup lang="ts">
import { ref } from "vue";
import Papa from "papaparse";
import { XMLParser } from "fast-xml-parser";
import { Upload, Download, Copy, Trash2, Check } from "lucide-vue-next";

const { t, tm, rt } = useI18n();
const localePath = useLocalePath();
const fileInput = ref<HTMLInputElement | null>(null);

const file = ref<File | null>(null);
const csvOutput = ref<string>("");
const error = ref<string>("");
const isConverting = ref(false);
const isCopied = ref(false);

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

const seoExampleXml = `<users>
  <user>
    <name>John Doe</name>
    <email>john@example.com</email>
    <phone>555-555-5555</phone>
  </user>
</users>`;

const seoExampleCsv = `name,email,phone
John Doe,john@example.com,555-555-5555`;

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

const flattenObject = (obj: any, prefix = "", result: any = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        flattenObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
};

const convert = () => {
  if (!file.value) return;
  isConverting.value = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const xmlStr = e.target?.result as string;
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@",
        textNodeName: "text",
      });
      const jsonObj = parser.parse(xmlStr);

      if (!jsonObj) {
        throw new Error("Invalid XML");
      }

      // Try to find the array in the parsed object
      // Heuristic: find the first array or the first object with children that looks like a list
      let dataToConvert: any[] = [];

      // Helper to recursively find an array
      const findArray = (obj: any): any[] | null => {
        if (Array.isArray(obj)) return obj;
        if (typeof obj === "object" && obj !== null) {
          const keys = Object.keys(obj);
          for (const key of keys) {
            const val = obj[key];
            if (Array.isArray(val)) return val;
            // Also handle case where XML parser returns single object for single child
            // but we want to treat it as a row.
            // But usually we look for the list.
          }
          // If no array found in direct children, try deeper?
          // For simplicity, let's assume the root or one of its children contains the list.
          // Common XML: <root><item>...</item><item>...</item></root>
          // fast-xml-parser: { root: { item: [ ... ] } }

          if (keys.length === 1) {
            return findArray(obj[keys[0] || ""]);
          }
        }
        return null;
      };

      const foundArray = findArray(jsonObj);

      if (foundArray) {
        dataToConvert = foundArray;
      } else {
        // If no array, maybe it's a single object (e.g. one row)
        // Or maybe <root><row>...</row></root> became { root: { row: { ... } } }
        // Let's try to wrap the leaf object
        // For now, let's just wrap the whole thing if it's small, or fail gracefully
        dataToConvert = [jsonObj];
      }

      // Flatten objects
      dataToConvert = dataToConvert.map((item: any) => flattenObject(item));

      csvOutput.value = Papa.unparse(dataToConvert);
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
      {{ $t("tools.xmlToCsv.h1") }}
    </h1>
    <p class="text-center text-gray-600 mb-8">
      {{ $t("tools.xmlToCsv.subtitle") }}
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
        accept=".xml,text/xml,application/xml"
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
            {{ $t("tools.xmlToCsv.upload.dropText") }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ $t("tools.xmlToCsv.upload.browse") }}
          </p>
        </div>
        <p class="text-xs text-gray-400">
          {{ $t("tools.xmlToCsv.upload.support") }}
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
          {{ $t("tools.xmlToCsv.seo.how.title") }}
        </h2>
        <ol class="space-y-4 list-decimal pl-5">
          <li
            v-for="(step, i) in tm('tools.xmlToCsv.seo.how.steps')"
            :key="i"
            class="pl-2"
          >
            <span v-html="rt(step)"></span>
          </li>
        </ol>
      </section>

      <!-- Guide Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ $t("tools.xmlToCsv.seo.guide.title") }}
        </h2>
        <p class="mb-4">{{ $t("tools.xmlToCsv.seo.guide.content") }}</p>
        <p class="mb-4">
          {{ $t("tools.xmlToCsv.seo.guide.linkText") }}
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
          {{ $t("tools.xmlToCsv.seo.example.title") }}
        </h2>
        <div>
          <p class="mb-4">{{ $t("tools.xmlToCsv.seo.example.intro") }}</p>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-2">
                {{ $t("tools.xmlToCsv.seo.example.xmlLabel") }}
              </h3>
              <pre
                class="bg-gray-800 text-gray-100 p-4 rounded text-sm overflow-x-auto"
                >{{ seoExampleXml }}</pre
              >
            </div>
            <div>
              <h3 class="font-semibold mb-2">
                {{ $t("tools.xmlToCsv.seo.example.csvLabel") }}
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
          {{ $t("tools.xmlToCsv.seo.moreTools.title") }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NuxtLink
            :to="localePath('/json-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">JSON to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.jsonToCsv.desc") }}
            </p>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/excel-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">Excel to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.excelToCsv.desc") }}
            </p>
          </NuxtLink>
          <NuxtLink
            :to="localePath('/txt-to-csv')"
            class="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 class="font-bold text-lg text-blue-600 mb-2">TXT to CSV</h3>
            <p class="text-sm text-gray-600">
              {{ $t("home.tools.txtToCsv.desc") }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
