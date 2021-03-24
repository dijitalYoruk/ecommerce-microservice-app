<template>
   <div>
      <div class="text-center" v-if="inProgress">
         <v-progress-circular class="my-6" :size="50" :width="5" color="primary" indeterminate></v-progress-circular>
      </div>
      <div v-else-if="isVerified">
         <v-toolbar class="elevation-0">
            <v-avatar color="primary" size="60">
               <v-icon dark x-large>mdi-check-bold</v-icon>
            </v-avatar>

            <div class="ml-2 font-weight-bold">
               Account verified.
            </div>
         </v-toolbar>
      </div>
      <div v-else>
         <v-toolbar class="elevation-0">
            <v-avatar color="primary" size="60">
               <v-icon dark x-large>mdi-close-thick</v-icon>
            </v-avatar>

            <div class="ml-2 font-weight-bold">
               Account verification failed. Please contact Support!
            </div>
         </v-toolbar>
      </div>
   </div>
</template>

<script>
export default {
   mounted() {
      const token = this.$route.query.token;
      this.verifyUser(token);
   },
   data() {
      return {
         inProgress: true,
         isVerified: false,
      };
   },
   methods: {
      async verifyUser(token) {
         if (!token) {
            this.inProgress = false;
            return;
         }

         try {
            await this.$store.dispatch('verifyUser', { token });
            this.isVerified = true;
            this.inProgress = false;
            setTimeout(() => this.$router.push({ name: 'auth.signIn' }), 3000);
         } catch (exception) {
            console.log(exception);
            this.inProgress = false;
         }
      },
   },
};
</script>

<style></style>
