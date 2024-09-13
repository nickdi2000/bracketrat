<template>
  <div class="max-w-3xl mx-auto bg-[#1a202c] text-white rounded-lg relative shadow-lg overflow-hidden">
      <div class="flex justify-end pr-2">
      <button @click="closeStats">x</button>
    </div>
    <div class="overflow-y-auto max-h-[800px]">
      <table class="w-full min-w-[700px] text-center">
        <thead class="sticky top-0 z-10">
          <tr>
            <th class="py-3 px-4 border-b border-gray-600">Rank</th>
            <th class="py-3 px-4 border-b border-gray-600">PlayerId</th>
            <th class="py-3 px-4 border-b border-gray-600">PlayerName</th>
            <th class="py-3 px-4 border-b border-gray-600">Remaining</th>
            <th class="py-3 px-4 border-b border-gray-600">Wins</th>
            <th class="py-3 px-4 border-b border-gray-600">Losses</th>
            <th class="py-3 px-4 border-b border-gray-600">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ply, idx) in playerStats" :key="idx" class="bg-gray-700">
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ idx + 1 }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.playerId }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.playerName }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.remaining }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.wins }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.losses }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ ply.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center my-4 pt-2 border-t-bold"> 
      <button   
        @click="bracketWinner()" :disabled= !isAllGamesCompleted
        :class="!isAllGamesCompleted ? 'btn btn-disabled' : 'btn btn-primary'">
        Resolve Tie
      </button>
        <!-- Popup -->  
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div class="bg-gray-700 py-4 rounded-lg shadow-lg max-w-md w-full relative">
        <button @click="showPopup = false" class="absolute top-2 right-2 text-xl font-bold">&times;</button>
        <h3 class="text-2xl pl-2 font-bold mb-2 border-b">Bracket Winner</h3>
        <div class="flex justify-center items-center">
          <p>{{ winnerName }} is the winner</p>
          <svg class="h-6 w-6 text-yellow-400" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        showPopup: false,
        winnerName: "",
      };
    },
  computed: {
    isAllGamesCompleted() {
      return this.$store.selected_bracket.isTie;
    },
    playerStats() {
      return this.$store.selected_bracket.playerStats;
    },
  },
  methods: {
    closeStats() {
      this.$emit('close');
    },
    async bracketWinner () {
      this.showPopup = true;
      const winner = await this.$store.getBracketWinner();
      this.winnerName = winner.playerName;
    }
  }
};
</script>

<style scoped>

thead.sticky {
  position: sticky;
  top: 0;
  background-color: #1a202c;
  z-index: 10;
}

.overflow-y-auto {
  max-height: 16rem;
}

.table th,
.table td {
  border: 1px solid #333;
  white-space: nowrap;
}

.custom-close-button {
  font-size: 1rem;
  background: none;
  border: none;
  color: white;
  justify-content: end;
}

.custom-close-button:hover {
  cursor: pointer;
}

</style>

