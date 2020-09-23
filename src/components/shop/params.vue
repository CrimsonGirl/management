<template>
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容卡片 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 级联选择商品分类 -->

      <div class="block">
        <span class="demonstration">选择商品分类 ：</span>
        <el-cascader
          v-model="selectedCateKeys"
          :options="ParamsCateList"
          :props="cascaderProps"
          @change="params_cascader_Change"
        ></el-cascader>
      </div>

      <!-- tab页签区域 -->
      <template>
        <!-- tab1 -->
        <el-tabs v-model="activeName" @tab-click="handle_Tabs_Click">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              size="mini"
              :disabled="isDisable"
              @click="addParamsDialog = true"
            >添加参数</el-button>
            <!-- 参数表格 -->
            <el-table :data="manyTabsDate" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                  <!-- 添加展开行内容 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                  >+ New Tag</el-button>
                </template>
              </el-table-column>
              <!-- 表格数据 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="click_tabs_editButton(scope.row.attr_id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="show_delete_messagebox(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- tab2 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="mini"
              :disabled="isDisable"
              @click="addParamsDialog = true"
            >添加属性</el-button>
            <!-- 属性表格 -->
            <el-table :data="onlyTabsDate" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand"></el-table-column>
              <!-- 表格数据 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="click_tabs_editButton(scope.row.attr_id)"
                  >编辑</el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="show_delete_messagebox(scope.row.attr_id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+dialogTitle"
      :visible.sync="addParamsDialog"
      width="50%"
      @close="add_params_dialog_closed"
    >
      <!-- 添加参数对话框中的表单 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="click_addParams_dialog_yesbutton">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改'+dialogTitle"
      :visible.sync="editDialog"
      width="50%"
      @close="edit_dialog_closed"
    >
      <!-- 点击编辑对话框中的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="click_editForm_dialog_yesbutton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ParamsCateList: [],
      // 级联选框的props配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   被选中的父级id
      selectedCateKeys: [],
      activeName: "many", // 默认显示 name="frist" 的页签
      // 动态参数
      manyTabsDate: [],
      // 静态属性
      onlyTabsDate: [],
      // 添加参数对话框的隐现
      addParamsDialog: false,
      // 添加参数表单 对象
      addParamsForm: {
        attr_name: "",
      },
      // 要添加的参数名称的验证
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改对话框中的表单对象
      editForm: {},
      // 修改对话框中的表单验证
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制 修改对话框的隐现
      editDialog: false,
    };
  },
  created() {
    this.getParams_CateList();
  },
  methods: {
    // 所有一级、二级、三级分类
    getParams_CateList() {
      this.$axios.get("categories").then((res) => {
        // console.log(res)
        this.ParamsCateList = res.data.data;
      });
    },
    // 级联选择器内容变化时
    params_cascader_Change() {
      // console.log(this.selectedCateKeys);
      this.get_params_List();
    },
    // Tab标签 点击事件
    handle_Tabs_Click() {
      // console.log(this.activeName);
      this.get_params_List();
    },
    // 获取参数列表
    async get_params_List() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      await this.$axios
        .get(`categories/${this.get_cate_id}/attributes`, {
          params: {
            sel: this.activeName,
          },
        })
        .then((res) => {
          if (this.activeName == "many") {
            this.manyTabsDate = res.data.data;
            this.manyTabsDate.forEach((item) => {
              item.inputVisible = false;
            item.inputValue = "";
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            
          });
          } else {
            this.onlyTabsDate = res.data.data;
          }
          // console.log(this.manyTabsDate)
          // console.log(this.onlyTabsDate)
          
          // console.log(res.data.data);
        });
    },
    // 点击 添加参数 对话框 的 确定按钮
    async click_addParams_dialog_yesbutton() {
      await this.$axios
        .post(`categories/${this.get_cate_id}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
        })
        .then((res) => {
          console.log(res + '点击添加参数对话框的 确定按钮');
        });
      this.get_params_List();

      this.addParamsDialog = false;
    },
    // 当 添加参数对话框 关闭时  --  重置
    add_params_dialog_closed() {
      this.$refs.addParamsFormRef.resetFields();
    },
    // 编辑对话框关闭时  --  重置
    edit_dialog_closed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击 编辑按钮 对话框中 的确定按钮
    click_editForm_dialog_yesbutton() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid)   --  true or false
        if (!valid) return;
        await this.$axios
          .put(
            `categories/${this.get_cate_id}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          .then((res) => {
            console.log(res);
            this.get_params_List();
          });
      });

      this.editDialog = false;
    },
    // 点击 编辑 按钮
    async click_tabs_editButton(id) {
      // 根据id查询参数  的接口
      await this.$axios
        .get(`categories/${this.get_cate_id}/attributes/${id}`, {
          params: {
            attr_sel: this.activeName,
          },
        })
        .then((res) => {
          this.editForm = res.data.data;
          // console.log(this.editForm);
        });
      this.editDialog = true;
    },
    // 点击删除按钮 显示 确认删除的messageBox弹框
    show_delete_messagebox(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`categories/${this.get_cate_id}/attributes/${id}`)
            .then((res) => {
              console.log(res);
              this.get_params_List();
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展开行 添加内容 输入框输入完成 时
    handleInputConfirm(row) {
      console.log(row);
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      // this.$set(row,row.inputVisible,false)
    },
    // 点击 展开行 添加内容 的 按钮  展示输入框
    showInput(row) {
      // console.log(row)
      row.inputVisible = true;
      // this.$nextTick 方法：页面重新渲染后才执行回调函数中的代码
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // methods
  },
  computed: {
    // 若 需要按钮禁用 则返回true 反之 则返回false
    isDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 获取父级id  以用 请求接口 的参数 :id
    get_cate_id() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 动态设置 对话框 title 以及table
    dialogTitle() {
      if (this.activeName == "many") {
        return "参数名称 ：";
      } else {
        return "属性名称 ：";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>