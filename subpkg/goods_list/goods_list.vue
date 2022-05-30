<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoGoodsDetail(goods)">
        <!-- <my-goods :gItem="goods"></my-goods> -->

        <!-- 循环渲染每一个商品的 Item 项。建议在外面包裹一层 <block></block>标签，在 <block></block>标签 上面做循环操作 -->
        <!-- 在实现点击商品 item 跳转到详情页面功能时，需要把 block 组件修改为 view 组件，并绑定 click 点击事件处理函数 -->

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
              <view class="goods-price">￥ {{goods.goods_price | tofixed}}</view>
            </view>
          </view>
        </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 该数据节点是为了方便发起请求，获取商品列表的数据，根据接口的要求，事先定义一个请求参数对象：
        // 请求参数对象
        queryObj: {
          // 查询关键字
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数据条数，用来实现分页
        total: 0,
        // 为了防止某些商品的图片不存在，需要在 data 中定义一个默认的图片，在页面渲染时按需使用
        // 默认的图片
        defaultPic: 'https://img13.360buyimg.com/n1/jfs/t1/111861/10/17615/161530/614bd888E7107432d/853539706df4cbf3.jpg',
        // 定义节流阀
        // 是否正在请求数据
        // 默认值为 false，表示当前没有请求其他的数据；true表示当前正在请求数据，不应该发起额外的请求
        isloading: false
      };
    },
    onLoad(options) {
      // console.log(options); // options 页面跳转时候所携带的参数可以通过options来进行接收

      // 将页面跳转时携带的页面参数，转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // console.log(this.queryObj);

      // 调用：获取商品列表数据的方法
      this.getGoodsList()
    },
    methods: {
      // 以下都是自定义方法：
      // 获取商品列表数据
      async getGoodsList(cb) {
        // 在请求数据前后，分别打开和关闭节流阀
        this.isloading = true

        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        cb && cb()

        if (res.meta.status !== 200) return uni.$showMsg()
        // this.goodsList = res.message.goods
        // this.total = res.message.total

        // ❤3 当列表数据请求成功之后，进行新旧数据的拼接处理：
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },

      // 以下都是事件处理函数：
      gotoGoodsDetail(goods) {
        // 跳转到商品详情页面
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    // 和 methods 节点平级，声明一个事件（ onReachBottom 事件处理函数），用来监听当前页面的上拉触底行为
    // ❤3 触底的事件
    onReachBottom() {
      // 数据是否加载完毕，如果加载完毕，则不必要再发起数据请求了
      // 判断是否还有下一页数据
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')

      // 根据节流阀的状态，来决定是否发起请求
      // 判断是否正在请求其他数据，如果是，则不发起额外的数据请求
      if (this.isloading) return

      // 触发 onReachBottom 的时候，让页码值自增 +1
      this.queryObj.pagenum++
      // 重新获取列表数据。即调用 getGoodsList() 方法
      this.getGoodsList()
    },
    // 和 methods 节点平级，声明 onPullDownRefresh 事件处理函数，用来监听当前页面的上拉刷新行为
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []

      // 重新发起网络请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
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
