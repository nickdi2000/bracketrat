<template>
  <div>
    <div
      v-if="!editing"
      class="text-2xl font-bold py-4"
      :class="!darkMode ? 'text-black' : 'text-white'"
      @click="editing = true"
    >
      {{ link }}
    </div>

    <div v-else>
      <input
        style="
          width: 80vw;
          max-width: 400px;
          font-size: 2rem;
          font-weight: bold;
        "
        type="text"
        class="w-full p-2"
        :class="!darkMode ? 'bg-gray-100' : 'bg-gray-800 text-white'"
        v-model="newCode"
      />

      <div class="my-3">
        <button
          @click="save()"
          :disabled="!newCode"
          :class="!newCode ? 'bg-gray-400' : 'bg-blue-500'"
          class="p-4 mr-3 text-white p-2 rounded-lg"
        >
          Save
        </button>

        <button
          @click="editing = false"
          class="p-4 bg-gray-800 text-white p-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Link",
  data() {
    return {
      editing: false,
      newCode: this.code,
    };
  },
  computed: {
    link() {
      return this.$baseUrl + "/" + this.code;
    },
  },
  emits: ["update"],
  methods: {
    async save() {
      try {
        await this.$store.patchBracket({ code: this.newCode });
        this.editing = false;
        this.newCode = this.code;
        this.$toast.success("Saved");
        this.$emit("update");
      } catch (e) {
        console.log(e);
        this.$toast.error("Error saving");
      }
    },
  },

  props: {
    code: {
      type: String,
      default: "",
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped></style>
