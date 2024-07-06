<template>
  <div class="landingContainer">
    <div class="container">
      <ul id="scene" class="scene">
        <li class="layer layer1" data-depth="0.40"></li>
        <li class="layer layer2" data-depth="0.60"></li>
        <li class="layer layer3" data-depth="0.80"></li>
        <li class="layer layer4" data-depth="1.00"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },

  mounted() {
    //import script from https://www.ericjacksonwood.ca/SHARE/_codepen/parallax-halftone/parallax.js
    const script = document.createElement("script");
    script.src = "/par.js";
    script.async = true;
    script.onload = () => {
      this.isScriptLoaded = true;
    };
    document.body.appendChild(script);
  },
};
</script>

<style scoped>
.landingContainer {
  width: 110%;
  height: 600px;
  /*darken somehow*/
  filter: brightness(0.3);
}

.container {
  width: 100vw;
  position: absolute;
  margin: auto;
  overflow: hidden;
  transform: scale(1.3, 1.3);
}

.scene {
  background: black;
  transform: scale(1.25, 1.25) !important;
}

.layer {
  width: 120vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

.layer1 {
  background-image: url("/images/stadium.png");
}

.layer2 {
  background-image: url("/images/footballer1.png");
  /*transform to be greenish hue */
  transform: hue-rotate(290deg);
  mix-blend-mode: screen;
}

.layer3 {
  background-image: url("/images/footballer2.png");
  mix-blend-mode: screen;
}

/* .layer4 {
  background-image: url("https://www.freepnglogos.com/uploads/football-player-png/american-football-player-png-image-purepng-8.png");
  transform: hue-rotate(70deg);
  opacity: 0.25;
} */
</style>
