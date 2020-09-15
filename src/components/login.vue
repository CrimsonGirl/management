<template>
  <div class="login">
    <!-- 登录框框 -->
    <div class="login_from">
      <!-- 登录页面头像 -->
      <div class="login_img">
        <img class="div_login_img_item" src="../assets/imgs/login.jpg" alt />
      </div>
      <!-- 表单 -->
      <el-form :model="loginFrom" ref="loginFromRef" :rules="loginFromRules" class="demo-ruleForm">
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginFrom.username"></el-input>
        </el-form-item>
        <br />
        <br />
        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginFrom.password" type="password"></el-input>
        </el-form-item>
        <br />
        <br />
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button class="el_button_from" type="primary" @click="login">登录</el-button>
          <el-button class="el_button_from" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginFrom: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则对象
      loginFromRules: {
        username: [
          // 是否必填，若错误返回的信息，当blur事件触发是调用此验证
          { required: true, message: "请输入用户名", trigger: "blur" },
          // 最少3个字，最多5个
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
        password: [
          // 是否必填，若错误返回的信息，当blur事件触发是调用此验证
          { required: true, message: "请输入密码", trigger: "blur" },
          // 最少3个字，最多5个
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮
    resetForm() {
      // console.log(this)
      this.$refs.loginFromRef.resetFields();
    },
    login() {
      this.$refs.loginFromRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return;
        // post('请求地址'，请求参数)
        // this.$axios.post('login',this.loginFrom)的返回值是一个promise，所以可以用async和await来简化promise
        await this.$axios.post("login", this.loginFrom).then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("登录失败☹");
          this.$message.success("登陆成功！");
          // 将登陆成功之后的token保存到客户端的sessionStorage中   ("键"，值)
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.push({
            path: '/Home',
          });
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.login {
  width: 100%;
  height: 100vh;
  background: rgb(11, 30, 59);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_from {
  width: 30%;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  // display: flex;
  // justify-content: left;
  .demo-ruleForm {
    padding: 0 30px;
    position: absolute;
    top: 42%;
    width: 500px;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.login_img {
  width: 150px;
  height: 150px;
  border: 1px solid rgb(245, 245, 245);
  box-shadow: 0 0 10px #ddd;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;
  .div_login_img_item {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.el_button_from {
  width: 100px;
  height: 50px;
}
</style>
