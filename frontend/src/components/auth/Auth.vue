<template>
   <v-container class="px-4">
      <v-card style="max-width: 500px" outlined class=" mx-auto mt-6 pa-3 elevation-1">
         <v-row no-gutters>
            <v-col>
               <transition name="slide" type="transition" mode="out-in">
                  <router-view />
               </transition>
            </v-col>
         </v-row>
      </v-card>
   </v-container>
</template>
