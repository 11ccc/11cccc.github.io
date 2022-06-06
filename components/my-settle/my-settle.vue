<template>
  <view class="my-settle-container">
    <!-- “全选” -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- “合计” -->
    <view class="amount-box">
      合计：<text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>

    <!-- “结算”按钮 -->
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'

  export default {
    name: "my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      },

      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
      };
    },
    methods: {
      // 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
      ...mapMutations('m_user', ['updateRedirectInfo']),

      // label 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        // console.log(!this.isFullCheck);
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // “结算”按钮的点击事件处理函数
      settlement() {
        // 1.先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')

        // 2.再判断用户是否选择了收货地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址!')

        // 3.最后判断用户是否登陆了
        // if (!this.token) return uni.$showMsg('请先登录!')

        if (!this.token) return this.delayNavigate()

        // 4. 实现微信支付功能
        this.payOrder()
      },

      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒之后自动跳转到登录页',
          mask: true,
          duration: 1500
        })
      },
      // 延时导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3

        // 1. 展示提示消息，此时 seconds 的值等于3
        this.showTips(this.seconds)

        // 2. 创建定时器，每隔 1 秒执行一次
        // 2.1 将定时器的 Id 存储到 timer 中
        this.timer = setInterval(() => {
          this.seconds--
          // 2.2 判断秒数是否 <=0
          if (this.seconds <= 0) {
            // 2.3 清除定时器
            clearInterval(this.timer)
            // 2.4 跳转到 my 页面
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            // 2.5 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }

          this.showTips(this.seconds)
        }, 1000)
      },
      // 微信支付
      async payOrder() {
        // 1.创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格
          // order_price: '',
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          // goods: []
          goods: this.cart.filter(item => item.goods_state).map((item) => {
            return ({
              goods_id: item.goods_id,
              goods_number: item.goods_count,
              goods_price: item.goods_price
            })
          })
        }
        // 1.2 发起请求，创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
        // console.log(orderNumber);

        // 2.订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } =
        await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // console.log(res2);
        // 2.2 预付订单生成失败
        if (res.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')

        // 2.3 得到订单支付相关的必要参数
        // const payInfo = res2.message.pay
        // console.log(payInfo);

        // 3.发起微信支付
        // 3.1 调用 uni.requestPayment()，发起微信支付
        // const [err, succ] = await uni.requestPayment(payInfo)
        const [err, succ] = await uni.requestPayment({
          "timeStamp": "1564730510",
          "nonceStr": "SReWbt3nEmpJo3tr",
          "package": "prepay_id=wx02152148991420a3b39a90811023326800",
          "signType": "MD5",
          "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
        })
        // console.log(err, succ);
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        // 3.4 检测到订单未支付
        if (res.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单完成支付
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    // 固定定位
    position: fixed;
    // 定位的位置
    // 距离页面的底部、左边是什么位置
    bottom: 0;
    left: 0;
    // 固定的宽度和高度
    width: 100%;
    height: 50px;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      // 文本纵向居中
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      // 文本横向居中
      text-align: center;
    }
  }
</style>
