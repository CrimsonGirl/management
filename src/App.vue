<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<script>
export default {
  methods:{
        _isMobile() {
            //判断当前环境是pc端还是移动端
             let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
             return flag;
        }
  },
  mounted(){
    if (this._isMobile()) {
      console.log("手机端");
      // this.$router.replace('/home1');
    } else {
      console.log("pc端");
      // this.$router.replace('/about');
    }   
  }
}
</script>

<style lang="scss">
html{
    margin: 0px;
    padding: 0px;
    height: 100%;
}
body{
    margin: 0px;
    padding: 0px;
     height: 100%;
}
#app{
  height: 100%;
  min-width: 1366px;
}
.el-breadcrumb{
  margin-bottom: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-pagination{
  margin-top: 15px;
}
</style>



