<template>
  <div class="relative overflow-x-auto">
    <div class="flex justify-end mb-2 fadein" v-if="pendingSave">
      <div>
        <div class="text-orange-400 font-bold italic animate-pulse">
          Save changes when finished.
        </div>
        <div class="flex justify-end">
          <button class="btn btn-success btn-sm" @click="saveChanges()">
            Save Changes
          </button>
          <button class="btn btn-secondary btn-sm mx-2" @click="cancel()">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Score</th>
          <th scope="col" class="px-6 py-3">Strength</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <draggable
        v-model="rows"
        :list="rows"
        tag="tbody"
        class="w-full"
        @start="drag = true"
        @end="handleEnd"
        item-key="name"
        :disabled="!canDrag"
      >
        <template #item="{ element }">
          <tr
            :key="element.name + '-name'"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 w-full"
          >
            <th
              scope="row"
              class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <router-link
                class="player-btn text-sm"
                :to="'/admin/player/' + element._id"
              >
                {{ element.name }}</router-link
              >
            </th>
            <td class="px-6 py-4 status-td">
              <span
                @click="showTip(element)"
                :class="'badge badge-' + element.status"
                class="text-xs"
              >
                {{ element.status }}</span
              >
            </td>
            <td class="px-6 py-4">-</td>
            <td class="px-6 py-4">
              <span
                v-if="element.strength"
                :class="
                  pendingSave
                    ? 'animate-pulse font-bold italic text-lg text-orange-400'
                    : ''
                "
                >{{ element.strength }}</span
              >
              <span
                v-else
                class="text-lg font-bold hover:text-blue-800 cursor-pointer"
                @click="
                  $bottomAlert(
                    `All ${$teamPlayer}'s are weighted the same. Drag to manually re-order the ${$teamPlayer}'s strength`
                  )
                "
                >∞</span
              >
            </td>
            <td class="px-6 py-4">
              <button
                type="button"
                @click="destroy(element)"
                class="text-red-400 rounded-md bg-gray-900 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium text-sm px-2 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:border-gray-700 me-2"
              >
                <TrashIcon class="w-6 h-6" />
              </button>
            </td></tr
        ></template>
      </draggable>
    </table>
    <div class="table-footer">
      <div v-if="records.length > 4" class="subheader py-2 flex justify-start">
        Total: {{ records.length }}
      </div>
    </div>
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
import draggable from "vuedraggable";

export default {
  components: { draggable },
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      drag: false,
      pendingSave: false,
      rows: this.records,
      canDrag: true,
    };
  },
  emits: ["updated"],
  created() {
    //if mobile device, set canDrag to false
    if (window.innerWidth < 768) {
      this.canDrag = false;
    }
  },
  methods: {
    async saveChanges() {
      console.log("Save changes");
      const players = this.rows.map((v) => {
        return { _id: v._id, strength: v.strength };
      });
      await this.$store.batchUpdatePlayers(players);
      this.pendingSave = false;
    },
    cancel() {
      this.pendingSave = false;
      //this.rows = this.records;
    },
    async handleEnd() {
      if (this.drag) {
        this.drag = false;
        //assign stengths based on reverse order(index) (last player is strongest)
        this.rows.forEach((player, index) => {
          player.strength = this.rows.length - index;
        });
        this.pendingSave = true;
        return;
      }
    },
    async destroy(record) {
      const ask = await this.$openDialog("Delete Player?");

      try {
        const bracketId = this.$store.getBracket._id;
        const rec = await this.$api.delete(
          `players?bracketId=${bracketId}&playerId=${record._id}`,
          {}
        );
        //this.$store.setPlayers(rec.data.bracket.players);
        //this.$emit("updated");
        if (rec.data.bracket.players) {
          console.log("setting players");
          const newPlayers = JSON.parse(
            JSON.stringify(rec.data.bracket.players)
          );
          await this.$store.setPlayers(newPlayers);
          this.$emit("updated");
        }
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

<style scoped>
.player-btn {
  text-decoration: none;
  @apply bg-gray-800 uppercase p-2 text-lg w-full rounded-md text-white hover:bg-gray-600;
}

.status-td {
  min-width: 190px;
}
</style>
