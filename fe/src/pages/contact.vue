<template>
  <section class="bg-white dark:bg-gray-900 mt-5">
    <div
      v-if="flag == 'success'"
      class="w-full flex flex-col align-center items-center py-4 my-4 fadeinUp"
    >
      <Alert type="success"
        >Thanks for reaching out. We'll be in touch asap.</Alert
      >
      <div class="pt-3">
        <button
          class="btn btn-secondary"
          @click.stop="$router.push('/landing')"
        >
          Return Home
        </button>
      </div>
    </div>

    <div class="py-8 mt-5 lg:py-16 px-4 mx-auto max-w-screen-md" v-else>
      <h2
        class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
      >
        Contact Us
      </h2>
      <p
        class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl"
      >
        Contact us with any questions you have, technical or otherwise. We will
        do our best to get back to you as soon as possible.
      </p>
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Your email</label
        >
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
          placeholder="charlie@bracketrat.com"
          required
        />
      </div>

      <div class="sm:col-span-2">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 pt-4"
          >Your message</label
        >
        <textarea
          id="message"
          rows="6"
          v-model="form.message"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Leave a comment..."
        ></textarea>
      </div>

      <div class="mt-4">
        <button @click="submit()" class="btn btn-success bg-green-700">
          Send message
        </button>
        <button class="btn btn-secondary mx-3" @click.stop="$router.go(-1)">
          Cancel
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      form: {
        email: "",
        message: "",
      },
    };
  },
  computed: {
    flag() {
      //route
      return this.$route?.params?.flag || "form";
    },
  },
  created() {
    this.form.email = this.$store.user.email;
  },
  methods: {
    async submit() {
      try {
        const rec = await this.$api.post("/guest/contact", this.form);
        this.$router.push("/admin/contact/success");
        console.log("rec", rec);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
