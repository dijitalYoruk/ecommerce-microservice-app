<template>
  <div class="text-center">
         <v-btn @click="signInGithub()" class="mx-2 elevation-0" fab dark large color="primary">
            <v-icon dark>
               mdi-github
            </v-icon>
         </v-btn>

         <v-btn @click="signInGoogle()" class="mx-2 elevation-0" fab dark large color="primary">
            <v-icon dark>
               mdi-google
            </v-icon>
         </v-btn>

         <v-btn @click="signInFacebook()" class="mx-2 elevation-0" fab dark large color="primary">
            <v-icon dark>
               mdi-facebook
            </v-icon>
         </v-btn>
      </div>
</template>

<script>
export default {
   methods: {
      async signInGithub() {
         try {
            const url = await this.$store.dispatch('getGithubAuthURL');
            window.location.href = url
         } catch (exception) {
            this.$toast.error(exception);
         }
      },
      async signInGoogle() {
         try {
            const url = await this.$store.dispatch('getGoogleAuthURL');
            window.location.href = url
         } catch (exception) {
            this.$toast.error(exception);
         }
      },
      async signInFacebook() {
         try {
            const url = await this.$store.dispatch('getFacebookAuthURL');
            window.location.href = url
         } catch (exception) {
            this.$toast.error(exception);
         }
      }
   }
}
</script>

<style>

</style>