<template>
  <el-container class="home_container">
    <el-header>
      <div class="el_header_one">
        <img src="../../assets/imgs/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isShow?'64px':'200px'">
        <!-- 折叠菜单按钮 -->
        <div class="toggle_botton" @click="toggle_change">| | |</div>
        <!-- 侧边栏菜单 -->
        <el-row class="tac">
          <el-col>
            <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eff"
              unique-opened
              :collapse="isShow"
              :collapse-transition="false"
              :router="true"
              default-active="activePath"
            >
              <!-- 一级菜单left -->
              <el-submenu :index="item.id + ''" v-for="item in oneList" :key="item.id">
                <template slot="title">
                  <i :class="iconObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单left -->
                <el-menu-item
                  :index="'/' +items.path"
                  v-for="items in item.children"
                  :key="items.id"
                  @click="click_menu_item('/' +items.path)"
                >
                  <template slot="title">{{items.authName}}</template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!-- main区域 -->
      <el-main>
        <!-- 右侧占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      oneList: [],
      iconObj: {
        125: "el-icon-user",
        103: "el-icon-lock",
        101: "el-icon-shopping-bag-1",
        102: "el-icon-tickets",
        145: "el-icon-data-line",
      },
      isShow: false,
      // 暂存左侧被选中的菜单路由地址
      activePath:''
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    // 点击退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单数据
    async getMenuList() {
      await this.$axios.get("menus").then((res) => {
        // console.log(res);
        this.oneList = res.data.data;
      });
    },
    // 点击折叠左侧菜单
    toggle_change() {
      this.isShow = !this.isShow;
    },
    click_menu_item(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>
<style lang="less" scoped>
#app {
  height: 100%;
}
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 22px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 30px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle_botton {
    width: 100%;
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
