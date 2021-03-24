<template>
  <nav class=" mb-12">
    <v-app-bar color="primary" class="elevation-0" fixed dark dense>
      
      <v-toolbar-title class="mx-2">
        Todo<span class="font-weight-bold">App</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <router-link v-if="!isUserSignedIn" exact :to="{name: 'auth.signIn'}">
        <v-btn class="primary elevation-0 white--text">
          Sign In
          <v-icon class="ml-2">mdi-login-variant</v-icon>
        </v-btn>
      </router-link>

      <router-link v-if="!isUserSignedIn" exact :to="{name: 'auth.signUp'}">
        <v-btn class="primary elevation-0 white--text">
          Sign Up
          <v-icon class="ml-2">mdi-account-plus-outline</v-icon>
        </v-btn>
      </router-link>


        <v-btn  v-if="isUserSignedIn" class="primary elevation-0 white--text" @click="signOut()">
          Sign Out
          <v-icon class="ml-2">mdi-logout-variant</v-icon>
        </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(['isUserSignedIn'])
  },
  methods: {
    signOut() {
      this.$store.commit('signOut')
      this.$router.push({ name: 'auth.signIn' })
    }
  }
};
</script>

<style>
</style>