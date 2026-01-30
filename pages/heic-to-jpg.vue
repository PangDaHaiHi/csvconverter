<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const url = useRequestURL();
const canonicalUrl = computed(() => `${url.origin}${url.pathname}`);
const metaTitle = computed(() => t("tools.heicToJpg.metaTitle"));
const metaDescription = computed(() => t("tools.heicToJpg.metaDescription"));
const appName = computed(() => t("tools.heicToJpg.h1"));

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  ogTitle: metaTitle,
  ogDescription: metaDescription,
  ogType: "website",
  ogUrl: canonicalUrl,
  twitterCard: "summary",
  twitterTitle: metaTitle,
  twitterDescription: metaDescription,
});

useHead({
  link: [
    {
      rel: "canonical",
      href: canonicalUrl,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: appName.value,
          url: canonicalUrl.value,
          description: metaDescription.value,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      ),
    },
  ],
});

interface ProcessedFile {
  id: string;
  file: File;
  originalName: string;
  status: "pending" | "converting" | "success" | "error";
  url: string | null;
  error: string | null;
}

const MAX_FILES = 5;

const isDragging = ref(false);
const files = ref<ProcessedFile[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const isConverting = computed(() =>
  files.value.some((f) => f.status === "converting"),
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const droppedFiles = e.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    handleFiles(Array.from(droppedFiles));
  }
};

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleFiles(Array.from(input.files));
    // Reset input value to allow selecting the same file again
    input.value = "";
  }
};

const handleFiles = (newFiles: File[]) => {
  if (files.value.length + newFiles.length > MAX_FILES) {
    alert(t("tools.common.errors.fileLimitExceeded", { max: MAX_FILES }));
    return;
  }

  newFiles.forEach((file) => {
    const processedFile: ProcessedFile = {
      id: Math.random().toString(36).substring(7),
      file,
      originalName: file.name.replace(/\.[^/.]+$/, ""),
      status: "pending",
      url: null,
      error: null,
    };

    files.value.push(processedFile);
    // Get the reactive item from the array
    const reactiveItem = files.value[files.value.length - 1];
    processFile(reactiveItem as ProcessedFile);
  });
};

const processFile = async (item: ProcessedFile) => {
  if (
    !item.file.name.toLowerCase().endsWith(".heic") &&
    !item.file.name.toLowerCase().endsWith(".heif")
  ) {
    item.status = "error";
    item.error = t("tools.heicToJpg.errors.invalidFormat");
    return;
  }

  item.status = "converting";

  try {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({
      blob: item.file,
      toType: "image/jpeg",
    });

    const blob = Array.isArray(result) ? result[0] : result;
    item.url = URL.createObjectURL(blob as Blob);
    item.status = "success";
  } catch (e) {
    console.error(e);
    item.status = "error";
    item.error = t("tools.heicToJpg.errors.conversionFailed");
  }
};

