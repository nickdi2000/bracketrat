<template>
  <div class="py-4">
    <div>
      <Input label="Name" v-model="org.name" placeholder="My Organization" />
    </div>

    <div class="py-3 mt-5">
      <Textarea
        class="w-full p-2 rounded-md bg-slate-800 text-white"
        v-model="org.description"
        placeholder="Welcome to Jim Bob's Sports Club, please join our..."
        label="Description"
      ></Textarea>
    </div>
    <div class="mt-6">
      <Input
        label="Organization Player Link"
        v-model="org.code"
        placeholder="MYORG"
      />
      <div class="text-sm text-gray-300 mt-5">
        {{ $teamPlayer }}'s' access your organization here.
        <QuestionMarkCircleIcon
          class="w-4 h-4 inline"
          @click="
            $bottomAlert(
              `While each bracket has its own link/QRCode, you may also wish to share this organization link to your ${$teamPlayer}'s. This link will allow them to see all brackets associated with your organization and select which one to join.`
            )
          "
        />
      </div>
      <div class="text-white">{{ $baseUrl }}/{{ org.code }}</div>
    </div>
    <div class="mt-12">
      <button class="btn btn-success" @click="save()">Save</button>
    </div>

    <div class="my-5 text-gray-500 text-xs text-center">ID: {{ org._id }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      org: {},
    };
  },
  mounted() {
    this.getOrg();
  },
  methods: {
    async getOrg() {
      const rec = await this.$store.getOrg();
      this.org = rec.data;
    },
    async save() {
      await this.$store.saveOrg(this.org);
    },
  },
};
</script>
