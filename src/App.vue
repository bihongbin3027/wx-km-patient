<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: 'app',
  }
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
  }
  #app {
    height: 100%;
  }
</style>
