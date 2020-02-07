<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 卡片视图 -->
      <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          :tab-position="'left'"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!-- action是图片上传地址 -->
            <el-upload
              :on-success="handleSuccess"
              :headers="headersOBJ"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      //图片上传地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //图片上传组件的请求头
      headersOBJ: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewVisible: false,
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品分类所属的分类数组
        goods_cat: [],
        //图片数组
        pics: [],
        //详情
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur"
          }
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur"
          }
        ]
      },
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      //动态参数列表
      manyTableData: [],
      //静态参数列表
      onlyTableData: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      } else {
        this.catelist = res.data;
      }
    },
    //级联选择器
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //标签页切换函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    //
    async tabClicked() {
      //访问动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败！");
        } else {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
          });
          this.manyTableData = res.data;
        }
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败！");
        } else {
          this.onlyTableData = res.data;
        }
      }
    },
    //预览图片操作
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //移除图片操作
    handleRemove(file) {
      const filepath = file.response.data.tem_path;
      const i = this.addForm.pics.findIndex(x => x.pic === filepath);
      this.addForm.pics.splice(i, 1);
    },
    //图片上传成功
    handleSuccess(response) {
      //添加pic属性,再塞到pics里面
      const picInfo = { pic: response.data.tem_path };
      this.addForm.pics.push(picInfo);
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        } else {
          //执行添加业务逻辑
          //处理goods_cat属性
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          //动态参数处理
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(" ")
            };
            this.addForm.attrs.push(newInfo);
          });
          //处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs=this.addForm.attrs
          //发起请求(商品名称唯一)
          const {data:res}=await this.$http.post('goods',form);
          if(res.meta.status!==201){
            return this.$message.error("添加商品失败！");
          }else{
            this.$message.success("添加商品成功！");
            this.$router.push('/goods') 
          }
        }
      });
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-tabs {
  margin: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
.ql-editor ql-blank {
}
</style>