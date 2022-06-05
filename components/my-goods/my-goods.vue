<template>
  <!-- 把商品 item 项封装为自定义组件 -->
  <!-- 1、将 goods_list 页面中，关于商品 item 项相关的 UI 结构、样式、data数据，封装到 my-goods 自定义组件中 -->
  <!-- 2、在 goods_list 组件中，循环渲染 my-goods 组件即可 -->


  <view class="goods-item">
    <!-- 左侧商品图片盒子 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
      <image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 右侧商品信息盒子 -->
    <view class="goods-item-right">
      <!-- 商品名字 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <!-- 商品价格 -->
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "goods_item",
    // 定义 props 属性节点，用来接受外界传递到当前组件的数据
    props: {
      // 封装自定义组件最主要的一点是：在 props 节点下，封装 goods 自定义属性。外界就可以通过 goods 这样一个属性，把当前商品的信息传到组件内部，在自定义组件内部，可以基于 goods 属性，来渲染商品的 item 项。外界在使用 my-goods 自定义组件的时候，就可以通过 :goods 的形式，给 my-goods 自定义组件传递一个动态的属性绑定，把当前的商品循环 item 项传递进来，这样在 my-goods 组件内部，就自动将商品的信息给渲染出来了。
      // 商品的信息对象
      goods: {
        type: Object,
        default: {}
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
        default: false,
      },
      // 是否展示价格右侧的 NumberBox 组件
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 为了防止某些商品的图片不存在，需要在 data 中定义一个默认的图片，在页面渲染时按需使用
        // 默认的图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // 这是 radio 组件的点击事件处理函数
      radioClickHandler() {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          // 商品的最新勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      // 这是 uni-number-box 组件的 change 事件处理函数
      // 监听到了 uni-number-box 组件数量变化的事件
      numChangeHandler(val) {
        // console.log(val);
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: val - 0
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;

    .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        // 为了防止图片下面有一定距离的空白间隙
        display: block;
        margin-right: 5px;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      // 占满剩余区域
      flex: 1;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          color: #C00000;
          font-size: 16xp;
        }
      }
    }
  }
</style>
