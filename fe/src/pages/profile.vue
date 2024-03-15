<template>
  <FormWrapper :model="model" :formData="form" :showBack="true">
    <div class="space-y-5">
      <Input
        v-for="field in fields"
        :key="field.model"
        :field="field"
        :label="field.label"
        v-model="form[field.model]"
      />
    </div>
  </FormWrapper>
</template>

<script>
import FormWrapper from "../components/forms/FormWrapper.vue";

export default {
  components: {
    FormWrapper,
  },
  name: "Profile",
  computed: {
    user() {
      return this.$store.user;
    },
  },
  mounted() {
    this.form = this.user;
  },
  data() {
    return {
      model: {
        name: "Profile",
        path: "users",
      },
      form: {
        name: "",
        email: "",
        password: "",
      },
      fields: [
        {
          type: "text",
          label: "Name",
          model: "name",
          placeholder: "Name",
        },
        {
          type: "text",
          label: "Email",
          model: "email",
          placeholder: "email",
          readonly: true,
        },
        {
          type: "text",
          label: "Password",
          model: "password",
          placeholder: "Password",
        },
      ],
    };
  },
};
</script>
