<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const { t } = useI18n();

useSeoMeta(() => ({
  title: `${props.error?.statusCode || 404} - ${t("error.pageNotFound")}`,
  robots: "noindex",
}));

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">{{ error?.statusCode }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ $t('error.pageNotFound') }}</p>
      <button
        @click="handleError"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ $t('error.goHome') }}
      </button>
    </div>
  </NuxtLayout>
</template>
