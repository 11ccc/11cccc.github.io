// 创建用户相关的 vuex 模块。

export default {
  namespaced: true,

  // 数据节点
  state: () => ({
    // 收货地址
    // address: {}

    // ❤3 读取本地的收货地址数据，初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登陆成功之后的 token 字符串
    // token: '',
    token: uni.getStorageSync('Token') || '',

    // 用户的基本信息对象
    // userinfo: {}
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 重定向的 object 对象 { openType,from }
    redirectInfo: null
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
    },
    // 更新用户的基本信息
    updateUserInfo(state, newUserinfo) {
      state.userinfo = newUserinfo

      // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 将 userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    // 更新 token 字符串
    updateToken(state, newToken) {
      state.token = newToken

      this.commit('m_user/saveTokenToStorage')
    },
    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
      uni.setStorageSync('Token', state.token)
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
      // console.log(state.redirectInfo);
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
