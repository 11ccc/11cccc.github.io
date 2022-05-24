<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchBoxHandler">
    <!-- 使用 view 组件模拟 input 输入框的样式，并不会在页面上渲染真正的 input 输入框 -->
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}">
      <!-- 图标 -->
      <!-- 使用 uni-ui 提供的图标组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <!-- 文本 -->
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    // 为增强组件的通用性，我们允许使用者自定义搜索组件的 背景颜色 和 圆角尺寸
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      }
    },
    data() {
      return {

      };
    },
    methods:{
      // 事件处理函数：
      
      // 点击模拟的 input 输入框
      searchBoxHandler(){
        console.log('okkkkk');
        // 通过 $emit() 触发自定义事件
        // 触发外界通过 @my-search-click 绑定的 click 事件处理函数
        this.$emit('my-search-click')
      }
    } 
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // 移除背景颜色，改由 props 属性控制
    // background-color: #C00000;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .my-search-box {
      height: 36px;
      background-color: #ffffff;
      // 移除圆角尺寸，改由 props 属性控制
      // border-radius: 15px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
