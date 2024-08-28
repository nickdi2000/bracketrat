<template>
  <div class="landingContainer">
    <div class="wrapper"></div>
  </div>
</template>



<style scoped>
.landingContainer {
  width: 110%;
  height: 560px;
  /*darken somehow*/
  filter: brightness(0.3);
}
body {
  margin:0;
}
.wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    background: linear-gradient(45deg,#250f96, #0a1877, #24AADB , #727a92,#23b2ad, #07658a);
    background-size: 600% 100%;
    animation: gradient 12s linear infinite;
    animation-direction: alternate;
}
@keyframes gradient {
    0% {background-position: 0%}
    100% {background-position: 100%}
}
</style>
