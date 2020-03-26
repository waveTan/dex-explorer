<template>
  <div class="block-info">
    <div class="bg-white">
      <div class="title font24 w1200">#{{this.height}}</div>
    </div>
    <div class="info_tabs w1200">
      <h3 class="tabs_title tabs_header capitalize">{{$t('public.basicInfo')}}</h3>
      <ul class="ul">
        <li class="tabs_infos fl capitalize">
          <p>{{$t('public.block')}} hash
            <span>{{nodeInfo.hashs}}
              <i class="iconfont icon-copy_icon click" :title="$t('public.copy')" @click="copy(nodeInfo.hash)"></i>
            </span>
          </p>
        </li>
        <li class="tabs_infos fl capitalize">
          <p>{{$t('public.outNode')}}
          <!--<span class="click" @click="toUrl('consensusInfo',nodeInfo.agentHash)" v-show="!nodeInfo.seedPacked">
          {{nodeInfo.agentAlias ? nodeInfo.agentAlias: nodeInfo.agentId }}
          </span>
          <span v-show="nodeInfo.seedPacked">{{$t('public.seedNode')}}</span>-->
            <span>{{nodeInfo.agent}}</span>
          </p>
        </li>
        <li class="tabs_infos fl capitalize">
          <p>{{$t('public.packAddress')}}<span class="click" @click="toUrl('addressInfo',nodeInfo.packingAddress)">{{nodeInfo.packingAddress}}</span></p>
        </li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.transactionNo')}}<span>{{nodeInfo.txCount}}</span></p></li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.size')}} <span>{{nodeInfo.size}} Bytes</span></p></li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.blockReward')}}<span>{{nodeInfo.reward}}<span class="fCN">&nbsp;NULS</span></span></p></li>
        <li class="tabs_infos fl capitalize">
          <p>{{$t('public.round')}}/{{$t('public.number')}}
            <span>
              <font >{{nodeInfo.roundIndex}}</font>
              /{{nodeInfo.packingIndexOfRound}}</span>
          </p>
        </li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.fee')}}<span>{{nodeInfo.totalFee}}<span class="fCN">&nbsp;NULS</span></span></p></li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.time')}}<span>{{nodeInfo.createTime}}</span></p></li>
        <li class="tabs_infos fl capitalize"><p>{{$t('public.consensusReward')}}<span>{{nodeInfo.totalReward}}<span class="fCN">&nbsp;NULS</span></span></p></li>
      </ul>

      <h4 class=" font20 capitalize">{{$t('public.transactionList')}}</h4>
      <div class="info_table">
        <el-table :data="txList" stripe style="width: 100%" border>
          <el-table-column label="" width="30">
          </el-table-column>
          <el-table-column label="TXID" min-width="250" align="left">
            <template slot-scope="scope"><span class="click" @click="toUrl('transactionInfo',scope.row.hash)">{{ scope.row.hashs }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" :label="$t('public.time')" min-width="180" align="left"></el-table-column>
          <el-table-column :label="$t('public.type')" min-width="180" align="left">
            <template slot-scope="scope">{{ $t('type.'+scope.row.type) }}</template>
          </el-table-column>
        </el-table>
      </div>
      <paging :pager="pager" @change="pagesList" v-show="pager.total > pager.rows"></paging>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import paging from '@/components/pagingBar';
  import SelectBar from '@/components/SelectBar';
  import {getLocalTime, superLong, copys,timesDecimals} from '@/api/util.js'

  export default {
    data() {
      return {
        //高度
        height:'',
        //块信息
        nodeInfo: {},
        //交易列表
        txList: [],
        //分页数据
        pager: {
          total: 0,
          page: 1,
          rows: 5,
        },
      }
    },
    components: {
      paging,
    },
    created() {
      this.height = this.$route.query.height
      this.getHeaderByHeight(this.height);
    },
    mounted(){

    },

    methods: {

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: '复制成功', type: 'success', duration: 1000});
      },

      //根据高度获取块信息
      async getHeaderByHeight(height) {
        this.$post('/jsonrpc', 'getBlockHeaderByHeight', [height])
          .then((response) => {
            console.log(response);
            if (response.hasOwnProperty("result")) {
              response.result.hashs = superLong(response.result.hash, 10);
              response.result.totalReward= timesDecimals(response.result.reward-response.result.totalFee, 8);
              response.result.reward= timesDecimals(response.result.reward, 8);
              response.result.totalFee= timesDecimals(response.result.totalFee, 8);
              response.result.createTime = moment(getLocalTime(response.result.createTime*1000)).format('YYYY-MM-DD HH:mm:ss');
              this.nodeInfo = response.result
              response.result.txList.map(v=>{
                v.hashs = superLong(v.hash,20)
                v.time = moment(getLocalTime(v.createTime*1000)).format('YYYY-MM-DD HH:mm:ss');
              })
              this.txList = response.result.txList
            }
          }).catch((error) => {
          console.log(error)
        })
      },
      toUrl(name, parmes) {
        let newQuery = {};
        if(name ==='addressInfo'){
          newQuery ={address: parmes}
        }else if(name ==='rotationInfo'){
          newQuery={rotation: parmes}
        }else {
          newQuery ={hash: parmes}
        }
        this.$router.push({
          name: name,
          query: newQuery
        })
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .block-info {
    margin-bottom: 100px;
    .bg-white {
      /*height: 90px;*/
      @media screen and (max-width: 1000px) {
        height: 3.3rem;
      }
      .title {
        padding-bottom: 40px;
        margin-bottom: 20px;
        @media screen and (max-width: 1000px) {
          padding-bottom: 1rem;
        }
      }
    }
    .info_tabs {
      .ul {
        min-height: 210px;
      }
    }
  }
</style>
