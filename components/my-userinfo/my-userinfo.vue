<template>
  <view>
    <view class="my-userinfo-container">
      <!-- 头像和昵称区域 -->
      <view class="top-box">
        <image :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{ userinfo.nickName }}</view>
      </view>
    </view>

    <!-- 面板区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>

      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panel-title">我的订单</view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>

      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="right" size="15"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="right" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="right" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    name: "my-userinfo",
    computed: {
      // 将 m_user 模块中的 userinfo 映射到当前页面中使用
      ...mapState('m_user', ['userinfo'])
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),

      async logout() {
        // const res  = await uni.showModal({
        //   title: '提示',
        //   content: '确认退出登录吗？'
        // }).catch(err => err)

        // console.log(res);


        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)

        if (succ && succ.confirm) {
          // 用户确认了退出登录的操作
          // 需要清空 vuex 中的 userinfo、token 和 address
          this.updateUserInfo({})
          this.updateToken({})
          this.updateToken('')
        }
      }
    }
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    // background-color: white;

    .top-box {
      height: 400rpx;
      background-color: #C00000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .avatar {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid #FFF;
        box-shadow: 0px 1px 5px black;
      }

      .nickname {
        font-size: 16px;
        color: #FFF;
        font-weight: bold;
        margin-top: 10px;
      }
    }
  }

  .panel-list {
    padding: 0 10px;
    position: relative;
    top: -10px;

    .panel {
      background-color: #FFF;
      border-radius: 3px;
      margin-bottom: 8px;

      .panel-body {
        display: flex;
        justify-content: space-around;

        .panel-item {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
          font-size: 13px;

          .icon {
            width: 35px;
            height: 35px;
          }
        }
      }

      .panel-title {
        line-height: 45px;
        padding-left: 10px;
        font-size: 15px;
        border-bottom: 1px solid #f4f4f4;
      }

      .panel-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;
        padding: 0 10px;
        line-height: 45px;
      }
    }
  }
</style>
