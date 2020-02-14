<template>
  <v-content>
    <v-app-bar class="black green--text">
      <v-toolbar-title >Device: {{ name }}</v-toolbar-title>
      <v-spacer/>
      <gr-dropdown :label="'Host IP'" :items="datahosts"></gr-dropdown>
    </v-app-bar>
  </v-content>
</template>

<script>
import DropDown from '@/components/DropDown.vue';
import axios from 'axios';
  export default {
    props: ['name'],
    components: {
      'gr-dropdown': DropDown
    },
    data () {
      return {
        datahosts: ""
      }
    },
    mounted() {
      axios
        .get("http://localhost:3000/hosts")
        .then(data => {
          this.datahosts = data.data;
        });
    }
  }
</script>