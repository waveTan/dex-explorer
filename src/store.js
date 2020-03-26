import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //当前高度
    height:0,
    //节点信息
    nodeNumber: [],
    //nuls 信息
    NULSNumber: [],
    blockInfo: {
      bestBlockHeight:0,//高度
      consensusCount: 0, //共识节点
      bestBlockTime: 0, //区块时间
      txCount: 0  //总交易数
    }
  },
  mutations: {
    SET_BLOCK_INFO(state, data) {
      state.blockInfo = data
    },
    SET_HEIGHT(state, data) {
      state.height = data;
    },

    SET_NODENUMBER(state, data) {
      state.nodeNumber = data;
    },

    SET_NULSNUMBER(state, data) {
      state.NULSNumber = data;
    },
  },
  getters: {
    nodeNumber(state) {
      return state.nodeNumber
    },

    NULSNumber(state) {
      return state.NULSNumber
    }
  },
  actions: {}
})
