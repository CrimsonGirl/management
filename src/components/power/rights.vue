<template>
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <!-- 表格内容 -->
      <template>
        <el-table :data="powerRightsList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
           <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
           </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      powerRightsList: [], // 权限列表  所有数据
    };
  },
  created() {
    this.power_RightsList();
  },
  methods: {
    async power_RightsList() {
      await this.$axios.get("rights/list").then((res) => {
        // console.log(res);
        this.powerRightsList = res.data.data;
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>