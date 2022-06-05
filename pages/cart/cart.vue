<template>
  <!-- 购物车页面 -->

  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>

    <!-- 购物车商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop-filled" size="18"></uni-icons>
      <!-- 右侧的描述文本 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 商品列表区域 -->
    <!-- ❤1-2 在 UI 结构中，通过 v-for 指令循环渲染自定义的 my-goods 组件 -->
    <!-- uni-swipe-action 是最外层包裹性性质的容器 -->
    <uni-swipe-action>
      <block v-for="(goods,i) in cart" :key="i">
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 right-options 属性来指定按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods.goods_id)">
          <my-goods :goods="goods" :show-radio="true" :showNum="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 使用自定义的结算组件 -->
    <my-settle></my-settle>
  </view>

  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image class="empty-img" src="/static/cart_empty@2x.png"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'

  // ❤1渲染商品列表区域的基本结构
  // ❤1-1 通过 辅助函数，将 Store 中的 cart 数组映射到当前页面中使用
  // ❤1-1-1 按需导入 这个辅助函数
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed: {
      // ❤1-1-2 将 m_cart 模块中的 cart 数组映射到当前页面中使用
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#C00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),

      // 商品的勾选状态发生了变化
      radioChangeHandler(e) {
        // console.log(e);
        this.updateGoodsState(e)
      },
      // 商品的数量发生了变化
      numberChangeHandler(e) {
        // console.log(e);
        this.updateGoodsCount(e)
      },
      // 点击了滑动操作按钮
      swipeActionClickHandler(goods_id) {
        // console.log(goods);
        this.removeGoodsById(goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #EFEFEF;

    .cart-title-text {
      font-size: 14px;
      margin-left: 10px;
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      fontsi: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
