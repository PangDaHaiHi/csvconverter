<script setup lang="ts">
import { Mail } from "lucide-vue-next";
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
      >
        <div class="flex items-center gap-1">
          &copy; {{ year }} {{ $t("brand.title") }}. {{ $t("footer.rightsReserved") }}
        </div>
        <div class="flex items-center gap-6">
          <a
            href="mailto:hostgu72@gmail.com"
            class="flex items-center gap-2 hover:text-blue-600 transition-colors group"
          >
            <Mail
              class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
            />
            hostgu72@gmail.com
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
