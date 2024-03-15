<template>
  <div class="bracket-container">
    <bracket :rounds="rounds" class="bracket z-40">
      <template #player="{ player }">
        <div class="player-box text-lg">{{ player.name }}</div>
      </template>
      <template #player-extension-bottom="{ match }">
        <div class="text-muted uppercase font-bold text-xs text-gray-500">
          {{ match.title }}
        </div>
      </template>
    </bracket>
  </div>
</template>

<script>
import Bracket from "vue-tournament-bracket";

const rounds = [
  {
    games: [
      {
        player1: { id: "1", name: "John Smith", winner: true },
        player2: { id: "11", name: "Dale Jones", winner: false },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: true },
        player2: { id: "12", name: "Amy Royal", winner: false },
      },
      {
        player1: { id: "1", name: "John Smith", winner: true },
        player2: { id: "13", name: "Stephen Jones", winner: false },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: true },
        player2: { id: "14", name: "Garriete Royal", winner: false },
      },
    ],
  },
  //Semi finals
  {
    games: [
      {
        player1: { id: "1", name: "John Smith", winner: false },
        player2: { id: "4", name: "Gary Jones", winner: true },
      },
      {
        player1: { id: "5", name: "Jane Garamond", winner: false },
        player2: { id: "8", name: "Danny Royal", winner: true },
      },
    ],
  },
  //Final
  {
    games: [
      {
        player1: { id: "4", name: "Gary Jones", winner: false },
        player2: { id: "8", name: "Danny Royal", winner: true },
      },
    ],
  },
];

export default {
  components: {
    Bracket,
  },
  data() {
    return {
      rounds2: rounds,
      rounds: rounds,
    };
  },
};
</script>

<style lang="scss">
.bracket-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.vtb-wrapper {
  background: inherit;
  padding: 0px;
}

.player-box {
  padding: 10px;
  font-weight: bolder;
  text-transform: uppercase;
}

.vtb-item {
  display: flex;
  flex-direction: row-reverse;
  margin: 0;
  padding: 0;
  margin: 0;
  background: inherit;
}

p {
  margin: 0;
  border-radius: 10%;
  padding: 20px;
}

.vtb-item-parent {
  position: relative;
  margin-left: 50px;
  display: flex;
  align-items: center;
}

.vtb-item-players {
  flex-direction: column;
  margin: 6px;
  color: white;
  padding: 4px;
  background-color: transparent !important;
}

.vtb-item-players {
  padding: 2px;
}

.vtb-player {
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.vtb-player:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
}

.vtb-item-players .winner {
  background-color: rgb(85, 95, 54);
}

.winner {
  background-color: rgb(90, 116, 75) !important;
}

.vtb-item-players .defeated {
  background-color: rgb(99, 59, 59) !important;
}

.vtb-item-players .winner.highlight {
  background-color: darkseagreen;
}

.vtb-item-players .defeated.highlight {
  background-color: rgb(119, 71, 71);
}

.vtb-item-parent:after {
  position: absolute;
  content: "";
  width: 25px;
  height: 2px;
  left: 0;
  top: 50%;

  transform: translateX(-100%);
}

.vtb-item-children {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vtb-item-child {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.vtb-item-child:before {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%);
  width: 25px;
  height: 2px;
}

.vtb-item-child:after {
  content: "";
  position: absolute;
  right: -25px;
  height: calc(50% + 22px);
  width: 2px;
  top: 50%;
}

.vtb-item-child:last-child:after {
  transform: translateY(-100%);
}

.vtb-item-child:only-child:after {
  display: none;
}

/* smaller screens @ media */

@media only screen and (max-width: 800px) {
  .bracket-container {
    position: fixed;
    width: 100vw;
    height: 100dvh;
    top: 90px;
    left: 0;
    padding-top: 90px;
    padding-left: 20px;
    padding-right: 0px;
    padding-bottom: 0px;
    overflow: scroll;
    justify-content: start;
  }

  .bracket {
    padding-bottom: 100px;
    padding-top: 100px;
    min-height: 100vh;
    z-index: 0;
  }

  .vtp-wrapper {
    padding-bottom: 0px;
  }

  .vtb-item-players:last-of-type {
    padding-right: 10px;
  }
}
</style>
