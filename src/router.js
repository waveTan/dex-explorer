import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: `/`,
      name: 'home',
      component: resolve => require(['@/views/Home.vue'], resolve)
    },
    {
      path: '/block',
      name: 'block',
      component: resolve => require(['@/views/block/Block'], resolve)
    },
    {
      path: '/block/info',
      name: 'blockInfo',
      component: resolve => require(['@/views/block/BlockInfo'], resolve)
    },
    {
      path: '/address/info',
      name: 'addressInfo',
      component: resolve => require(['@/views/address/AddressInfo'], resolve)
    },
    {
      path: '/addressInfo',
      name: 'accountInfo',
      component: resolve => require(['@/views/address/AddressInfo'], resolve)
    },
    {
      path: '/address',
      name: 'address',
      component: resolve => require(['@/views/address/Address'], resolve)
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: resolve => require(['@/views/transaction/Transaction'], resolve)
    },
    {
      path: '/transaction/info',
      name: 'transactionInfo',
      component: resolve => require(['@/views/transaction/TransactionInfo'], resolve)
    },
    {
      path: '/transactionHash',
      name: 'transactionHash',
      component: resolve => require(['@/views/transaction/TransactionInfo'], resolve)
    },
    {
      path: '/protocol_update',
      name: 'protocolUpdate',
      component: resolve => require(['@/views/protocol_update/Index'], resolve)
    },
    {
      path: '/assets',
      name: 'assets',
      component: resolve => require(['@/views/assets/Assets'], resolve)
    },
    {
      path: '/assets/info',
      name: 'assetsInfo',
      component: resolve => require(['@/views/assets/AssetsInfo'], resolve)
    },
  ]
})
