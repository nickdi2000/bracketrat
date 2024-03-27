<template>
  <div class="animation-container">
    <!-- Base square for initial horizontal line -->
    <div class="square base" :style="baseStyle"></div>

    <!-- First split squares -->
    <div class="square vertical-split" :style="firstSplitUpStyle"></div>
    <div class="square vertical-split" :style="firstSplitDownStyle"></div>

    <!-- Second split squares -->
    <div class="square vertical-split" :style="secondSplitUpTopStyle"></div>
    <div class="square vertical-split" :style="secondSplitUpBottomStyle"></div>
    <div class="square vertical-split" :style="secondSplitDownTopStyle"></div>
    <div
      class="square vertical-split"
      :style="secondSplitDownBottomStyle"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BracketAnimation",
  data() {
    return {
      // Animation timings
      animationDuration: 1, // in seconds
    };
  },
  computed: {
    baseStyle() {
      return {
        animation: `growHorizontal ${this.animationDuration}s ease forwards`,
      };
    },
    firstSplitUpStyle() {
      return {
        animation: `growVertical ${this.animationDuration}s ease forwards ${this.animationDuration}s`,
        top: "calc(50% - 25px)", // Adjust for half the height of the vertical split
        left: "50px",
      };
    },
    firstSplitDownStyle() {
      return {
        animation: `growVertical ${this.animationDuration}s ease forwards ${this.animationDuration}s`,
        top: "calc(50% + 25px)",
        left: "50px",
      };
    },
    secondSplitUpTopStyle() {
      return {
        animation: `growVerticalSmall ${
          this.animationDuration / 2
        }s ease forwards ${this.animationDuration * 2}s`,
        top: "calc(50% - 50px)", // Adjust according to the vertical split's new position
        left: "100px",
      };
    },
    secondSplitUpBottomStyle() {
      return {
        animation: `growVerticalSmall ${
          this.animationDuration / 2
        }s ease forwards ${this.animationDuration * 2}s`,
        top: "calc(50% - 25px)",
        left: "100px",
      };
    },
    secondSplitDownTopStyle() {
      return {
        animation: `growVerticalSmall ${
          this.animationDuration / 2
        }s ease forwards ${this.animationDuration * 2}s`,
        top: "50%", // Center point for the split
        left: "100px",
      };
    },
    secondSplitDownBottomStyle() {
      return {
        animation: `growVerticalSmall ${
          this.animationDuration / 2
        }s ease forwards ${this.animationDuration * 2}s`,
        top: "calc(50% + 25px)",
        left: "100px",
      };
    },
  },
};
</script>

<style>
.animation-container {
  position: relative;
  width: 200px;
  height: 100px;
  background-color: #000;
  margin: 20px auto;
}

.square {
  position: absolute;
  width: 0;
  height: 2px; /* Represents the line thickness */
  background-color: transparent;
  border-top: 2px solid #fff; /* Only top border colored to simulate the line */
}

.vertical-split {
  width: 2px; /* For vertical splits, width represents the line thickness */
  height: 0;
  background-color: transparent;
  border-left: 2px solid #fff; /* Only left border colored to simulate the line */
}

@keyframes growHorizontal {
  to {
    width: 50px; /* Adjust based on desired length */
  }
}

@keyframes growVertical {
  to {
    height: 25px; /* Height for the first vertical split */
  }
}

@keyframes growVerticalSmall {
  to {
    height: 12.5px; /* Height for the second level vertical splits */
  }
}
</style>
