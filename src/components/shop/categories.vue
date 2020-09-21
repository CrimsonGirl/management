<template>
  <div>
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="show_addCate_dialog">添加分类</el-button>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="shopCategoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="adress">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="shop_category_list_Params.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="shop_category_list_Params.pagesize"
          :total="cateTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" width="50%">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        @close="addCate_dialog_close"
      >
      <!-- 输入框 -->
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="父级分类:">
          <div class="block">
              <!-- :options="ParentCateList"  指定数据源 -->
             <!-- :props -- 用来指定配置对象 -->
            <el-cascader
              v-model="selectedKeys"
              :options="ParentCateList"
              :props="cascaderProps"
              @change="cateChange"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate_dialog_yesbutton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shopCategoryList: [], // 商品分类 表格 数据
      columns: [  // 为 table指定 列的定义
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", //  表示当前 定义列为 模板列
          template: "isok", // 此模板列 名称
        },
        {
          label: "排序",
          type: "template", //  表示当前 定义列为 模板列
          template: "order", // 此模板列 名称
        },
        {
          label: "操作",
          type: "template", //  表示当前 定义列为 模板列
          template: "adress", // 此模板列 名称
        },
      ],
      shop_category_list_Params: {
        type: "",
        pagenum: 1,
        pagesize: 5,
      },
      cateTotal: 0, // 获取商品分类的总条数
      addCateDialog: false, // 添加分类对话框的 显示和隐藏
      addCateForm: {  // 添加分类 对话框 表单数据 对象
        
        cat_name: "", // 将要添加的分类的名称
        cat_pid: 0, // 将要添加的分类的父级分类的id
        cat_level: 0, // 将要添加的分类的等级
      },
      addCateFormRules: {    // 将要添加的分类 的 验证
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      ParentCateList: [], // 获取到的 父级商品分类
      cascaderProps:{  // 级联选框的props配置对象
        expandTrigger:'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectedKeys:[],  // 被选中的 父级分类的 id 数组
    };
  },
  created() {
    this.shop_category_Alllist();
  },
  methods: {
    async shop_category_Alllist() {
      await this.$axios
        .get("categories", {
          params: this.shop_category_list_Params,
        })
        .then((res) => {
          // console.log(res)
          this.shopCategoryList = res.data.data.result;
            // console.log(res.data.data.total);
          this.cateTotal = res.data.data.total;
        });
    },
    // 监听 pageSize 变化
    handleSizeChange(newSize) {
      this.shop_category_list_Params.pagesize = newSize;
      this.shop_category_Alllist();
    },
    // 监听 pageNum 变化
    handleCurrentChange(newNum) {
      this.shop_category_list_Params.pagenum = newNum;
      this.shop_category_Alllist();
    },
    // 点击添加分类 显示对话框
    show_addCate_dialog() {
      this.getParentCate(); // 获取父级分类的数据
      this.addCateDialog = true;
    },
     // 获取父级分类的数据
    async getParentCate() {
      await this.$axios
        .get("categories", {
          params: {
            type: 2,
          },
        })
        .then((res) => {
          // console.log(res)
          this.ParentCateList = res.data.data;
          // console.log(this.ParentCateList);
        });
    },
    // 选择父级的选择器内容发生变化时
    cateChange(){
      console.log(this.selectedKeys)
      // 如果selectedKeys 数组中的 length 大于 0 ，则说明有选中的父级分类
      // 反之，则说明 未选中父级分类，添加的分类就是父级
      if(this.selectedKeys.length> 0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level =  0
      }
    },
    addCate_dialog_yesbutton(){
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid) return
        await this.$axios.post('categories',this.addCateForm).then(res=>{
          console.log(res)
        })
      })
      this.addCateDialog = false
    },
    // 添加分类 对话框 关闭时  触发
    addCate_dialog_close(){
      this.$refs.addCateFormRef.resetfields();  // 重置表单
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
    // methods
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>