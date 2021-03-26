<template>
  <div class="mt-8">
     <h3>CurrentUser</h3>
     <div>
       {{ user }}
     </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    this.user = await this.$store.dispatch('retrieveCurrentUser');
  },
  data() {
    return {
      user: {}
    }
  }
}
</script>