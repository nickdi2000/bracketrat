<template>
  <div class="py-5">
    <header class="flex items-center justify-center">
      <h1
        class="text-2xl mb-4 font-bold leading-tight text-gray-900 dark:text-gray-100"
      >
        My Brackets
      </h1>
    </header>

    <div>
      <router-link
        :to="'/brackets/create'"
        class="bg-slate-700 p-2 text-white rounded-md font-bold hover:bg-blue-800"
      >
        + Create New
      </router-link>
    </div>

    <div class="pt-4 text-white">
      <Alert type="info"
        >Select a bracket below (or click "Edit" to adjust the details)</Alert
      >
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
              <fwb-table-cell>{{ item.name }}</fwb-table-cell>
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
                      () => this.$router.push(`/brackets/edit/${item._id}`)
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
      </div>

      <ProgressBar v-if="loading" />
    </section>
  </div>
</template>

<script>
import openDialog from "@/services/dialog.service";

import {
  FwbA,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
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
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    async getRecords() {
      this.loading = true;
      const response = await this.$api.get("/brackets");
      this.items = response.data;
      this.loading = false;
    },
    selectBracket(item) {
      //this.$router.push(route);
      this.$store.setSelectedBracket(item);
      this.$router.push(`/dashboard`);
    },
    async deleteBracket(id) {
      openDialog("Are you shure?");
      return;
      const rec = await this.$api.delete(`brackets`, id);
    },
  },
  data() {
    return {
      items: [],
      loading: false,
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
