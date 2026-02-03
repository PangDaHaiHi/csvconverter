<script setup lang="ts">
const event = useRequestEvent();

if (event) {
  setResponseStatus(event, 404);
}

throw createError({
  statusCode: 404,
  statusMessage: "Page Not Found",
  fatal: true,
});
</script>

<template>
  <div></div>
</template>
