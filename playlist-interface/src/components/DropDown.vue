<template>
    <div class="text-center">
        <v-row>
            <v-col class="d-flex green--text">
                <v-select
                filled
                :items="items"
                :label="label"
                @input="Setting($event)"
                ></v-select>
            </v-col>
        </v-row>
  </div>
</template>

<script>
import axios from "axios";

/*eslint-disable no-console*/
  export default {
    props: ['label','items'],
    data: () => ({
    }),
    methods: {
      Setting(event){
        axios
          .post("http://localhost:3000/hostip", { host: event })
          .then(() => console.log('Top'));
      }
    }
  }
</script>
