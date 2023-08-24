<template>
  <div id="app">
    <router-link to="/home" tag="h1" > 》home</router-link>
    <router-link to="/about" tag="h1"> 》about</router-link>
    <hr>
    <div>{{this.$route.path}}</div>
    <router-view length="10"/>
  </div>
</template>

<script>
export default {
  name: 'App',

  mounted(){
    // setInterval(() => {
      
    //   console.log('$route',this.$route.path);
    // }, 1000);
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
