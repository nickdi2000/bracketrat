<template>
  <div class="bracket">
    <LineBracketNode :depth="0" :maxDepth="4" />
  </div>
</template>

<script>
export default {
  name: "TournamentBracket",
  components: {
    LineBracketNode: {
      name: "LineBracketNode",
      props: ["depth", "maxDepth"],
      template: `
          <div v-if="depth <= maxDepth" class="node" :style="nodeStyle">
            <div class="line horizontal"></div>
            <div v-if="depth < maxDepth" class="branches">
              <div class="branch">
                <div class="line vertical up"></div>
                <LineBracketNode :depth="depth + 1" :maxDepth="maxDepth" />
              </div>
              <div class="branch">
                <div class="line vertical down"></div>
                <LineBracketNode :depth="depth + 1" :maxDepth="maxDepth" />
              </div>
            </div>
          </div>
        `,
      computed: {
        nodeStyle() {
          return {
            "--depth": this.depth,
          };
        },
      },
    },
  },
};
</script>

<style scoped>
.bracket {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.node {
  --line-length: 100px;
  --vertical-spacing: 20px;
}

.line.horizontal {
  width: var(--line-length);
  height: 2px;
  background-color: #fff;
  animation: growRight 2s forwards;
}

.line.vertical {
  width: 2px;
  height: var(--vertical-spacing);
  background-color: #fff;
}

.line.vertical.up {
  animation: growUp 2s forwards;
}

.line.vertical.down {
  animation: growDown 2s forwards;
}

.branches {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(2 * var(--vertical-spacing));
}

.branch {
  display: flex;
  align-items: center;
}

@keyframes growRight {
  from {
    width: 0;
  }
  to {
    width: var(--line-length);
  }
}

@keyframes growUp {
  0% {
    height: 0;
  }
  100% {
    height: var(--vertical-spacing);
    transform: translateY(-var(--vertical-spacing));
  }
}

@keyframes growDown {
  0% {
    height: 0;
  }
  100% {
    height: var(--vertical-spacing);
  }
}
</style>
