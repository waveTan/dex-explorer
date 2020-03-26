<template>
  <div class="w1200 assets-info">
    <div class="title">{{coinInfo.baseSymbol}}</div>
    <div class="info">
      <div class="fl info_left">
        <ul>
          <li>{{$t('assets.assets0')}}<span class="fr">{{coinInfo.baseSymbol}}</span></li>
<!--          <li>{{$t('assets.assets4')}}<span class="fr">{{coinInfo.marketValue?'$ '+coinInfo.marketValue:''}}</span></li>-->
          <li>{{$t('assets.assets2')}}<span class="fr">{{coinInfo.holderCount}}</span></li>
        </ul>
      </div>
      <div class="fr info_right">
        <ul>
          <li>{{$t('assets.assets3')}}<span class="fr">{{coinInfo.price}}</span></li>
<!--          <li>{{$t('assets.assets4')}}<span class="fr">{{coinInfo.marketValue}}</span></li>-->
          <li>{{$t('assets.assets5')}}<span class="fr">{{coinInfo.dealAmount}}</span></li>
<!--          <li></li>-->
        </ul>
      </div>
      <div class="cb"></div>
    </div>
    <div class="cb assets_tab">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('assets.assets6')" name="first">
          <div class="cb tab" v-loading="list1Loading">
            <el-table :data="tableData1" stripe>
              <el-table-column label="TxID" min-width="180" align="center">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('transactionInfo',scope.row.hash)">
                    {{ scope.row.hashs }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column  :label="$t('assets.assets8')" min-width="50" align="center">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('blockInfo',scope.row.height)">
                    {{ scope.row.height }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :label="$t('assets.assets9')" min-width="80" align="center"></el-table-column>
<!--              <el-table-column prop="direction" :label="$t('assets.assets10')" min-width="40" align="center"></el-table-column>-->
              <el-table-column prop="fromAddress" label="From" min-width="80" align="center"></el-table-column>
              <el-table-column prop="toAddress" label="To" min-width="80" align="center"></el-table-column>
              <el-table-column prop="value" :label="$t('assets.assets11')" min-width="80" align="center"></el-table-column>
            </el-table>
            <paging :pager="pager1" @change="getTransactionList" v-show="pager1.total > pager1.rows"></paging>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('assets.assets7')" name="second">
          <div class="cb tab" v-loading="list2Loading">
            <el-table :data="tableData2" stripe>
              <el-table-column :label="$t('assets.assets13')" min-width="60" align="center">
                <template slot-scope="scope">{{scope.$index+1+(pager2.page-1)*pager2.rows}}</template>
              </el-table-column>
              <el-table-column prop="address" :label="$t('assets.assets14')" min-width="200" align="center">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('addressInfo',scope.row.address)">{{scope.row.address}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="totalBalance" :label="$t('assets.assets15')+' ('+coinInfo.baseSymbol+')'" min-width="150" align="center"></el-table-column>
              <el-table-column prop="rate" :label="$t('assets.assets16')" min-width="60" align="center"></el-table-column>
            </el-table>
            <paging :pager="pager2" @change="getCoinLedgerList" v-show="pager2.total > pager2.rows"></paging>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import Paging from '@/components/pagingBar'
  import {getLocalTime, divisionDecimals, superLong} from '@/api/util.js'
  import moment from "moment";
  export default {
    data() {
      return {
        coinInfo: '',
        activeName: 'first',
        list1Loading: true,
        tableData1: [],
        pager1: {
          page:1,
          rows: 15,
          total: 0
        },
        list2Loading: true,
        tableData2:[],
        pager2: {
          page:1,
          rows: 15,
          total: 0
        },
      };
    },
    components: {
      Paging
    },
    created() {
      this.getTradingInfo()
      this.getTransactionList()
      this.getCoinLedgerList()
    },
    computed: {
      directionType() {
        return {
          1: this.$t('addressInfo.addressInfo17'),
          2: this.$t('addressInfo.addressInfo18'),
        }
      }
    },
    methods: {
      //资产详情
      getTradingInfo(){
        const {tradingHash} = this.$route.query;
        this.$post('/jsonrpc', 'getTradingInfo', [tradingHash])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              const res = response.result
              res.dealAmount = divisionDecimals(res.dealAmount , res.baseDecimal)
              res.price = divisionDecimals(res.price , res.quoteDecimal)
              this.coinInfo = response.result
            }
          })
      },
      //交易列表
      getTransactionList(){
        this.list1Loading = true
        const {chainId,assetId} = this.$route.query;
        const params = [chainId, assetId, this.pager1.page, this.pager1.rows]
        this.$post('/jsonrpc', 'getTradingTransferTxList', params)
          .then((response) => {
            this.list1Loading = false
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.list.map(v=>{
                v.hashs = superLong(v.hash, 20)
                v.createTime = moment(getLocalTime(v.createTime*1000)).format('YYYY-MM-DD HH:mm:ss')
                v.direction = this.directionType[v.type]
                v.value = divisionDecimals(v.value, v.decimal) + ' ' + v.symbol
                v.fromAddress = superLong(v.fromAddress,6)
                v.toAddress = superLong(v.toAddress,6)
              })
              this.tableData1 = response.result.list
              this.pager1.total = response.result.total
            }
          })
      },
      //持有地址数列表
      getCoinLedgerList() {
        this.list2Loading = true
        const {chainId,assetId} = this.$route.query;
        const params = [chainId, assetId, this.pager2.page, this.pager2.rows]
        this.$post('/jsonrpc', 'getCoinLedgerList', params)
          .then((response) => {
            this.list2Loading = false
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.list.map(v=>{
                v.totalBalance = divisionDecimals(v.totalBalance, v.decimals)
              })
              this.tableData2 = response.result.list
              this.pager2.total = response.result.total
            }
          })
      },
      toUrl(name, param) {
        let newParam = {}
        switch (name) {
          case 'transactionInfo':
            newParam = {hash: param}
            break
          case 'blockInfo':
            newParam = {height: param}
            break
          default:
            newParam = {address: param}
        }
        this.$router.push({
          name,
          query: newParam
        })
      }
    }
  };
</script>

<style lang="less">
  .assets-info {
    height: 800px;

    .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .info {
      margin-bottom: 20px;

      .info_left, .info_right {
        background-color: #ffffff;
        box-shadow: 5px 0 20px 0 #131732;
        border-radius: 5px;
        width: 580px;
        /*height: 145px;*/

        ul {
          padding: 0 40px;
          li {
            border-bottom: 1px solid #dfe4ed;
            margin: 5px 0;
            line-height: 40px;
            height: 40px;
            color: #a4aec4;
            font-size: 14px;
            span {
              font-weight: 600;
              color: #475472;
            }
            &:last-child {
              border-bottom: 0;
            }
          }
        }
      }
    }

    .assets_tab {
      margin: 30px auto 0;
      .choice{
        height: 30px;
      }
      .tab{
        margin: 0 auto 100px;
      }
    }
  }
</style>