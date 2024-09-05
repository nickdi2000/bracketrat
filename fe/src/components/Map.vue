<template>
  <span>
    <div v-if="showModal" class="fade fadeinUp hostModal backdrop-blur-lg">
      <div class="card-body-">
        <h1>{{ selectedGame.location }}</h1>
        <div class="text-2xl font-bold text-white mb-0">
          {{ selectedGame.name }}
        </div>
        <div class="mt-0 uppercase text-gray-400 font-bold opacity-80">
          SPORT: {{ selectedGame.sport }}
        </div>
        <div class="text-white">{{ selectedGame.description }}</div>

        <div class="fadein">
          <h3 class="text-2xl font-bold mt-10">
            {{ selectedGame.day }}'s<br />
            @ {{ selectedGame.time }}
          </h3>
          <div class="mt-2 uppercase text-gray-400 font-bold opacity-80">
            <CalendarIcon class="w-4 inline mr-2" /> {{ selectedGame.interval }}
          </div>

          <div>
            <router-link
              to="/pages/contact/map"
              class="bg-blue-800 text-white hover:bg-blue-400 font-bold p-2 mt-4 mr-2"
            >
              Request Join
            </router-link>
            <button
              class="mt-10 bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              @click="toggleModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mapDiv">
      <GoogleMap
        :api-key="key"
        :options="mapOptions"
        :style="'width: 100%; height: 100%; opacity: ' + mapOpacity"
        :center="center"
        :zoom="zoom"
        :gestureHandling="'greedy'"
        :styles="mapStyle"
        :disable-default-ui="true"
      >
        <CustomMarker :options="marker" v-for="marker in sampleHosts">
          <div style="text-align: center">
            <MapMarker
              @click="toggleModal(marker)"
              :marker="marker"
              :inspecting="inspecting"
            />
          </div>
        </CustomMarker>
      </GoogleMap>
    </div>
  </span>
</template>

<script>
import { GoogleMap, CustomMarker, InfoWindow } from "vue3-google-map";
import MapMarker from "../components/Marker.vue";
import mapOptions from "./map.json";
import hostService from "@/services/hostService.js";

export default {
  components: {
    GoogleMap,
    CustomMarker,
    MapMarker,
  },
  props: {
    coords: {
      type: Object,
      default: () => {
        return { lat: 43.01107, lng: -79.617015 };
      },
    },
    inspecting: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    setTimeout(() => {
      this.mapOpacity = 1;
      this.center = this.coords;
    }, 500);
  },

  methods: {
    changePosition(coords) {
      this.center = coords;
      setTimeout(() => {
        this.zoom = 11;
      }, 500);
    },
    toggleModal(host = null) {
      if (host) {
        this.selectedGame = host;
      }

      this.showModal = !this.showModal;
    },
  },
  data() {
    return {
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      showModal: false,
      selectedGame: {},
      sampleHosts: hostService.sampleHosts,
      markerOptions: {
        position: { lat: 43.01107, lng: -79.617015 },
      },
      mapOptions: {
        disableDefaultUI: true,
      },
      mapOpacity: 0.9,
      center: { lat: 43.65107, lng: -79.347015 },
      zoom: 7,
      cities: {
        toronto: { lat: 43.65107, lng: -79.347015 },
        ny: { lat: 40.7128, lng: -74.006 },
      },

      mapStyle: mapOptions,
    };
  },
  watch: {
    coords(val) {
      console.log("Changing coords", val);
      this.changePosition(val);
    },
  },
};
</script>

<style scoped>
.hostModal {
  position: fixed;
  top: 20%;

  left: 10%;
  background: rgba(23, 31, 62, 0.638);
  width: 80%;
  padding: 2rem;
  border-radius: 3rem;
  z-index: 2;
}

.mapDiv {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>
