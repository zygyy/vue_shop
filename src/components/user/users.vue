<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽:可以获取对应的数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q'
export default {
  data() {
    //邮箱的验证规则
    var checkEmail=(rule,value,cb)=>{
        const regEamil=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEamil.test(value)){
          return cb()
        }else{
          cb(new Error('请输入合法的邮箱'))
        }
    }

    //手机号验证规则
    var checkMobile=(rule,value,cb)=>{
        const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return cb()
        }else{
          cb(new Error('请输入合法的手机号码'))
        }
    }
    return {
      //获取用户列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单的验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户名称长度在3到10个字符",
            trigger: "blur"
          }
        ],
        password:[
           {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: "密码长度在6到12个字符",
            trigger: "blur"
          }
        ],
        email:[
           {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator:checkEmail,
            trigger: "blur"
          }
          
        ],
        mobile:[
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator:checkMobile,
            trigger: "blur"
          }
          
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: result } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (result.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败！");
      } else {
        this.userlist = result.data.users;
        this.total = result.data.total;
      }
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      } else {
        this.$message.success("更新用户状态成功！");
      }
    },
    //监听添加用户对话框关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮,添加新用户
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        console.log(valid)
        if(!valid){
          return 
        }else{
          //添加用户的请求
       const {data:res}=await this.$http.post('users',this.addForm)
           if(res.meta.status!==201){
             return this.$message.error("添加用户消息失败！");
           }else{
             this.$message.success("添加用户信息成功！");
             this.addDialogVisible=false;
             this.getUserList();
           }
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>