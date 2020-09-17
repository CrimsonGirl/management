<template >
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <el-button type="primary">主要按钮</el-button>
      <!-- 表格 -->
      <template>
        <el-table :data="powerRolesList" stripe style="width: 100%">
          <!-- 展开的权限详情 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 权限详情布局 -->
              <el-row
                :class="['dbbuttom',i1 == 0?'dbtop':'','vcenter']"
                v-for="(item1,i1) in scope.row.children"
                :key="item1.id"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="click_tag_delete(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级、三级权限 -->
                <el-col :span="19">
                  <el-row
                    :class="[i2 === 0 ? '':'dbtop','vcenter']"
                    v-for="(item2,i2) in item1.children"
                    :key="item2.id"
                  >
                    <!-- 二级 -->
                    <el-col :span="6">
                      <el-tag
                        closable
                        type="success"
                        @close="click_tag_delete(scope.row,item2.id)"
                      >{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                      <el-tag
                        :class="[i3 == 0?'':'']"
                        closable
                        v-for="(item3,i3) in item2.children"
                        :key="item3.id"
                        type="warning"
                        @close="click_tag_delete(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="click_show_rightsDialog(scope.row)"
              >分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightsDialog" width="50%" @close="rightsDialogClose">
      <!-- 所有权限  树形控件 -->
      <el-tree
        :data="rightsAllList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="click_rightsDialog_yesbuttom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerRolesList: [], // 角色管理 列表所有数据
      rightsDialog: false, // 权限分配 对话框 的显示和隐藏
      roleId:'',            // 点击权限分配 获得的当前角色的id
      rightsAllList: [], // 所有权限数据
      treeProps: {
        //  接受 树形控件 的 内容
        children: "children",
        label: "authName",
      },
      defaultKeys: [], // 默认选中的节点 id值数组
    };
  },
  created() {
    this.power_RolesList();
  },
  methods: {
    async power_RolesList() {
      await this.$axios.get("roles").then((res) => {
        // console.log(res);
        this.powerRolesList = res.data.data;
      });
    },
    // 点击 tag 的删除图标 触发的事件
    click_tag_delete(role, rightsId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          await this.$axios
            .delete(`roles/${role.id}/rights/${rightsId}`)
            .then((res) => {
              // console.log(res)
              role.children = res.data.data;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击 显示 分配权限的 对话框
    async click_show_rightsDialog(role) {
        this.roleId = role.id
      // 获取所有权限
      await this.$axios.get("rights/tree").then((res) => {
        // console.log(res);
        this.rightsAllList = res.data.data;
      });

      // 递归获取三级节点 id
      this.get_ThreeRights_id(role, this.defaultKeys);
    //   console.log(role)
    //   console.log(this.defaultKeys)
      this.rightsDialog = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到数组defaultKeys中
    get_ThreeRights_id(node, arr) {
      // 判断：如果node不包含children就说明是三级权限
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.get_ThreeRights_id(item, arr));
    },
    // 分配权限 关闭时 触发的事件
    rightsDialogClose(){
        this.defaultKeys = []
    },
    // 点击 权限分配 对话框 的 确认按钮
    async click_rightsDialog_yesbuttom(){
      
      
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys)
        const idStr = keys.join(',')
        await this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res=>{
            console.log(res)
            this.power_RolesList()
        })
        this.rightsDialog = false
    }
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 5px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbuttom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>