<template>
  <FormWrapper :model="model" :formData="form">
    <span>
      <div v-if="!newUser">
        <div class="space-y-4">
          <Input label="Name" v-model="form.name" placeholder="My Tournament" />
          <div class="flex justify-end">
            <button
              @click="generateName"
              class="text-gray-300 hover:bg-slate-800 px-2 py-1 text-xs mt-0 rounded-md text-right bg-slate-600"
            >
              Generate Name
            </button>
          </div>
          <div class="pb-4">
            <label class="block text-sm font-medium text-white"
              >Bracket Type</label
            >
            <button
              class="text-white p-2 rounded-md hover:bg-blue-500 m-2"
              :class="form.type === type.value ? 'bg-blue-500 	' : 'bg-blue-900'"
              v-for="type in types"
              :key="type.value"
              @click="makeSelection(type.value)"
            >
              {{ type.name }}
            </button>
            <div v-if="selectedTypeObject" class="fadein">
              <Alert type="info">
                <span
                  v-if="
                    selectionCount == 8 &&
                    hasBeenSelected(selectedTypeObject?.value)
                  "
                >
                  This still does the same thing it did the first time.
                </span>
                {{ selectedTypeObject?.description }}
                <span
                  v-if="
                    selectionCount == 7 &&
                    hasBeenSelected(selectedTypeObject?.value)
                  "
                >
                  You've actually already seen this one. Is there anything I can
                  do to help you decide?</span
                >
              </Alert>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white"
              >Bracket Type</label
            >
            <button
              class="w-full p-2 text-white font-bold rounded-md hover:bg-blue-500 m-2"
              :class="form.unit === type.value ? 'bg-blue-500 	' : 'bg-blue-900'"
              v-for="type in units"
              :key="type.value"
              @click="form.unit = type.value"
            >
              {{ type.name }}
            </button>
          </div>

          <Select
            v-if="form.unit"
            class="fadein"
            label="Sport"
            :options="sports"
            v-model="form.sport"
            placeholder="Select Sport (Optional)"
          />
        </div>
      </div>
      <div v-else>
        <div>
          <button
            v-for="unit in units"
            :key="unit.value + 'unit'"
            @click="form.unit = unit.value"
            :class="form.unit === unit.value ? 'bg-blue-600' : 'bg-slate-900'"
            class="w-full py-3 px-10 rounded-md flex flex-row justify-between mb-3 shadow-2xl hover:bg-slate-800 transition-all duration-300 ease-in-out"
          >
            <div>
              <div class="text-white text-5xl font-bold mt-3">
                {{ unit.name }}
              </div>
              <div class="overline uppercase text-white">Sport</div>
            </div>
            <span
              :class="form.unit === unit.value ? 'animate-spin spin-slow' : ''"
            >
              <svg
                v-if="unit.value === 'solo'"
                width="91px"
                height="91px"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                fill="#f2f2f2"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>sports-tennis</title>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="invisible_box" data-name="invisible box">
                      <rect width="48" height="48" fill="none"></rect>
                    </g>
                    <g id="Q3_icons" data-name="Q3 icons">
                      <path
                        d="M24,5A19,19,0,1,0,43,24,19,19,0,0,0,24,5ZM38.9,22A15.7,15.7,0,0,1,26,9.1,15.1,15.1,0,0,1,38.9,22ZM9.1,26A15.7,15.7,0,0,1,22,38.9,15.1,15.1,0,0,1,9.1,26Zm16,12.9a18.9,18.9,0,0,0-16-16A14.8,14.8,0,0,1,22.9,9.1a18.9,18.9,0,0,0,16,16A14.8,14.8,0,0,1,25.1,38.9Z"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              <svg
                v-else
                width="81px"
                height="81px"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                fill="#f2f2f2"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>sports-soccer-solid</title>
                  <g id="Layer_2" data-name="Layer 2">
                    <g id="invisible_box" data-name="invisible box">
                      <rect width="48" height="48" fill="none"></rect>
                    </g>
                    <g id="Q3_icons" data-name="Q3 icons">
                      <path
                        d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM18.6,6.9,20,6.4A18.1,18.1,0,0,1,24,6a19.1,19.1,0,0,1,5.4.8l1.1,3.3L24,14.7l-6.5-4.6ZM6,23.8A17.6,17.6,0,0,1,9.4,13.6h3.4l2.3,7.6L8.8,25.9ZM18.3,41.1a18.2,18.2,0,0,1-8.8-6.4l1.1-3.3h7.9l2.6,7.6ZM20,29l-2.5-7.4L24,17l6.5,4.6L28,29Zm9.7,12.1-2.8-2,2.6-7.6h7.9l1.1,3.3A18.4,18.4,0,0,1,29.7,41.1Zm9.5-15.2-6.3-4.8,2.3-7.6h3.5A18.7,18.7,0,0,1,41.6,20a25.8,25.8,0,0,1,.4,3.8Z"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </span>
  </FormWrapper>
