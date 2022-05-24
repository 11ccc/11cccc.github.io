<template>
  <view>
    <view class="search-box">
      <uni-search-bar :radius="100" :cancelButton="none" focus @input="input"></uni-search-bar>

      <!-- 搜索建议列表 -->
      <view class="suggest-list" v-if="searchResults.length !== 0">
        <!-- 循环渲染搜索建议列表的 item 项 -->
        <view class="suggest-item" v-for="(item,i) in searchResults" :key="i" @click="gotoGoodsDetail(item)">
          <view class="goods-name">{{ item.goods_name }}</view>
          <uni-icons type="right" size="16"></uni-icons>
        </view>
      </view>

      <!-- 搜索建议历史记录的盒子 -->
      <view class="history-box" v-else>
        <!-- 上部的标题区域 -->
        <view class="history-title">
          <text>搜索历史</text>
          <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
        </view>
        <!-- 下部的列表区域 -->
        <view class="history-list">
          <uni-tag :text="item" v-for="(item,i) in historys" :key="i" :inverted="true" @click="gotoGoodsList(item)">
          </uni-tag>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的Id timerId
        timer: null,
        // 搜索关键词
        kw: '',
        // 该数据节点，用来存放搜索建议的结果列表数据
        // 搜索结果列表
        searchResults: [],
        // 改数据节点，定义一个搜索历史的假数据
        // 搜索关键词的历史记录
        // historyList: ['a', 'apple', 'aphone']
        historyList: []
      };
    },
    computed: {
      // ❤2 针对❤1中的问题①，解决关键字前后顺序的问题
      // ❤2第一步：data中的 historyList 不做任何修改，依然使用 push 进行末尾追加；
      // ❤2第二步：定义一个计算属性 historys ，将 historyList 数组 reverse 反转之后，就是此计算属性的值
      // ❤2第三步：页面中渲染搜索关键词的时候，不再使用 data 中 historyList ，而是使用计算属性 historys
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      },
    },
    methods: {
      // 以下都是自定义方法：
      // 定义一个 方法，根据搜索关键词，搜索商品建议列表
      async getSearchResults() {
        // 判断搜索关键词是否为空
        if (this.kw.length === 0) {
          // 关键词为空，则清空搜索的结果列表
          this.searchResults = []
          return
        }

        // 发起请求，获取搜索建议列表
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        // console.log(res);
        if (res.meta.status != 200) return uni.$showMsg()
        this.searchResults = res.message

        // ❤1第二步：获取到搜索建议列表数据之后，调用 saveSearchHistory() 方法保存搜索关键词
        this.saveSearchHistory()
      },
      // ❤1 如何将搜索关键词存入 historyList
      // ❤1 下述实现思路存在问题：
      // ① 关键词前后顺序的问题（可以调用数组的 reserve() 方法对数组进行反转）
      // ② 关键词重复的问题（可以使用 Set 对象进行去重操作）
      // ❤1第一步：定义方法 -- 保存搜索关键词为历史记录
      saveSearchHistory() {
        // 直接把搜索关键词 push 到 historyList 数组的最后面
        // this.historyList.push(this.kw)

        // ❤2 针对❤1中的问题②，解决关键词重复的问题
        // 修改 saveSearchHistory 方法如下：
        // ❤2第一步：将 Array 数组转化为 Set 集合
        const set = new Set(this.historyList)
        // ❤2第二步：调用 Set 对象的delete方法，移除之前的旧元素
        set.delete(this.kw)
        // ❤2第三步：调用 Set 对象的add方法，向Set中添加元素
        set.add(this.kw)
        // ❤2第四步：将 Set 对象转化为 Array 数组
        // this.historyList = [...set]
        // 或者可以这样写：
        this.historyList = Array.from(set)

        // 调用 uni.setStorageSync(key,value) 方法，对搜索历史进行持久化存储到本地
        // 在存值期间，使用 JSON.stringify() 方法，把数组转成字符串的形式
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },

      // 以下都是事件处理函数：
      // 文本输入框的输入事件的处理函数。当用户在输入框中输入内容的时候，就会触发 input 这个事件处理函数
      input(e) {
        // console.log(e);

        // 清除 timer 对应的延时器
        clearTimeout(this.timer)

        // 首先开启/重新启动 一个延时器，并把 timerId 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果500毫秒以内，没有触发新的输入事件，就为搜索关键词赋值
          this.kw = e
          // console.log(e);

          // 在防抖的 setTimout 中，调用 方法，获取搜索建议列表数据
          // 根据关键词，查询搜索建议列表
          this.getSearchResults()
        }, 500)
      },
      // 点击搜索建议 Item 项，导航到商品详情页
      // 点击事件处理函数
      gotoGoodsDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 定义点击事件的处理函数 - 清空搜索历史记录
      cleanHistory() {
        // 清空 data 中保存的搜索历史数据列表
        this.historyList = []
        // 清空本地存储中记录的历史记录
        uni.setStorageSync('kw', '[]')
      },
      // 定义点击事件的处理函数 - 点击下部列表区域的 Item 项，跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    onLoad() {
      // 在 onLoad 生命周期函数中，加载本地存储的搜索历史记录
      // 调用 uni.getStorageSync('key对应的值') 方法，获取键对应的数据。
      // 最外层再调用 JSON.parse() 方法，把得到的字符串转化成数组
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    // “吸顶”的位置
    top: 0;
    z-index: 999;

    .suggest-list {
      padding: 0 5px;

      .suggest-item {
        display: flex;
        // 纵向居中对齐
        align-items: center;
        // 横向贴边对齐
        justify-content: space-between;
        font-size: 12px;
        padding: 13px 0;
        border-bottom: 1px solid #efefef;

        .goods-name {
          // 如何实现：超出文本，用三个小圆点来进行表示
          // 1.文字不允许换行（单行文本）
          white-space: nowrap;
          // 2.溢出部分隐藏
          overflow: hidden;
          // 3.文本溢出后，使用 ... 代替
          text-overflow: ellipsis;
        }
      }
    }

    .history-box {
      padding: 0 5px;

      .history-title {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        font-size: 13px;
        border-bottom: 1px solid #efefef;

      }

      .history-list {
        display: flex;
        flex-wrap: wrap;

        .uni-tag {
          display: inline-block;
          margin-top: 5px;
          margin-right: 5px;
        }
      }

    }
  }
</style>
