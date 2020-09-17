<template>
  <div>
    <!-- 面包屑 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片 -->
    <div>
      <el-card class="box-card">
        <!-- 卡片搜索区域 -->
        <div>
          <span>
            <el-row>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <div>
                    <el-input
                      placeholder="请输入内容"
                      v-model="Apiparams.query"
                      clearable
                      @clear="userAPI"
                    >
                      <el-button slot="append" icon="el-icon-search" @click="userAPI"></el-button>
                    </el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-row>
                    <el-button
                      type="primary"
                      style="margin-left:20px;"
                      @click="addVisible = true"
                    >添加用户</el-button>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </span>
        </div>

        <!-- 卡片表格  用户列表 -->
        <div>
          <template>
            <el-table :data="userList" style="width: 100%" border stripe>
              <el-table-column type="index" label="#" width="50"></el-table-column>
              <!-- <el-table-column prop="id" label="#" width="180"></el-table-column> -->
              <el-table-column prop="username" label="姓名" width="180"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="mobile" label="电话"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column prop="mg_state" label="状态">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.mg_state" @change="State_change(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-row>
                    <!-- 操作  修改 -->
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="clickChangeUserinfo(scope.row.id)"
                    ></el-button>
                    <!-- 操作  删除 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="click_userlist_deletedbutton(scope.row.id)"></el-button>
                    <!-- 操作  角色分配 -->
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="角色分配"
                      placement="top"
                      :enterable="false"
                    >
                      <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>

        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="Apiparams.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="Apiparams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addVisible" width="50%" @close="dialog_close">
        <!-- 添加表单框框 -->
        <el-form :model="addUserForm" :rules="addUserRules" ref="ruleFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="addUserForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="click_adduser_yesbutton">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息的对话框 -->
      <el-dialog title="修改信息" :visible.sync="changeUserinfo" width="50%" @close="close_change_userinfo">
        <el-form
          :model="findUserinfo"
          :rules="findUserinfoRules"
          ref="findUserinfoRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="findUserinfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="findUserinfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="findUserinfo.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changeUserinfo = false">取 消</el-button>
          <el-button type="primary" @click="click_changeUserInfo_yesbutton">确 定</el-button>
        </span>
      </el-dialog>
     
    </div>
  </div>
</template>
<script>
export default {
  data() {
    //   自定义表单规则
    // 邮箱验证
    // var emailR = (rule,value,cb)=>{
    //     const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    //     if(regEmail.test(value)){
    //         return cb()   // 正确
    //     }
    // }
    // // 手机号验证
    // var phoneR = (rule,value,cb)=>{
    //     const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    //     if(regMobile.test(value)){
    //         return cb()   // 正确
    //     }
    // }
    return {
      Apiparams: {
        // 接口获取参数
        query: "",
        pagenum: 1, // 当前页数
        pagesize: 5, // 当前每页显示条数
      },
      userList: [], // 用户数据列表
      total: 0, // 总数组条数
      addVisible: false, // 对话框的显示和隐藏 （添加用户）
      addUserForm: {
        // 添加用户

        username: "",
        password: "",
        email: "",
        phone: "",
      },
      // 添加用户的验证
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
      },
      changeUserinfo: false, // 修改用户信息 的对话框  显示或隐藏
      findUserinfo: {
          email:'',
          mobile:''
      }, // 查询到的用户信息
      findUserinfoRules:{
          email:[{ required: true, message: "请输入邮箱", trigger: "blur" }],
          mobile:[{ required: true, message: "请输入手机号码", trigger: "blur" }]
      },
      clickDeletedUser:false,  // 点击删除 用户信息 的对话框的显示和隐藏
    };
  },
  created() {
    this.userAPI();
  },
  methods: {
    async userAPI() {
      await this.$axios
        .get("users", {
          params: this.Apiparams,
        })
        .then((res) => {
          this.userList = res.data.data.users;
          this.total = res.data.data.total;
          // console.log(res)
          //   console.log(this.userList);
        });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      this.Apiparams.pagesize = newsize;
      this.userAPI();
      // console.log(newsize)
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.Apiparams.pagenum = newPage;
      this.userAPI();
      // console.log(newPage)
    },
    // 更新用户状态
    async State_change(scoperow) {
      //   console.log(scoperow);
      await this.$axios
        .put(`users/${scoperow.id}/state/${scoperow.mg_state}`)
        .then((res) => {
        //   console.log(res);
          if (res.data.meta.status !== 200) {
            scoperow.mg_state == !scoperow.mg_state;
          }
        });
    },
    // 当关闭添加用户对话框时
    dialog_close() {
      this.$refs.ruleFormRef.resetFields();
      // console.log(this.$refs.ruleFormRef)
    },
    // 点击确定按钮  添加新用户（添加用户的对话框）
    click_adduser_yesbutton() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return; // 不通过
        // 通过   发送网络请求  添加新用户
        await this.$axios.post("users", this.addUserForm).then((res) => {
          console.log(res);
          this.$message.success("添加用户成功");
          // 隐藏添加用户的对话框
          this.addVisible = false;
          // 刷新列表
          this.userAPI();
        });
      });
    },
    // 展示修改用户信息的对话框
    async clickChangeUserinfo(id) {
      this.changeUserinfo = true;
      console.log(id);
      await this.$axios.get("users/" + id).then((res) => {
        console.log(res);
        this.findUserinfo = res.data.data;
      });
    },
    // 修改信息 对话框 关闭时   resetFields()---重置
    close_change_userinfo(){
        this.$refs.findUserinfoRef.resetFields()
    },
    // 点击 修改框 确认按钮
    click_changeUserInfo_yesbutton(){
        this.$refs.findUserinfoRef.validate(async valid=>{
            // console.log(valid)
            if(!valid) return  // 不成功
            // console.log(this.findUserinfo)
            // 成功   然后发起 修改用户信息 的请求
            await this.$axios.put('users/' + this.findUserinfo.id,{
                email:this.findUserinfo.email,
                mobile:this.findUserinfo.mobile
            }).then(res=>{
                console.log(res)
            })
            // 更新列表
            this.userAPI();
            // 关闭对话框
            this.changeUserinfo = false
        })
    },
    // 点击 用户列表的 删除按钮
  async click_userlist_deletedbutton(id){
    // this.clickDeletedUser = true
     await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      // 点击确认删除  返回值为confirm
      // 点击取消  返回cancel
 
    this.$axios.delete('users/' + id).then(res=>{
      console.log(res)
      this.userAPI();
    })
    
  },
  //  点击 用户列表 删除按钮 的 对话框 里面的 确定删除按钮
  // click_deletedUser_dialog_yesbutton(){
    
  // }










  },
  
};
</script>









// 第35个视频