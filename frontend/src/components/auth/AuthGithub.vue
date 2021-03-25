<template>
   <div class="text-center">
      <v-avatar color="primary" size="120">
         <v-progress-circular :size="70" color="white" indeterminate>
            <v-icon x-large dark>
               mdi-github
            </v-icon>
         </v-progress-circular>
      </v-avatar>
   </div>
</template>

<script>
export default {
   async mounted() {
      try {
         const code = this.$route.query.code;
         await this.$store.dispatch('signInGithub', { code });
         this.$router.push({ name: 'home' });
      } catch(exception) {
         this.$toast.error(exception);
         this.$router.push({ name: 'auth.signIn' });
      }
   },
};
</script>