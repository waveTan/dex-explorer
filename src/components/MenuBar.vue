<template>
  <div class="nav">
    <el-menu :default-active="activedMenu($route.path)" mode="horizontal" active-text-color="#318ef6"
             @select="handleSelect">
      <el-menu-item index="home" class="font18 fw capitalize">{{$t('nav.home')}}</el-menu-item>
      <el-menu-item index="block" class="font18 fw capitalize">{{$t('nav.block')}}</el-menu-item>
      <el-menu-item index="address" class="font18 fw capitalize">{{$t('nav.address')}}</el-menu-item>
      <el-menu-item index="transaction" class="font18 fw capitalize">{{$t('nav.transaction')}}</el-menu-item>
     <!-- <el-menu-item index="consensus" class="font18 fw capitalize">{{$t('nav.consensus')}}</el-menu-item>
      <el-menu-item index="contracts" class="font18 fw capitalize">{{$t('nav.contracts')}}</el-menu-item>-->
      <el-menu-item index="assets" class="font18 fw capitalize">{{$t('nav.assets')}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    components: {
      //numberGrow,
    },
    created() {

    },
    mounted() {
      if (this.$route.path === '/accountInfo') {
        let parmes = this.$route.query.address;
        this.$router.push({
          name: 'addressInfo',
          query: {address: parmes}
        })
      }
    },
    methods: {

      /**
       * 导航跳转
       * @param key
       **/
      handleSelect(key) {
        this.navActive = key;
        sessionStorage.setItem('navActive', key);
        this.$router.push({
          name: key
        })
      },

      /**
       * 导航栏的选中
       **/
      activedMenu(val) {
        if (val.indexOf('/block') >-1) {
          return 'block'
        } else if (val.indexOf('/address') >-1) {
          return 'address'
        } else if (val.indexOf('/transaction') >-1) {
          return 'transaction'
        }  else if (val.indexOf('/assets') >-1) {
          return 'assets'
        } else {
          return 'home'
        }
      },
    },
    watch: {}
  }
</script>

<style lang="less">
  @import "./../assets/css/style";

  .nav {
    width: 670px;
    float: left;
    .el-menu--horizontal {
      float: left;
      border-bottom: 0 !important;
      .el-menu-item {
        padding: 0 18px;
        color: #5e6983;
        font-size: 18px;
        height: 80px;
        line-height: 80px;
        font-weight: normal;
        &:not(.is-disabled):hover {
          color: #318ef6
        }
      }
      .is-active {
        border-color: transparent !important;
      }
    }
    @media screen and (max-width: 1000px) {
      width: 100%;
      float: none;
      .el-menu--horizontal {
        float: none;
        width: 160px;
        right: 0;
        position: absolute;
        .el-menu-item{
          float: none;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }
</style>
