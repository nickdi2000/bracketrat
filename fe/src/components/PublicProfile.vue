<template>
  <div class="mid text-white main-public">
    <div class="flex flex-col">
      <div class="w-56 card">
        <div class="subtitle">Your Profile</div>
        <div>
          Name: <span class="uppercase font-bold">{{ player?.name }}</span>
        </div>

        <div v-if="!player?.email" class="text-orange-500 font-bold">
          Email: Not Provided
        </div>
        <div v-else>Email: {{ player?.email ?? "--" }}</div>
      </div>

      <div class="mt-3 card">
        <div class="subtitle">Share Bracket with other players</div>
        <div class="flex flex-col items-center">
          <div class="flex flex-col items-center"></div>
          <QRcode
            :learnMoreProp="false"
            :printIcon="false"
            :size="280"
            :bracket="bracket"
          />
        </div>
      </div>
      <div>
        <!--back to bracket button -->

        <div class="flex justify-center mt-8">
          <button
            @click="backToBracket()"
            class="btn btn-secondary text-lg font-bold"
          >
            Back to Bracket
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRcode from "@/components/ui/QRCode.vue";

export default {
  name: "PublicProfile",
  props: {
    bracket: {
      type: Object,
      default: () => {},
    },
    player: {
      type: String,
      default: "",
    },
  },
  components: {
    QRcode,
  },
  methods: {
    backToBracket() {
      this.$router.push("/player/bracket");
    },
  },

  computed: {
    link() {
      return "BracketForce.com/" + this.bracket?.code;
    },
  },
};
</script>
