<template>
   <form @submit.prevent="resetPassword" class="mx-2">
      <div class="font-weight-bold headline">Forgot Password</div>
      <div class="caption grey--text lighten-1--text">Please provide your email.</div>

      <v-text-field
         @blur="$v.usernameOrEmail.$touch()"
         :error-messages="usernameOrEmailErrors"
         v-model="usernameOrEmail"
         label="Email/Username"
      ></v-text-field>


      <v-btn class="font-weight-bold primary px-10 mt-2" width="100%" type="submit">Send Mail</v-btn>
   </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
   data() {
      return {
         usernameOrEmail: '',
      };
   },
   validations: {
      usernameOrEmail: { required }
   },
   computed: {
      usernameOrEmailErrors() {
         const errors = [];
         if (!this.$v.usernameOrEmail.$dirty) return errors;
         !this.$v.usernameOrEmail.required && errors.push('Username or Email is required.');
         return errors;
      },
   },
   methods: {
      async resetPassword() {
         this.$v.$touch();
         if (this.$v.$anyError) return;

         try {
            const payload = { usernameOrEmail: this.usernameOrEmail };
            await this.$store.dispatch('forgotPassword', payload);
            this.$toast.success('Password reset email is sent.');
            this.$router.push({ name: 'auth.signIn' });
         } 
         catch (exception) {
            this.$toast.error(exception);
         }
      },
   },
};
</script>
