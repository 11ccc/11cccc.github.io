<template>
  <view>
    <view class="login-container">
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <!-- 登录按钮 -->
      <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
      <!-- 登录提示 -->
      <text class="tips-text">登录后尽享更多权益</text>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-login",
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的 redirectInfo 映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo'])
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

      // 用户授权之后，获取用户的基本信息
      async getUserProfile() {
        await uni.getUserProfile({
          desc: '您的授权信息',
          success: (res) => {
            // console.log(res);
            // console.log(res.userInfo);

            this.updateUserInfo(res.userInfo)

            // 预调用 this.getToken() 方法，同时把获取到的用户信息传递进去：
            // 获取登录成功后的 Token 字符串
            this.getToken(res)
          },
          fail: (res) => {
            // console.log(res);
            return uni.$showMsg('您取消了登录授权!')
          }
        })
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口，获取 code 对应的值
        const [err, res] = await uni.login().catch(err => err)
        // console.log(res);

        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆失败!')
        // console.log(res.code);
        // console.log(info);

        // 准备请求参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          rawData: info.rawData,
          iv: info.iv,
          signature: info.signature
        }
        // console.log(query);

        // 换取 token
        // const resul = uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log(resul);
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log(loginResult);

        if (loginResult.meta.status === 200) return uni.$showMsg('登录失败!')
        // uni.$showMsg('登录成功!')

        // 直接把 Token 保存到 vuex 中
        // this.updateToken(loginResult.message.token)
        this.updateToken(
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
          )

        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  // 登录盒子的样式
  .login-container {
    height: 750rpx;
    // background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // position: relative;
    // overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    // &::after {
    //   content: '';
    //   // 块转化
    //   display: block;
    //   // 块转化之后，需要给定一个高度和宽度
    //   width: 100%;
    //   height: 40px;
    //   background-color: #f8f8f8;
    //   // 对 after 伪元素进行定位。子绝父相
    //   position: absolute;
    //   // 伪元素定位的位置。距离父盒子底部、左侧的位置
    //   bottom: 0;
    //   left: 0;
    //   // 实现椭圆的造型
    //   border-radius: 100%;
    //   // 将椭圆进行定位，只展示椭圆的上半部分，下半部分隐藏：
    //   // 往下，移他自身高度的 50%
    //   transform: translateY(50%);
    //   // 给父元素添加 overflow 样式，把超出部分的伪元素给隐藏掉
    // }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }

  }
</style>
