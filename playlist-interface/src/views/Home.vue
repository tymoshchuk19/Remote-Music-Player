<template>
  <div class="home">
    <AppBar :name="sysname"/>
      
    <v-card >
      <Playlist :musicas="musicas" @play="playingindex=$event; playMusic(); playing =! playing;"/>
    </v-card>        
    
    <v-footer fixed padless>
        <v-progress-linear
          :value="per"
          class="my-0"
          height="3"
        ></v-progress-linear>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{musicas[playingindex].title}}</v-list-item-title>
              <v-list-item-subtitle>{{musicas[playingindex].artist}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-icon>
              <v-btn 
                icon 
                @click="(playingindex === 0) ? playingindex = musicas.length:playingindex--; playMusic(); playing = false;"
              >
                <v-icon>mdi-rewind</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn 
                v-if="playing" 
                icon 
                @click="playMusic(); playing =! playing;"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn 
                v-else 
                icon 
                @click="pauseMusic(); playing =! playing"
              >
                <v-icon>mdi-pause</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon
              class="ml-0"
              :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }"
            >
              <v-btn 
                icon
                @click="(playingindex === musicas.length) ? playingindex = 0:playingindex++; playMusic(); playing = false;"
              >
                <v-icon>mdi-fast-forward</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
    </v-footer>
  </div>
</template>

<script>
/*eslint-disable no-console*/
import Playlist from '../components/Playlist';
import AppBar from '../components/AppBar';
import axios from 'axios';

export default {
  name: 'home',
  components: {
    Playlist,
    AppBar
  },
    data () {
      return {
        sysname: "",
        per: 0,
        l: 0,
        size: 0,
        playingindex: 0,
        playing: true,
        protocol:"http",
        musicas: []
      }
    },
    methods: {
      playMusic() {
        axios.get('http://localhost:3000/music/' + this.musicas[this.playingindex].path)
          .then(data => { 
            console.log(data.data);
            this.size=data.data; 
            //this.startProgress(); 
          });
      },
      pauseMusic() {
        axios.get('http://localhost:3000/music/' + this.musicas[this.playingindex].path);
      },
      startProgress() {
        if(this.per<100) {
          this.per = (this.l/this.size)*100; 
          this.l+=1;
          console.log(this.per +' '+ this.l);
          setTimeout(()=>this.startProgress(),1200);
        }
      }
    },
    mounted() {
      axios.get('http://localhost:3000/sysname')
        .then(data => this.sysname = data.data );

      axios.get('http://localhost:3000/')
        .then(data => this.musicas = data.data );
    }
}
</script>
