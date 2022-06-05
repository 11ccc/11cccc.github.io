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
    <view class="btn-settle">结算({{ checkedCount }})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'

  export default {
    name: "my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      }
    },
    data() {
      return {

      };
    },
    methods: {
      // 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // label 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        // console.log(!this.isFullCheck);
        this.updateAllGoodsState(!this.isFullCheck)
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
