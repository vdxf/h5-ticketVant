<template>
  <router-view></router-view>
</template>

<script>
  export default {
  }
</script>

<style lang="scss">
  @import '@/assets/sass/global.scss';
  .view-wrap{
    box-sizing: border-box;
    margin: 0 auto;
    width: j(375);
    height: 100vh;
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
</style>