<template>
  <!-- 把商品 item 项封装为自定义组件 -->
  <!-- 1、将 goods_list 页面中，关于商品 item 项相关的 UI 结构、样式、data数据，封装到 my-goods 自定义组件中 -->
  <!-- 2、在 goods_list 组件中，循环渲染 my-goods 组件即可 -->


  <view class="goods-item">
    <!-- 左侧商品图片盒子 -->
    <view class="goods-item-left">
      <image class="goods-pic" :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 右侧商品信息盒子 -->
    <view class="goods-item-right">
      <!-- 商品名字 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <!-- 商品价格 -->
      <view class="goods-info-box">
        <view class="goods-price">￥ {{goods.goods_price}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "goods_item",
    // 定义 props 属性节点，用来接受外界传递到当前组件的数据
    props: {
      // 封装自定义组件最主要的一点是：在 props 节点下，封装 goods 属性。外界就可以通过 goods 这样一个属性，把当前商品的信息传到组件内部，在自定义组件内部，可以基于 goods 属性，来渲染商品的 item 项。外界在使用 my-goods 自定义组件的时候，就可以通过 :goods 的形式，给 my-goods 自定义组件传递一个动态的属性绑定，把当前的商品循环 item 项传递进来，这样在 my-goods 组件内部，就自动将商品的信息给渲染出来了。
      gItem: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
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

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        .goods-price {
          color: #C00000;
          font-size: 16xp;
        }
      }
    }
  }
</style>
