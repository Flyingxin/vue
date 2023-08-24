<template>
  <div>
    <h1>this is MyButton</h1>
    <h2>sum: {{$store.state.sum}}</h2>
    <h2>getters : {{$store.getters.caclSum}}</h2>
    <h2>getters : {{$store.getters.caclSum}}</h2>
    <button @click="++$store.state.sum">按钮+1</button>
    <button @click="$store.commit('ADD',2)">mutations同步按钮+2</button>
    <button @click="$store.dispatch('add',2)">actions异步按钮+2</button>
  </div>
</template>

<script>
export default {
  name: 'MyButton',
  beforeCreate(){
    console.log(this.$options);
  }
}
</script>

<style>

</style>