<template>
   <form @submit.prevent="signUp" class="mx-2">
      <div class="font-weight-bold headline">Reset Password</div>

      <v-text-field
         @blur="$v.password.$touch()"
         :error-messages="passwordErrors"
         v-model="password"
         label="Password"
         class="mt-2"
         type="password"
      ></v-text-field>

      <v-text-field
         @blur="$v.passwordConfirm.$touch()"
         :error-messages="passwordConfirmErrors"
         v-model="passwordConfirm"
         label="Password Confirm"
         type="password"
         class="mt-2"
      ></v-text-field>

      <v-btn type="submit" class="font-weight-bold primary px-10">Reset</v-btn>
   </form>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
   mounted () {
      this.token = this.$route.query.token
   },
   data() {
      return {
         token: '',
         password: '',
         passwordConfirm: '',
      };
   },
   validations: {
      password: {
         required, 
         minLength: minLength(10)
      },
      passwordConfirm: {
         required, 
         minLength: minLength(10), 
         sameAsPassword: sameAs('password')
      },

   },
   computed: {
      passwordErrors() {
         const errors = [];
         if (!this.$v.password.$dirty) return errors;
         !this.$v.password.required && errors.push('Password required');
         !this.$v.password.minLength && errors.push('Password needs to be at least 10 characters.');
         return errors;
      },
      passwordConfirmErrors() {
         const errors = [];
         if (!this.$v.passwordConfirm.$dirty) return errors;
         !this.$v.passwordConfirm.required && errors.push('Password required');
         !this.$v.passwordConfirm.minLength && errors.push('Password needs to be at least 10 characters.');
         !this.$v.passwordConfirm.sameAsPassword && errors.push('Passwords do not match each other.');
         return errors;
      },
   },
   methods: {
      async signUp() {
         this.$v.$touch();
         if (this.$v.$anyError) return;

         try {
            const { password, passwordConfirm, token } = this
            const payload = { password, passwordConfirm, token }
            await this.$store.dispatch('resetPassword', payload);
            this.$toast.success(`Password Updated. Please Log in.`);
            this.$router.push({ name: 'auth.signIn' });
         }
         catch (exception) {
            this.$toast.error(exception);
         }
      },
   },
};
</script>