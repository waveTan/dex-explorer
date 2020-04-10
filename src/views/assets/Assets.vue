<template>
  <div class="w1200 assets">
    <el-input :placeholder="$t('assets.assets12')"
              @input="searchCoin"
              v-model="searchVal">
      <i class="el-icon-search el-input__icon click" slot="suffix"></i>
    </el-input>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="#" width="180" align="center">
      </el-table-column>
      <el-table-column prop="baseSymbol" :label="$t('home.home5')" width="180" align="center">
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
      <el-table-column :label="$t('home.home10')" width="160" align="center">
        <template slot-scope="scope">
          <span :class="scope.row.upsDowns.indexOf('-')>-1?'rise-down':'rise-up'">{{scope.row.upsDowns}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {superLong, timesDecimals,divisionDecimals,getLocalTime} from '@/api/util.js'
  import moment from 'moment'

  export default {
    data() {
      return {
        loading: true,
        searchVal:'',
        tableData: [],
      }
    },
    created() {
      this.getDefaultCoinTradingList()
    },
    mounted() {
    },
    methods: {
      //获取交易对列表
      getDefaultCoinTradingList() {
        this.$post('/jsonrpc', 'getDefaultCoinTradingList', [])
          .then((response) => {
            this.loading = false
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.map(v=>{
                v.dealAmount = divisionDecimals(v.dealAmount , v.baseDecimal)
                v.price = divisionDecimals(v.price,v.quoteDecimal)
                v.upsDowns = v.direction < 0 ? '-' + v.change + '%' : '+' + v.change + '%'
              })
              this.tableData = response.result
              this.copyData = response.result
            }
          })
      },
      searchCoin(e) {
        this.tableData = this.copyData.filter(v=>{
          const lowerCase = v.baseSymbol.toLowerCase()
          return lowerCase.indexOf(e.toLowerCase()) > -1
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

<style lang="less">
  .assets {
    margin-top: 40px;
    .el-input {
      width: 500px;
      margin-bottom: 20px;
      input {
        height: 34px;
        line-height: 34px;
      }
      .el-input__icon {
        line-height: 34px;
      }
    }
    .rise-up {
      color: #7dd319;
    }
    .rise-down{
      color: #f65950;
    }
  }
</style>