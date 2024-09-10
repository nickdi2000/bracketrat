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
            <th class="py-3 px-4 border-b border-gray-600">Participant</th>
            <th class="py-3 px-4 border-b border-gray-600">Played</th>
            <th class="py-3 px-4 border-b border-gray-600">Remaining</th>
            <th class="py-3 px-4 border-b border-gray-600">Wins</th>
            <th class="py-3 px-4 border-b border-gray-600">Losses</th>
            <th class="py-3 px-4 border-b border-gray-600">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(participant, index) in participants" :key="index" class="bg-gray-700">
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.rank }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.name }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.played }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.remaining }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.setWins }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.setTies }}</td>
            <td class="py-3 px-4 border-b border-r border-gray-600">{{ participant.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center my-4 pt-2 border-t-bold">
      <button @click="showPopup=true" class="btn btn-primary">
        Resolve Tie
      </button>
        <!-- Popup -->  
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div class="bg-gray-700 py-4 rounded-lg shadow-lg max-w-md w-full relative">
        <button @click="showPopup = false" class="absolute top-2 right-2 text-xl font-bold">&times;</button>
        <h3 class="text-2xl pl-2 font-bold mb-2 border-b">Bracket Winner</h3>
        <div class="flex justify-center items-center">
          <p>V1 is the winner</p>
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
        participants: [
          { rank: 1, name: 'new', played: 0, remaining: 2,  setWins: 0, setTies: 0, points: 0 },
          { rank: 2, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 3, name: 'new3', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 4, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 5, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 6, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 7, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 8, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 9, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 10, name: 'new4', played: 0, remaining: 2,setWins: 0, setTies: 0, points: 0 },
          { rank: 11, name: 'new4', played: 0, remaining: 2,setWins: 0, setTies: 0, points: 0 },
          { rank: 12, name: 'new4', played: 0, remaining: 2,setWins: 0, setTies: 0, points: 0 },
          { rank: 13, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 14, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 15, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 16, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
          { rank: 17, name: 'new4', played: 0, remaining: 2, setWins: 0, setTies: 0, points: 0 },
        ],
        showPopup: false,
      };
    },
    methods: {
    closeStats() {
      this.$emit('close');
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

