<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFromRef"
        :rules="loginFromRules"
        :model="loginFrom"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      //表单验证规则
      loginFromRules: {
        username: [
          {
            required: true,
            message: "请输入用户名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在3到10个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入账号密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //重置功能
    resetLoginForm() {
      this.$refs.loginFromRef.resetFields();
    },
    //登录功能
    login() {
      // 预验证，先获取引用对象，在调用validate函数
      this.$refs.loginFromRef.validate(async valid => {
        //console.log(valid)
        if (!valid) {
          return;
        } else {
          const { data: result } = await this.$http.post(
            "login",
            this.loginFrom
          );
          if (result.meta.status !== 200) {
            return this.$message.error("登录失败！");
          } else {
            this.$message.success("登录成功！");
            //1.将登录成功之后的token，保存到客户端的sessionStorage中
            //  1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //  1.2 token 只应该在当前网站打开期间生效，所以将token保存到sessionStorage中
            window.sessionStorage.setItem("token",result.data.token);
            //2.通过编程式导航跳转到后台主页
            this.$router.push("/home");
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: aqua;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #2b4b6b;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>