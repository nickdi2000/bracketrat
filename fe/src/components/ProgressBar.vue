<template>
  <div class="flex justify-center py-3">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 220px;
  height: 22px;
  border-radius: 20px;
  color: #21588f;
  border: 2px solid;
  position: relative;
}
.loader::before {
  content: "";
  position: absolute;
  margin: 2px;
  inset: 0 100% 0 0;
  border-radius: inherit;
  background: currentColor;
  animation: l6 2s infinite;
}
@keyframes l6 {
  100% {
    inset: 0;
  }
}
</style>
