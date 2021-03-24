<template>
   <form @submit.prevent="signUp" class="mx-2">
      <div class="font-weight-bold headline">Register</div>

      <v-text-field
         @blur="$v.email.$touch()"
         :error-messages="emailErrors"
         v-model="email"
         label="Email"
      ></v-text-field>

      <v-text-field
         @blur="$v.username.$touch()"
         :error-messages="usernameErrors"
         v-model="username"
         label="Username"
      ></v-text-field>

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

      <v-btn type="submit" class="font-weight-bold primary px-10">Register</v-btn>

      <router-link exact :to="{ name: 'auth.signIn' }">
         <a style="color: grey" class="ml-2 caption nobr">Already having an account, Login!</a>
      </router-link>
   </form>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';

export default {
   data() {
      return {
         email: '',
         username: '',
         password: '',
         passwordConfirm: '',
      };
   },
   validations: {
      email: { 
         required, email
      },
      username: { 
         required 
      },
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
      emailErrors() {
         const errors = [];
         if (!this.$v.email.$dirty) return errors;
         !this.$v.email.required && errors.push( "Email required" );
         !this.$v.email.email && errors.push( "Email invalid" );
         return errors;
      },
      usernameErrors() {
         const errors = [];
         if (!this.$v.username.$dirty) return errors;
         !this.$v.username.required && errors.push('Username required');
         return errors;
      },
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
            const { email, username, password, passwordConfirm } = this
            const payload = { email, username, password, passwordConfirm }
            await this.$store.dispatch('signUpUser', payload);
            this.$toast.success(`Registration successful, Please verify account.`);
            this.$router.push({ name: 'auth.signIn' });
         }
         catch (exception) {
            this.$toast.error(exception);
         }
      },
   },
};
</script>