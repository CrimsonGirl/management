<template>
  <div class="home">
    <h1>首页</h1>
    <el-button type="primary" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
};
</script>
