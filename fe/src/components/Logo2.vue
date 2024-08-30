<template>
  <img src="/images/bracket-force-logo.png" class="b-logo" />
</template>

<style scoped>
.b-logo {
  width: 4rem;
  height: auto;
  opacity: 0.7;
  transition: all 0.6s ease;
  /* add glow */
  filter: drop-shadow(0 0 0.75rem #fff);
}

.b-logo:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>
