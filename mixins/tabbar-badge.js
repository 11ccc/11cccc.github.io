// ❤1 从商品详情页面导航到购物车页面之后，需要为 tabBar 中的购物车动态设置数字徽标
// ❤1-1 把 Store 中的 total 映射到 cart.vue 中使用
// ❤1-1-1 按需导入 mapGetters 这个辅助方法
import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    // ❤1-1-2 将 m_cart 模块中的 total 映射到当前页面的计算属性
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    // ❤1-2 在页面刚显示出来的时候，立即调用 setBadge方法，为 tabBar 设置数字徽标
    this.setBadge()
  },
  methods: {
    // ❤1-3 在 methods 节点中声明 setBadge 方法，通过 uni.setTabBardge() 为 tabBar 设置数字徽标
    setBadge() {
      // 调用小程序提供的 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2,
        text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      })
    },
  },
  watch: {
    // 使用 watch 监听器，监听 total 总数量的变化，从而动态为 tabBar 的徽标赋值：
    // 监听total值的变化
    total: {
      handler() {
        this.setBadge()
      },
      immediate: true
    }
  }
}