const downloadImage = (item: ProcessedFile) => {
  if (!item.url) return;
  const link = document.createElement("a");
  link.href = item.url;
  link.download = `${item.originalName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadAll = async () => {
  const successfulFiles = files.value.filter(
    (f) => f.status === "success" && f.url,
  );
  if (successfulFiles.length === 0) return;

  try {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    await Promise.all(
      successfulFiles.map(async (file) => {
        if (!file.url) return;
        const response = await fetch(file.url);
        const blob = await response.blob();
        zip.file(`${file.originalName}.jpg`, blob);
      }),
    );

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "heic-converted-images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error("Failed to generate zip:", e);
  }
};

const removeFile = (id: string) => {
  const file = files.value.find((f) => f.id === id);
  if (file?.url) {
    URL.revokeObjectURL(file.url);
  }
  files.value = files.value.filter((f) => f.id !== id);
};

const clearAll = () => {
  files.value.forEach((f) => {
    if (f.url) URL.revokeObjectURL(f.url);
  });
  files.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-screen-xl">
    <div class="text-center mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {{ $t("tools.heicToJpg.h1") }}
      </h1>
      <p
        class="text-lg text-gray-600 max-w-4xl mx-auto md:max-w-none md:whitespace-nowrap"
      >
        {{ $t("tools.heicToJpg.subtitle") }}
      </p>
      <div class="mt-4 text-sm text-gray-600">
        {{ $t("tools.common.whatIsHeicLink.text") }}
        <NuxtLink
          :to="localePath('/what-is-an-heic-file')"
          class="text-green-600 hover:text-green-700 font-medium hover:underline"
        >
          {{ $t("tools.common.whatIsHeicLink.linkText") }}
        </NuxtLink>
      </div>
    </div>

    <!-- Hidden File Input (Always Available) -->
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept=".heic,.heif"
      multiple
      @change="handleFileSelect"
    />

    <!-- File List Area -->
    <div v-if="files.length > 0" class="w-full max-w-4xl mx-auto mb-16">
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
        <button
          @click="triggerFileInput"
          :disabled="files.length >= MAX_FILES"
          :class="[
            'px-6 py-2 font-medium rounded-lg transition-colors shadow-sm',
            files.length >= MAX_FILES
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700',
          ]"
        >
          {{
            files.length >= MAX_FILES
              ? $t("tools.common.actions.limitReached")
              : $t("tools.common.actions.addMore")
          }}
        </button>
        <div class="flex gap-4">
          <button
            v-if="files.some((f) => f.status === 'success')"
            @click="downloadAll"
            class="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            {{ $t("tools.common.actions.downloadAll") }}
          </button>
          <button
            @click="clearAll"
            class="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ $t("tools.common.actions.clearAll") }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div class="flex items-center gap-4 overflow-hidden">
            <div
              class="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200"
            >
              <img
                v-if="file.url"
                :src="file.url"
                class="w-full h-full object-cover"
              />
              <div
                v-else-if="file.status === 'converting'"
                class="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"
              ></div>
              <svg
                v-else-if="file.status === 'error'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-red-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>

            <div class="min-w-0">
              <p
                class="font-medium text-gray-900 truncate max-w-xs sm:max-w-sm md:max-w-md"
                :title="file.originalName"
              >
                {{ file.originalName }}
              </p>
              <p class="text-sm">
                <span
                  v-if="file.status === 'converting'"
                  class="text-green-600"
                  >{{ $t("tools.common.status.converting") }}</span
                >
                <span
                  v-else-if="file.status === 'success'"
                  class="text-green-600"
                  >{{ $t("tools.common.status.ready") }}</span
                >
                <span
                  v-else-if="file.status === 'error'"
                  class="text-red-500"
                  >{{ file.error || $t("tools.common.status.failed") }}</span
                >
                <span v-else class="text-gray-500">{{
                  $t("tools.common.status.waiting")
                }}</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              v-if="file.status === 'success'"
              @click="downloadImage(file)"
              class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              :title="$t('tools.common.actions.download')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </button>
            <button
              @click="removeFile(file.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              :title="$t('tools.common.actions.remove')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      v-else
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      :class="[
        'bg-gray-50 border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center mb-16 transition-all cursor-pointer group min-h-[300px]',
        isDragging
          ? 'border-green-500 bg-green-50 scale-[1.02]'
          : 'border-gray-300 hover:bg-gray-100 hover:border-green-400',
      ]"
    >
      <div
        class="mb-6 p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 text-green-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ $t("tools.heicToJpg.upload.dropText") }}
      </h3>
      <p class="text-gray-500 mb-6">
        {{ $t("tools.heicToJpg.upload.support") }}
      </p>
      <button
        class="px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {{ $t("tools.heicToJpg.upload.browse") }}
      </button>
    </div>

    <div class="prose prose-lg max-w-none text-gray-600">
      <div class="grid md:grid-cols-2 gap-12 mb-12">
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t("tools.heicToJpg.seo.section1.title") }}
          </h2>
          <p>{{ $t("tools.heicToJpg.seo.section1.content") }}</p>
        </section>
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t("tools.heicToJpg.seo.section2.title") }}
          </h2>
          <p>{{ $t("tools.heicToJpg.seo.section2.content") }}</p>
        </section>
      </div>

      <section class="bg-green-50 rounded-2xl p-8 mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ $t("tools.heicToJpg.seo.section3.title") }}
        </h2>
        <ul class="space-y-4">
          <li class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full font-bold mr-4"
              >1</span
            >
            <span class="pt-1">{{
              $t("tools.heicToJpg.seo.section3.steps.0")
            }}</span>
          </li>
          <li class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full font-bold mr-4"
              >2</span
            >
            <span class="pt-1">{{
              $t("tools.heicToJpg.seo.section3.steps.1")
            }}</span>
          </li>
          <li class="flex items-start">
            <span
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full font-bold mr-4"
              >3</span
            >
            <span class="pt-1">{{
              $t("tools.heicToJpg.seo.section3.steps.2")
            }}</span>
          </li>
        </ul>

        <div class="mt-6 pt-6 border-t border-green-100">
          <p class="flex items-center gap-2 text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 text-green-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            {{ $t("tools.heicToJpg.seo.guideLink.text") }}
            <NuxtLink
              :to="localePath('/how-to-convert-heic-to-jpg')"
              class="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              {{ $t("tools.heicToJpg.seo.guideLink.linkText") }}
            </NuxtLink>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