</template>

<script>
import FormWrapper from "./FormWrapper.vue";
import { BracketNames } from "@/constants/enums";

export default {
  data() {
    return {
      BracketNames,
      newUser: false,
      model: {
        name: "Bracket",
        path: "brackets",
      },
      selectionCount: 0,
      selections: [],
      form: {
        name: "",
        type: "",
        sport: "",
        unit: "",
      },
      units: [
        {
          value: "solo",
          name: "Solo",
        },
        {
          value: "team",
          name: "Team",
        },
      ],
      types: [
        {
          value: "single-elimination",
          name: "Single Elimination",
          description:
            "The most common type of tournament. Loser is out after one loss.  Rough.",
        },
        {
          value: "double-elimination",
          name: "Double Elimination",
          description:
            "You get a second chance if you lose.  Loser's grab a beer then play their little game.",
        },
        {
          value: "round-robin",
          name: "Round Robin",
          description:
            "Everyone plays everyone else.  The person with the most wins is the winner. Although it's just one bracket, the winner will continue to talk about it for years to come.",
        },
        {
          value: "swiss",
          name: "Swiss",
          description:
            "A non-elimination tournament.  You play someone with the same record as you.  The person with the best record at the end wins. Very European.",
        },
        {
          value: "playoffs",
          name: "Playoffs",
          description:
            "You play in a group stage and then the top teams advance to a single elimination bracket.  It's great for pretending you're in the big leagues.",
        },
        {
          value: "other",
          name: "Other",
          description:
            "This option is actually just the same as single-elimination, but it feels like you had a choice this way.",
          description2:
            "You probably just clicked this option to see what terrible joke I would make.  I'm not disappointed in you.  I'm disappointed in myself.",
        },
      ],
      teamSports: [
        {
          value: "soccer",
          name: "Soccer",
        },
        {
          value: "basketball",
          name: "Basketball",
        },
        {
          value: "volleyball",
          name: "Volleyball",
        },
        {
          value: "hockey",
          name: "Hockey",
        },
        {
          value: "rugby",
          name: "Rugby",
        },
        {
          value: "cricket",
          name: "Cricket",
        },
        {
          value: "baseball",
          name: "Baseball",
        },
        {
          value: "softball",
          name: "Softball",
        },
        {
          value: "handball",
          name: "Handball",
        },
        {
          value: "lacrosse",
          name: "Lacrosse",
        },
        {
          value: "water-polo",
          name: "Water Polo",
        },
        {
          value: "field-hockey",
          name: "Field Hockey",
        },
        {
          value: "other",
          name: "Other",
        },
      ],
      soloSports: [
        {
          value: "squash",
          name: "Squash",
        },
        {
          value: "table-tennis",
          name: "Table Tennis",
        },
        {
          value: "racquetball",
          name: "Racquetball",
        },
        {
          value: "tennis",
          name: "Tennis",
        },
        {
          value: "golf",
          name: "Golf",
        },
        {
          value: "track",
          name: "Track",
        },
        {
          value: "swimming",
          name: "Swimming",
        },
        {
          value: "cross-country",
          name: "Cross Country",
        },
        {
          value: "wrestling",
          name: "Wrestling",
        },
        {
          value: "boxing",
          name: "Boxing",
        },
        {
          value: "martial-arts",
          name: "Martial Arts",
        },
        {
          value: "other",
          name: "Other",
        },
      ],
    };
  },
  computed: {
    selectedTypeObject() {
      return this.types.find((type) => type.value === this.form.type);
    },
    sports() {
      return this.form.unit === "team" ? this.teamSports : this.soloSports;
    },
  },
  components: {
    FormWrapper,
  },
  mounted() {
    if (this.$route.params.id) {
      this.getRecord(this.$route.params.id);
    }
  },
  methods: {
    async getRecord(id) {
      const { data } = await this.$api.get(`/brackets/${id}`);
      this.form = data;
    },
    makeSelection(type) {
      this.form.type = type;
      this.selectionCount++;
      this.selections.push(type);
    },
    hasBeenSelected(type) {
      return this.selections.includes(type);
    },
    generateName() {
      this.form.name =
        this.BracketNames[Math.floor(Math.random() * this.BracketNames.length)];
    },
  },
};
</script>

<style scoped></style>
