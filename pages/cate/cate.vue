<template>
  <view>
    <!-- 使用自定义组件：my-search 搜索组件 -->
    <!-- <my-search :bgcolor="'yellowgreen'" :radius="10"></my-search> -->
    <!-- 给自定义组件绑定点击事件，但是该自定义组件并没有提供click点击事件，所以绑定无效。 -->
    <my-search @my-search-click="gotoMySearch"></my-search>
    
    <view class="scroll-view-container">
      <!-- 左侧的滑动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-scroll-view-item',i === active ? 'active' : '']" @click="activeChange(i)">
            {{ item.cat_name }}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧的滑动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <!-- 循环渲染右侧二级分类列表 -->
        <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{ item2.cat_name }} /</view>
          <!-- 动态渲染当前二级分类下的三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <!-- 三级分类的文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // wh 是当前设备可用的高度
        wh: 0,
        // 商品分类的数据列表，默认是一个空数组
        cateList: [],
        // 左侧一级分类中的激活项
        // 当前选中项的索引，默认让第一项被选中
        active: 0,
        // 定义二级分类列表的数据节点
        // 二级分类列表
        cateLevel2: [],
        // 定义滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      // console.log(sysInfo);
      // 可用高度 = 屏幕高度 - navigationBar高度 -tabBar高度 -自定义的search组件高度
      this.wh = sysInfo.windowHeight - 50

      // 调用 获取分类列表数据的方法
      this.getCateList()
    },
    methods: {
      // 定义一个 获取分类列表数据的方法
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        // console.log(res.message);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // uni.$showMsg('数据加载完成！')

        // 为二级分类列表数据赋值
        this.cateLevel2 = res.message[0].children
      },

      // 事件处理函数：
      // 选中项改变的事件处理函数
      activeChange(i) {
        this.active = i

        // 修改 activeChanged 方法，在一级分类选中项改变之后，为二级分类列表数据重新赋值：
        // 重新为二级分类列表赋值
        this.cateLevel2 = this.cateList[i].children

        // 切换一级分类时，动态设置 scrollTop 的值：
        // 让 scrollTop 的值在 0 和 1 之间切换
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
        // 可简写成：
        // this.scrollTop = this.scrollTop ? 0 : 1
      },
      // 点击三级分类跳转到商品列表页面
      // 三级分类的 Item 项的点击事件处理函数：
      gotoGoodsList(item3){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      // 跳转到分包中的搜索页面
      gotoMySearch(){
        // console.log('ok');
        uni.navigateTo({
          url:'/subpkg/top_SPsearch/top_SPsearch'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #ffffff;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            // 往回撤自己 50% 的高度
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 15px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
