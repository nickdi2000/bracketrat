<template>
  <div class="flex flex-col items-center">
    <div class="w-full p-4 backdrop-brightness-90 shadow-2xl rounded-md mb-4">
      <h3 class="text-lg text-white font-bold mb-4">
        {{ formData._id ? "Update" : "Create New" }} {{ model.name }}
      </h3>
      <slot></slot>
    </div>
    <div class="flex justify-center gap-4">
      <FButton color="green" @click="save()">Save</FButton>
      <FButton color="dark" class="ml-4" @click="back()">Cancel</FButton>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  methods: {
    back() {
      if (this.showBack) {
        this.$router.go(-1);
        return;
      }
      this.$router.push("/" + this.model.path);
    },
    async save() {
      const rec = await this.$api.post(this.model.path, this.formData);
      this.back();
    },
  },
};
</script>

<style scoped></style>
