<template>
  <div class="address-info">
    <div class="bg-white">
      <div class="title font24 w1200">{{address}}
        <i class="iconfont icon-copy_icon click" :title="$t('public.copy')" @click="copy(address)"></i>
      </div>
    </div>
    <div class="bottoms w1200 cb">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('addressInfo.addressInfo0')" name="transaction">
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
        </el-tab-pane>
        <el-tab-pane :label="$t('addressInfo.addressInfo1')" name="assets">
          <el-table v-loading="loading2"  :data="assetsData" stripe border style="width: 100%">
            <el-table-column label="" min-width="20"></el-table-column>
            <el-table-column :label="$t('addressInfo.addressInfo13')" min-width="120" prop="symbol"></el-table-column>
            <el-table-column :label="$t('addressInfo.addressInfo14')" min-width="120" prop="totalBalance"></el-table-column>
            <el-table-column :label="$t('addressInfo.addressInfo15')" min-width="120" prop="available"></el-table-column>
            <el-table-column :label="$t('addressInfo.addressInfo16')" min-width="120" prop="lock"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import SelectBar from '@/components/SelectBar';
  import Paging from '@/components/pagingBar';
  import {getLocalTime, divisionDecimals, superLong, copys, timesDecimals, Plus} from '@/api/util.js'

  export default {
    data() {
      return {
        isMobile: true,
        activeName: 'transaction',
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
        pager: {
          total: 0,
          page: 1,
          rows: 15,
        },
        //地址
        address: this.$route.query.address,
        assetsData:[],//资产列表
        loading2: true
      }
    },
    components: {
      SelectBar,
      Paging
    },
    created() {
      this.isMobile = /(iPhone|iOS|Android|Windows Phone)/i.test(navigator.userAgent);
      this.getTransactionList();
      this.getAssetsList()
    },
    mounted() {
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
      //获取交易列表
      getTransactionList() {
        this.listLoading = true
        this.$post('/jsonrpc', this.methodName, [this.address, this.pager.page, this.pager.rows])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              setTimeout(()=>{
                this.listLoading = false
              },1000)
              const res = response.result.list
              res.map(v=>{
                v.hashs = superLong(v.hash, 15)
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
      //获取资产列表
      getAssetsList() {
        this.loading2 = true
        this.$post('/jsonrpc', 'getLedgerList', [this.address])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              this.loading2 = false
              const res = response.result
              res.map(v=>{
                v.totalBalance = divisionDecimals(v.totalBalance, v.decimals)
                v.available = divisionDecimals(v.available, v.decimals)
                v.lock = divisionDecimals((v.timeLock + v.businessLock), v.decimals)
              })

              this.assetsData = res
            }
          })
      },
      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copysuccess'), type: 'success', duration: 1000});
      },
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
        let newParmes = {};
        if (name === 'addressInfo') {
          this.address = parmes;
          newParmes = {address: parmes}
        } else if (name === 'blockInfo') {
          newParmes = {height: parmes}
        } else if (name === 'contractsInfo') {
          newParmes = {contractAddress: parmes, tabName: 'first'}
        } else if (name === 'tokenInfo') {
          newParmes = {contractAddress: parmes}
        }
        else {
          newParmes = {hash: parmes}
        }
        this.$router.push({
          name: name,
          query: newParmes
        })

      },
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .address-info {
    //min-height: 800px;
    margin-bottom: 100px;
    .bg-white {
      .title {
        /*padding-bottom: 60px;*/
        margin: 40px auto 0;
        .click {
          margin-left: 10px;
        }
        @media screen and (max-width: 1000px) {
          padding: 0 0 1.8rem 0.5rem;
          font-size: 0.9rem;
          .click {
            margin-left: 1rem;
            font-size: 0.9rem;
          }
        }
      }
    }
    .bottoms {
      margin: 30px auto 14px;
      @media screen and (max-width: 1000px) {
        margin: 1.5rem auto 1.5rem ;
        width: 95%;
      }
      .el-select {
        margin-bottom: 20px;
      }
    }
  }
</style>
