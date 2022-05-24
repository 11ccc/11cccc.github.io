<template>
  <view>
    <!-- 使用自定义组件：my-search 搜索组件 -->
    <view class="search-box">
      <my-search @my-search-click="gotoSearch"></my-search>
    </view>
    
    <!-- 轮播图的区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
      <!-- <swiper-item>
        <view class="swiper-item"></view>
      </swiper-item> -->
    </swiper>

    <!-- 分类导航的区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src" mode=""></image>
      </view>
    </view>

    <!-- 首页楼层的区域 -->
    <!-- 楼层的盒子 -->
    <view class="floor-list">
      <!-- 每一个楼层的 item 项 -->
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <!-- 楼层标题 -->
        <image class="floor-title" :src="item.floor_title.image_src"></image>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧大图片盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片盒子 -->
          <view class="right-img-box">
            <!-- 循环渲染 4 个小图片 -->
            <navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
              <image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 1.这是轮播图的数据列表，默认为空数组
        swiperList: [],
        // 首页导航的数据列表
        navList: [],
        // 首页楼层的数据列表
        floorList: [],
      };
    },
    onLoad() {
      // 3.在小程序页面刚加载的时候，调用获取轮播图数据的方法
      this.getSwiperList()
      // 调用获取分类导航数据的方法
      this.getNavList()
      // 调用获取楼层列表数据的方法
      this.getFloorList()
    },
    // 在 vue 语法中，所有的方法和事件处理函数都应该定义在 methods 节点中。
    methods: {
      // 2.定义一个 获取轮播图数据的方法
      async getSwiperList() {
        // 2.1 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // console.log(res);
        // 2.2 请求失败
        if (res.meta.status !== 200) {
          // return uni.showToast({
          //   title: '数据请求失败！',
          //   duration: 2000,
          //   icon: 'none'
          // })

          return uni.$showMsg()
        }
        // 2.3 请求成功
        this.swiperList = res.message
        uni.$showMsg('数据加载成功！')
      },
      // 定义获取分类导航数据的方法
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 定义获取楼层列表数据的方法
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()

        // 楼层数据请求成功之后，通过双层 forEach 循环，处理点击楼层图片跳转到商品列表页的 URL 地址
        res.message.forEach((floor) => {
          floor.product_list.forEach((prod) => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })

        this.floorList = res.message
      },


      // 所有的事件处理函数：
      // nav-item 项被点击时候的事件处理函数
      navClickHandler(item) {
        // 判断点击的是哪个 nav
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 点击 home 页面顶部的“搜索”，跳转到 top_SPsearch 搜索页面的事件处理函数
      gotoSearch(){
        uni.navigateTo({
          url:'/subpkg/top_SPsearch/top_SPsearch'
        })
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .floor-img-box {
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-item {
    margin: 15rpx 10rpx;
  }
  
  .search-box{
    // 设置定位效果为“吸顶”
    position: sticky;
    // “吸顶”的位置
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
</style>
