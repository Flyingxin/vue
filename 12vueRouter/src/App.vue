<template>
  <div id="app">
    <!-- <router-view/> -->
    <router-link to="/about" tag="h1">about</router-link>
  </div>
</template>

<script>
export default {
  name: 'App',

  mounted(){
    console.log('$router',this.$router);
  }
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
