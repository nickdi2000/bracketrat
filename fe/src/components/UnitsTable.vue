<template>
  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Strength</th>
          <th scope="col" class="px-6 py-3">Score</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in records"
          :key="record.name + '-name'"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ record.name }}
          </th>
          <td class="px-6 py-4">
            <span
              @click="showTip(record)"
              :class="'badge badge-' + record.status"
              class_="bg-gray-400 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded uppercase"
            >
              {{ record.status }}</span
            >
          </td>
          <td class="px-6 py-4">-</td>
          <td class="px-6 py-4">-</td>
          <td class="px-6 py-4">
            <button
              type="button"
              @click="destroy(record)"
              class="text-red-400 rounded-md bg-gray-900 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium text-sm px-2 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:border-gray-700 me-2"
            >
              <TrashIcon class="w-6 h-6" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="py-3 flex flex-col items-center">
      <button
        @click="removeAll()"
        class="text-gray-200 rounded-md bg-gray-900 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium text-xs px-2 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:border-gray-700 me-2"
      >
        <TrashIcon class="w-4 h-4" /> Remove All
      </button>
    </div>
  </div>
</template>

<script>
import bottomAlert from "@/services/bottom.alert.service";

export default {
  components: {},
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async destroy(record) {
      const ask = await this.$openDialog("Delete Player?");

      try {
        const bracketId = this.$store.getBracket._id;
        const rec = await this.$api.delete(
          `players?bracketId=${bracketId}&playerId=${record._id}`,
          {}
        );
        this.$store.setPlayers(rec.data.bracket.players);
        console.log("Destroyed", rec.data.bracket.players);
      } catch (error) {
        console.error("Error", error);
        this.$toast.error("Error deleting record");
      }
    },
    showTip(record) {
      let tip = "";
      if (record.status == "limbo") {
        tip =
          "This player is in limbo. Because they are not active in any brackets. Don't worry.. nothing wrong with limbo.";
      } else if (record.status == "In-Bracket") {
        tip =
          "This player is active in this bracket. They are ready to play their next game! (Or maybe they are PLAYing their game. I wouldn't know.)";
      } else if (record.status == "eliminated") {
        tip =
          "This player has been eliminated from this bracket. They will not be able to play any more games in this bracket.";
      }
      this.$bottomAlert(tip);
    },
    async removeAll() {
      const ask = await this.$openDialog(
        "Remove All Players from this bracket?",
        "Note: Users associated with this bracket will not be deleted. They will be available for other brackets, and still be active in the system."
      );

      if (!ask) return;
      try {
        const bracketId = this.$store.getBracket._id;
        const rec = await this.$api.post(
          `brackets/${bracketId}/delete-all-players`,
          {}
        );
        this.$store.setPlayers(rec.data.bracket.players);
        console.log("Destroyed", rec.data.bracket.players);
        this.$toast.success("All players removed from this bracket");
      } catch (error) {
        console.error("Error", error);
        this.$toast.error("Error deleting record");
      }
    },
  },
};
</script>
