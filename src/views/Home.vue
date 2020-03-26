<template>
  <div class="home">
    <div class="home_bg cb">
      <div class="title tc fwhite">{{$t('home.home0')}}：{{count.bestBlockHeight}}</div>
      <div class="search">
        <el-input :placeholder="$t('home.home11')"
                  @keyup.enter.native="clickSearch"
                  v-model="homeSearch">
          <i class="el-icon-search el-input__icon click" slot="suffix" @click="clickSearch"></i>
        </el-input>
      </div>
    </div>

    <div class="kanban">
      <div class="k_left fl">
        <div class="top">
          <p class="fl"><img src="./../assets/img/logo.png"/></p>
          <h6 class="fr">
            <span>{{defaultInfo.price}}</span>&nbsp;
            <i v-if="upOrDown==='up'" class="el-icon-top font24"></i>
            <i v-else class="el-icon-down font24"></i>&nbsp;
            <span class="gray-text">{{defaultInfo.upsDowns}}</span>
          </h6>
        </div>
        <div class="foot cb">
          <p>
<!--            <span class="gray-text">Maket Cap</span>-->
          </p>
          <p>
            <span class="gray-text">24h Vol</span>{{defaultInfo.dealAmount}}
          </p>
        </div>
      </div>
      <div class="k_right fr">
        <ul>
          <li class="fl">
            <h6 class="tc gray-text">{{$t('home.home1')}}</h6>
            <p class="tc">{{count.txCount}}</p>
          </li>
          <li class="fl">
            <h6 class="tc gray-text">{{$t('home.home2')}}</h6>
            <p class="tc">{{count.consensusCount}}</p>
          </li>
          <li class="fl">
            <h6 class="tc gray-text">{{$t('home.home3')}}</h6>
            <p class="tc">{{count.bestBlockTime}}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="cb w1200 home_list">
<!--      <p class=" load-more fr click" @click="$router.push('/assets')">查看更多</p>-->
      <el-table v-loading="listLoading" :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="180" align="center">
        </el-table-column>
        <el-table-column :label="$t('home.home5')" width="180" align="center">
          <template slot-scope="scope">
            <span class="click" @click="toUrl(scope.row)">{{scope.row.baseSymbol}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('home.home6')" min-width="150" align="center">
        </el-table-column>
<!--        <el-table-column prop="market" :label="$t('home.home7')" width="180" align="center">-->
<!--        </el-table-column>-->
        <el-table-column prop="dealAmount" :label="$t('home.home8')" width="160" align="center">
        </el-table-column>
<!--        <el-table-column prop="circulation" :label="$t('home.home9')" width="160" align="center">-->
<!--        </el-table-column>-->
        <el-table-column prop="upsDowns" :label="$t('home.home10')" width="160" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.upsDowns.indexOf('-')>-1?'rise-down':'rise-up'">{{scope.row.upsDowns}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {divisionDecimals,getLocalTime} from '@/api/util.js'
  import moment from 'moment'

  export default {
    data() {
      return {
        isMobile: false,
        //搜索的内容
        homeSearch: '',
        tableData: [],
        //统计信息
        // count: this.$store.state.blockInfo,
        listLoading: true,
        defaultInfo:{}
      }
    },
   /* watch: {
      '$store.state.blockInfo'() {
        const blockInfo = this.$store.state.blockInfo
      }
    },*/
    computed: {
      count() {
        const blockInfo = this.$store.state.blockInfo;
        return blockInfo
      },
      upOrDown() {
        const upsDowns = this.defaultInfo.upsDowns
        if (upsDowns && upsDowns.indexOf('-') > -1) {
          return 'down'
        }
        return 'up'
      }
    },
    created() {
      this.isMobile = /(iPhone|iOS|Android|Windows Phone)/i.test(navigator.userAgent);
      // this.getInfo();
      this.getDefaultTradingInfo()
      this.getDefaultCoinTradingList()
    },
    mounted() {

    },
    methods: {
      //
      getDefaultTradingInfo() {
        this.$post('/jsonrpc', 'getDefaultTradingInfo', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              const res = response.result
              res.price = divisionDecimals(res.price, res.quoteDecimal)
              res.dealAmount = divisionDecimals(res.dealAmount, res.baseDecimal)
              res.upsDowns = res.direction < 0 ? '-' + res.change  + '%' : '+' + res.change + '%'
              this.defaultInfo = res
            }
          })
      },
      //获取交易对列表
      getDefaultCoinTradingList() {
        this.listLoading = true
        this.$post('/jsonrpc', 'getDefaultCoinTradingList', [])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.listLoading = false
              response.result.map(v=>{
                v.dealAmount = divisionDecimals(v.dealAmount , v.baseDecimal)
                v.price = divisionDecimals(v.price,v.quoteDecimal)
                v.upsDowns = v.direction < 0 ? '-' + v.change + '%' : '+' + v.change + '%'
              })
              this.tableData = response.result
            }
          })
      },
      /**
       *  首页全局搜索框
       **/
      clickSearch() {
        this.$post('/jsonrpc', 'search', [this.homeSearch])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              if (response.result.type === 'block') {
                this.$router.push({
                  name: 'blockInfo',
                  query: {height: response.result.data.height}
                });
              } else if (response.result.type === 'tx') {
                this.$router.push({
                  name: 'transactionInfo',
                  query: {hash: response.result.data.hash}
                })
              } else if (response.result.type === 'account') {
                this.$router.push({
                  name: 'addressInfo',
                  query: {address: response.result.data.address}
                })
              } else {
                this.$message({message: this.$t('codeInfo.codeInfo12'), type: 'error', duration: 1000});
              }
            } else {
              this.$message({message: this.$t('codeInfo.codeInfo12'), type: 'error', duration: 1000});
            }
            this.homeSearch = '';
          }).catch((error) => {
          console.log(error)
        })
      },


      /**
       * url 连接跳转
       * @param name
       * @param parmes
       */
      toUrl(item) {
        this.$router.push({
          name: 'assetsInfo',
          query: {
            chainId: item.baseAssetChainId,
            assetId: item.baseAssetId,
            tradingHash: item.tradingHash
          }
        })
      },
    },
  }
