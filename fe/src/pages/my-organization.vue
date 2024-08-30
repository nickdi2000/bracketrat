<template>
  <div class="py-3">
    <fwb-tabs v-model="activeTab" class="p-5">
      <fwb-tab name="first" title="My Tournaments">
        <div>
          <router-link
            :to="'/admin/brackets/create'"
            class="bg-slate-700 p-2 text-white rounded-md font-bold hover:bg-blue-800"
          >
            + Create New Tournament
          </router-link>
        </div>

        <section>
          <div class="fadeinU mt-5 pb-2 shadow-inner">
            <fwb-table>
              <fwb-table-head>
                <fwb-table-head-cell>Name</fwb-table-head-cell>
                <fwb-table-head-cell>Status</fwb-table-head-cell>
                <fwb-table-head-cell>Edit</fwb-table-head-cell>
              </fwb-table-head>
              <fwb-table-body>
                <fwb-table-row
                  @click="selectBracket(item)"
                  v-for="item in items"
                  :key="item.id"
                  class="hover:bg-blue-900 hover:text-white cursor-pointer"
                >
                  <fwb-table-cell>
                    <span
                      :class="
                        selectedBracket._id == item.currentBracket
                          ? 'text-green-300'
                          : ''
                      "
                    >
                      <CheckCircleIcon
                        title="Currently Selected Bracket"
                        class="h-6 w-6 inline mr-2"
                        v-if="selectedBracket._id == item.currentBracket"
                      />
                      {{ item.name }}
                    </span>
                    <div class="badge mx-2" v-if="item.players?.length">
                      {{ item.players?.length }} {{ $teamPlayer }}s
                    </div>
                  </fwb-table-cell>
                  <fwb-table-cell>
                    <div class="text-left uppercase">
                      {{ item.status }}
                    </div></fwb-table-cell
                  >
                  <fwb-table-cell class="text-left flex justify-start">
                    <div class="flex justify-between space-x-2">
                      <FButton
                        color="blue"
                        size="sm"
                        @click.stop="
                          () =>
                            this.$router.push(
                              `/admin/brackets/edit/${item.currentBracket}`
                            )
                        "
                      >
                        Edit</FButton
                      >

                      <FButton
                        class="text-white"
                        gradient="red"
                        size="sm"
                        @click.stop="deleteBracket(item._id)"
                      >
                        <TrashIcon class="h-6 w-6" />
                      </FButton>
                    </div>
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
            </fwb-table>

            <!-- <div class="pt-8 text-white text-sm">
              <Alert type="info"
                >Switch to a bracket above by clicking on the row (or click
                "Edit" to adjust the details)</Alert
              >
            </div> -->

            <div class="flex justify-center pt-16 text-blue-400 m-auto">
              <QuestionMarkCircleIcon
                class="w-4 h-4 inline"
                @click="
                  $bottomAlert(
                    `Click on the row to switch to that tournament. (the currently selected one is highlighted green) You can also click 'Edit' to adjust the details, or create a New Tournament & Bracket.`
                  )
                "
              />
            </div>
          </div>
        </section>
      </fwb-tab>
      <fwb-tab name="second" title="Organization">
        <OrgForm />
      </fwb-tab>
    </fwb-tabs>
    <ProgressBar v-if="loading" />
  </div>
</template>

<script>
import openDialog from "@/services/dialog.service";
import OrgForm from "@/components/forms/OrgForm.vue";

import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbTabs,
  FwbTab,
} from "flowbite-vue";

export default {
  components: {
    FwbA,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
    FwbTabs,
    FwbTab,
    OrgForm,
  },
  mounted() {
    this.getRecords();
  },
  computed: {
    selectedBracket() {
      return this.$store.getBracket ?? {};
    },
  },
  methods: {
    async getRecords() {
      this.loading = true;
      //const response = await this.$api.get("/brackets");
      const response = await this.$api.get("/tournaments");
      this.items = response.data;
      this.loading = false;
    },
    async selectBracket(item) {
      //await this.$store.fetchBracket(item._id);
      await this.$store.fetchBracket(item.currentBracket);
      this.$router.push(`/admin/dashboard`);
    },
    async deleteBracket(id) {
      openDialog("Delete Bracket?");
      const rec = await this.$api.delete(`brackets/${id}`);
    },
  },
  data() {
    return {
      items: [],
      loading: false,
      activeTab: "first",
      dummy_items: [
        {
          title: "The Phazzball Open",
          status: "In Progress",
          id: 1,
        },
        {
          title: "Fall House League",
          status: "Draft",
          id: 2,
        },
      ],
    };
  },
};
</script>
