<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>

    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  // ❤ 如何将用户选择的收货地址存储到 vuex 中,而不是存储到组件的 data 里面
  // ❤1 按需导入 mapState 和 mapMutations 这两个辅助函数
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'

  export default {
    name: "my-address",
    computed: {
      // // 定义收货详细地址的计算属性
      // addstr() {
      //   // 先判断 address 对象是否是一个空对象
      //   if (!this.address.provinceName) return ''
      //   // 拼接 省，市，区，详细地址 的字符串，并返回给用户，渲染到页面上
      //   return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      // },
      // ❤2.2 把 m_user 模块中的 address 对象映射到当前组件中使用，代替 data 中的 address 对象
      ...mapState('m_user', ['address']),
      // 将 m_user 模块中 addstr 映射到当前组件中使用
      ...mapGetters('m_user',['addstr'])
    },
    data() {
      return {
        // 收货地址
        // ❤2.1 注释掉下面的 address 对象，使用 2.2 中的代码代替之
        // address: {}
      };
    },
    methods: {
      // 选择收货地址
      async chooseAddress() {
        // const res = await uni.chooseAddress().catch(err => err)
        // console.log(res);

        const [err, succ] = await uni.chooseAddress().catch(err => err)
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          // console.log(succ);

          // ❤3.2 把下面这行代码注释掉，使用 3.3 中的代码代替之
          // this.address = succ

          // ❤3.3 调用 Store 中提供的 方法，将 address 保存到 Store 里面
          this.updateAddress(succ)
        }
        
        // console.log(err);
      },
      // ❤3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
      ...mapMutations('m_user', ['updateAddress'])
    }
  }
</script>

<style lang="scss">
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }

  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-right {
        display: flex;
        justify-content: space-between;
      }
    }

    .row2 {
      display: flex;
      // justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .row2-left {
        // 文本不换行
        white-space: nowrap;
      }
    }
  }
</style>
