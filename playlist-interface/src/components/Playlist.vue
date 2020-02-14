<template>
  <v-data-table
    :headers="headers"
    :items="musicas"
    :sort-by="['artista']"
    :sort-desc="[false]"
    multi-sort
    class="elevation-1"
    @click:row="play"
  ></v-data-table>
</template>

<script>
/*eslint-disable no-console*/
  export default {
    props: ['musicas'],
    data () {
      return {
        headers: [
          { text: 'Id', value: 'id' },
          { text: 'Artista', value: 'artist'},
          { text: 'Titulo', value: 'title' },
          { text: 'Nome', value: 'path' }
        ]
      }
    },
    methods: {
      play(event) {
        this.$emit('play', event.id-1);
      }
    }
  }
</script>