<template>
  <div class="transaction">
    <div class="top-chart w1200 ">
      <div class="chart_title">
        <h2 class="fl font18 capitalize">{{$t('transaction.transaction0')}}</h2>
        <div class="fr">
          <div class="chart_bt">
            <el-button type="text" class="btn capitalize" @click="changeDate(1)" :class="timeRate === 1 ? 'btn_N':''">
              {{$t('public.day')}}
            </el-button>
            <el-button type="text" class="btn capitalize" @click="changeDate(2)" :class="timeRate === 2 ? 'btn_N':''">
              {{$t('public.week')}}
            </el-button>
            <el-button type="text" class="btn capitalize" @click="changeDate(3)" :class="timeRate === 3 ? 'btn_N':''">
              {{$t('public.month')}}
            </el-button>
          </div>
        </div>
        <div class="cb"></div>
      </div>
      <div class="chart_info">
        <ve-line height="330px" style="top: -40px;zIndex: -1"
                 :data="timeChartData"
                 :legend-visible="false"
                 :colors="colors"
                 :settings="chartSettings"
                 :loading="timeRateDataLoading"></ve-line>
      </div>
    </div>
    <div class="info">
      <div class="w1200">
        <h2 class="title font18 capitalize">{{$t('public.transactionList')}}</h2>
        <div class="tabs w1200">
          <select-bar
            v-model="transactionRegion"
            :typeOptions="transactionType"
            typeName="transactionType"
            @change="changeType"
          >
          </select-bar>
          <div class="transaction-list" v-loading="listLoading">
            <el-table :data="transactionData" stripe border style="width: 100%" v-if="transactionRegion==='deal'" >
              <el-table-column label="" min-width="10"></el-table-column>
              <el-table-column label="TXID" min-width="165">
                <template slot-scope="scope">
                <span class="cursor-p click" @click="toUrl('transactionInfo',scope.row.hash)">
                  {{ scope.row.hashs }}
                </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo6')" min-width="48">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('blockInfo',scope.row.height)">
                    {{ scope.row.height }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo7')" min-width="90" prop="createTime"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo8')" min-width="52" prop="tradingPair"></el-table-column>
              <el-table-column label="From" min-width="80" prop="buyAddress"></el-table-column>
              <el-table-column label="To" min-width="80" prop="sellAddress"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo10')" min-width="60" prop="price"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo11')" min-width="60" prop="baseAmount"></el-table-column>
            </el-table>
            <el-table :data="transactionData" stripe border style="width: 100%" v-else-if="transactionRegion==='transfer'" >
              <el-table-column label="" min-width="10"></el-table-column>
              <el-table-column label="TXID" min-width="180">
                <template slot-scope="scope">
                <span class="cursor-p click" @click="toUrl('transactionInfo',scope.row.hash)">
                  {{ scope.row.hashs }}
                </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo6')" min-width="50">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('blockInfo',scope.row.height)">
                    {{ scope.row.height }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo7')" min-width="80" prop="createTime"></el-table-column>
              <el-table-column label="from" min-width="80" prop="fromAddress"></el-table-column>
              <el-table-column label="to" min-width="80" prop="toAddress"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo11')" min-width="80" prop="value"></el-table-column>
            </el-table>
            <el-table :data="transactionData" stripe border style="width: 100%" v-else >
              <el-table-column label="" min-width="20"></el-table-column>
              <el-table-column label="TXID" min-width="180">
                <template slot-scope="scope">
                <span class="cursor-p click" @click="toUrl('transactionInfo',scope.row.hash)">
                  {{ scope.row.hashs }}
                </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo6')" min-width="50">
                <template slot-scope="scope">
                  <span class="click" @click="toUrl('blockInfo',scope.row.height)">
                    {{ scope.row.height }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo7')" min-width="90" prop="createTime"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo8')" min-width="70" prop="tradingPair"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo9')" min-width="40" prop="direction"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo10')" min-width="70" prop="price"></el-table-column>
              <el-table-column :label="$t('addressInfo.addressInfo11')" min-width="70" prop="baseAmount"></el-table-column>
            </el-table>
            <paging :pager="pager" @change="getTransactionList" v-show="pager.total > pager.rows"></paging>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import paging from '@/components/pagingBar';
  import SelectBar from '@/components/SelectBar';
  import {getLocalTime, superLong, timesDecimals,divisionDecimals} from '@/api/util.js'

  export default {
    data() {
      this.colors = ['#318ef6', '#7db46d', '#7db46d',
        '#546570', '#c4ccd3'];
      this.chartSettings = {
        yAxisType: ['normal'],
        labelMap: {
          'value': 'TXS'
        },
      };
      return {
        //统计图数据
        timeChartData: {
          columns: [],
          rows: []
        },
        timeRateDataLoading: true,
        timeRate: 2,

        //交易类型
        transactionRegion: 'deal', //交易下拉
        transactionType: [
          {label: 'deal', value: 'deal'},
          {label: 'pending', value: 'pending'},
          {label: 'cancel', value: 'cancel'},
          {label: 'transfer', value: 'transfer'},
        ],
        methodName: 'getDealTxList',
        listLoading: true,
        transactionData:[],
        //分页信息
        pager: {
          total: 0,
          page: 1,
          rows: 6,
        },
      }
    },
    components: {
      paging,
      SelectBar
    },
    computed: {
      directionType() {
        return {
          1: this.$t('addressInfo.addressInfo17'),
          2: this.$t('addressInfo.addressInfo18'),
        }
      }
    },
    created() {
      this.getYearRateData(this.timeRate);
      this.getTransactionList()
    },
    mounted() {
    },
    methods: {
      //获取交易历史数据统计
      getYearRateData(time) {
        this.$post('/jsonrpc', 'getStatisticalTx', [time])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.timeChartData.columns = ['key', 'value'];
              this.timeChartData.rows = response.result;
              this.timeRateDataLoading = false;
            }
          })
      },
      //获取交易列表
      getTransactionList() {
        this.listLoading = true
        this.$post('/jsonrpc', this.methodName, [, this.pager.page, this.pager.rows])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              setTimeout(()=>{
                this.listLoading = false
              },1000)
              const res = response.result.list
              res.map(v=>{
                v.hashs = superLong(v.hash, 16)
                v.createTime = moment(getLocalTime(v.createTime*1000)).format('YYYY-MM-DD HH:mm:ss')
                v.tradingPair = v.baseSymbol+ '/' + v.quoteSymbol
                v.direction = this.directionType[v.type]
                v.price = divisionDecimals(v.price, v.quoteDecimal) //价格
                v.baseAmount = divisionDecimals(v.baseAmount, v.baseDecimal) + ' ' + v.baseSymbol //成交数量
                v.quoteAmount = divisionDecimals(v.quoteAmount, v.quoteDecimal) + ' ' + v.quoteSymbol  //成交额
                v.buyAddress = superLong(v.buyAddress,6)
                v.sellAddress = superLong(v.sellAddress,6)
                //base交易的/quote持有的  BTC/USDI usdi买btc
                v.fromAddress = superLong(v.fromAddress,6)
                v.toAddress = superLong(v.toAddress,6)
                v.value = divisionDecimals(v.value,v.decimal) + ' ' + v.symbol
              })
              this.transactionData = res
              this.pager.total = response.result.total
            }
          })
      },
      /**
       * 选择统计数据的周、月、年
       **/
      changeDate(type) {
        this.timeRateDataLoading = true;
        this.timeChartData.columns = [];
        this.timeChartData.rows = [];
        this.timeRate = type;
        this.getYearRateData(type)
      },

      /**
       * 获取交易类型
       **/
      changeType(type) {
        this.transactionRegion = type;
        switch (type) {
          case 'pending':
            this.methodName = 'getOrderTxList'
            break
          case 'cancel':
            this.methodName = 'getCancelOrderTxList'
            break
          case 'transfer':
            this.methodName = 'getTransferTxList'
            break
          default:
            this.methodName = 'getDealTxList'
        }
        this.pager.page = 1;
        this.getTransactionList()
      },

      /**
       * url 连接跳转
       * @param name
       * @param parmes
       */
      toUrl(name, parmes) {
        this.$router.push({
          name: name,
          query: name === 'transactionInfo' ? {hash: parmes} : {height: parmes}
        })
      }
    },
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .transaction {
    //height: 920px;
    .top-chart {
      height: 280px;
      @media screen and (max-width: 1000px) {
        display: none;
      }
      .chart_title {
        margin: 40px 0 0 0;
        .chart_bt {
          z-index: 8;
          position: relative;
        }
      }
      .chart_info {
        /*margin: 20px 0 0 0;*/
      }
    }
    .info {
      width: 100%;
      margin-bottom: 100px;
      .title {
        line-height: 40px;
        font-weight: 400;
        margin: 5px auto;
        border-bottom: @BD1;
        @media screen and (max-width: 1000px) {
          margin: 0 auto 0;
          padding: 1rem 0 0 0.5rem;
          width: 95%;
        }
      }
    }
    .tabs {
      margin: 0 0 0 0;
      @media screen and (max-width: 1000px) {
        width: 95%;
        margin: 0 auto;
      }
      .el-select {
        margin: 20px 0 14px 0;
      }
      .hide-switch {
        margin: 35px 0 0 0;
      }
    }
  }

</style>