</script>

<style lang="less" type="text/less">
  @import "./../assets/css/style";

  .home {
    .rise-up {
      color: #7dd319;
    }
    .rise-down{
      color: #f65950;
    }
    .home_bg {
      height: 378px;
      width: 100%;
      background-image: url("./../assets/img/one.jpg");
      background-size: 100% 100%;
      background-position: top center;
      background-repeat: no-repeat;
      margin: 0 0 0 0;

      .title {
        margin: 0 auto;
        padding: 60px 0 40px 0;
        font-size: 30px;
        font-weight: bold;
      }

      .search {
        width: 818px;
        margin: 0 auto;
      }
    }

    .kanban {
      width: 1200px;
      margin: -40px auto 0;
      height: 145px;
      color: #2c3856;
      .gray-text {
        color: #74819e;
      }
      .k_left {
        width: 360px;
        height: 150px;
        border-radius: 10px;
        box-shadow: 5px 0 20px 0 #131732;
        background-color: #ffffff;
        .el-icon-top {
          color: #7dd319;
        }
        .el-icon-down {
          color: #f65950;
        }
        .top {
          p {
            width: 140px;
            img {
              margin: 20px 0 0 40px;
            }
          }
          h6 {
            width: 180px;
            height: 30px;
            text-align: left;
            font-weight: bold;
            margin: 25px 0 0 0;
            span {
              font-size: 22px;
              &.gray-text {
                font-size: 14px;
              }
            }
          }
        }
        .foot {
          padding-left: 40px;
          padding-top: 6px;
          p {
            font-weight: bold;
            color: #2c3856;
            font-size: 16px;
            margin-top: 7px;
          }
          .gray-text {
            font-weight: 100;
            display: inline-block;
            width: 106px;
            font-size: 14px;
          }
          h6 {
            width: 90px;
            margin: 20px 0 0 40px;
          }
          .fr {
            width: 200px;
            height: 30px;
            text-align: left;
            margin: 10px 0 0 0;

            p {
              font-weight: bold;
              line-height: 30px;
              font-size: 18px;
            }

          }
        }
      }

      .k_right {
        width: 800px;
        height: 150px;
        border-radius: 10px;
        box-shadow: 5px 0 20px 0 #131732;
        background-color: #ffffff;

        ul {
          li {
            width: 33.32%;
            border-right: 1px solid #dfe4ed;
            height: 90px;
            margin: 30px auto;

            &:last-child {
              border: 0;
            }
            h6 {
              font-size: 16px;
              line-height: 30px;
              margin: 18px 0 0 0;
            }

            p {
              font-weight: bold;
              font-size: 16px;
            }
          }
        }
      }
    }

    .home_list {
      margin: 40px auto 100px;
      .load-more {
        margin-bottom: 5px;
      }
    }
  }
</style>
