<template>
  <div id="app">
    <MyButton/>
  </div>
</template>

<script>
import MyButton from './components/my-button.vue'
export default {
  name: 'App',
  components:{
    MyButton
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
