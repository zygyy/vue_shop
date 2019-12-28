<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form :rules="loginFromRules" :model="loginFrom" label-width="0px" class="login_form">
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
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
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
        username: "",
        password: ""
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
        password: [{
            required: true,
            message: "请输入账号密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "长度在6到15个字符",
            trigger: "blur"
          }]
      }
    };
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