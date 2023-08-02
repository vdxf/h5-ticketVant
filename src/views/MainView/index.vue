<template>
  <div>
    <div>
      <router-view></router-view>
    </div>

    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/userview" icon="friends-o">用户</van-tabbar-item>
      <router-link class="image-add" to="/imagecreate" v-if='this.$route.path === "/home"'>+</router-link>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/define.scss';
.image-add {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: j(20);
  bottom: j(60);
  width: j(44);
  height: j(44);
  background-color: #EB1E23;
  box-shadow: 0 0 j(10) j(5) #0003;
  border-radius: 50%;
  color: #fff;
  font-size: j(14);
}
</style>