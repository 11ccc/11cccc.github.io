// 创建用户相关的 vuex 模块。

export default {
  namespaced: true,

  // 数据节点
  state: () => ({
    // 收货地址
    // address: {}

    // ❤3 读取本地的收货地址数据，初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),

  // 方法节点
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address

      // ❤2 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法，将 address对象持久化存储到本地
      this.commit('m_user/saveAddressToStorage')
    },

    // ❤ 将 Store 中的 address 持久化存储到本地
    // ❤1 定义一个将 address 持久化存储到本地 mutations 的方法，方法名叫做 saveAddressToStorage
    // 持久化存储 address
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },

  // 数据包装器
  getters: {
    // 为了提高代码的复用性，可以把收货的详细地址抽离为 getters ，方便在多个页面和组件之间实现复用
    // 将 addstr 抽离为 getters
    // 定义收货详细地址的计算属性
    addstr(state) {
      // 先判断 address 对象是否是一个空对象
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串，并返回给用户，渲染到页面上
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  }
}
