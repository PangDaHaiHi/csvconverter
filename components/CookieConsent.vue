<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Cookie, X } from "lucide-vue-next";

const { t } = useI18n();
const localePath = useLocalePath();
const isVisible = ref(false);
const { enable } = useGoogleAnalytics();

const CONSENT_KEY = "csvconverter_cookie_consent";

onMounted(() => {
  const consent = localStorage.getItem(CONSENT_KEY);
  if (!consent) {
    // Show banner after a short delay
    setTimeout(() => {
      isVisible.value = true;
    }, 1000);
  } else if (consent === "accepted") {
    // If already accepted, enable GA immediately
    enable();
  }
});

const accept = () => {
  localStorage.setItem(CONSENT_KEY, "accepted");
  isVisible.value = false;
  enable();
};

const decline = () => {
  localStorage.setItem(CONSENT_KEY, "declined");
  isVisible.value = false;
};
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 sm:max-w-xl sm:left-auto sm:right-0 sm:bottom-0"
    >
      <div
        class="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col gap-4 relative overflow-hidden"
      >
        <!-- Decoration -->
        <div
          class="absolute -top-10 -right-10 bg-blue-50 w-32 h-32 rounded-full blur-2xl opacity-50 pointer-events-none"
        ></div>

        <div class="flex items-start gap-4 relative z-10">
          <div class="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
            <Cookie class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ $t("cookie.title") }}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ $t("cookie.description") }}
              <NuxtLink
                :to="localePath('/privacy-policy')"
                class="text-blue-600 hover:underline font-medium"
              >
                {{ $t("cookie.policyLink") }} </NuxtLink
              >.
            </p>
          </div>
        </div>

        <div class="flex gap-3 justify-end relative z-10 mt-2">
          <button
            @click="decline"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {{ $t("cookie.decline") }}
          </button>
          <button
            @click="accept"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
          >
            {{ $t("cookie.accept") }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
