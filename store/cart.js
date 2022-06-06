// ❤1 在 cart.js 中，初始化如下的 vuex 模块

export default {
  // ❤1-1 为当前模块开启命名空间
  namespaced: true,
  // ❤1-2 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state }
    // cart: [],

    // 读取本地存储的购物车数据，对 cart 数组进行初始化
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  // ❤1-3 模块的 mutations 方法。mutations里面的方法专门用来修改 state 里面的数据
  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find((item) => {
        return item.goods_id === goods.goods_id
      })

      // 验证商品是否真的加入到了 cart 数组里面
      // console.log(findResult);

      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }

      // console.log(state.cart);

      // 处理完商品信息后，调用定义的 saveToStorage 方法
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },
    // 声明一个叫做 saveToStorage 的 mutations 方法，此方法负责将购物车中的数据持久化存储到本地。
    saveToStorage(state) {
      // 向本地存储一个数据，命名为cart；数据的值从何而来？从state里面的cart数组
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 声明如下的 mutations 方法，用来修改对应商品的数量
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)

      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车中所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(item => {
        return item.goods_state = newState
      })
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  // ❤1-4 模块的 getters 属性。包装器
  getters: {
    // 在getters节点下定义一个 total 方法，用来统计购物车中所有商品的总数量
    total(state) {
      // let c = 0
      // // 循环统计商品的数量，累加到变量c中
      // state.cart.forEach(goods => {
      //   return c += goods.goods_count
      // })
      // return c

      // 调用数组的 reduce 方法，改造上面：
      return state.cart.reduce((sum, item) => {
        return sum += item.goods_count
      }, 0)
    },
    // 购物车中已勾选商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(item => item.goods_state).reduce((sum, item) => sum += item.goods_count, 0)
    },
    // 已勾选商品的总价格
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(item => item.goods_state).reduce((sum, item) => {
        return sum += item.goods_count * item.goods_price
      }, 0).toFixed(2)
    }
  }
}
