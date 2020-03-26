<template>
  <div class="address bg-gray">
    <div class="bg-white">
      <div class="w1200">
        <h2 class="title fl capitalize">{{$t('address.address0')}}</h2>
        <!--<i class="iconfont icon-dwonload_gray_icon fr hide-switch click" title="更多功能敬请期待..."></i>-->
      </div>
    </div>
    <div class="tabs w1200">
      <el-table :data="addressList" stripe border style="width: 100%" v-loading="addressLoading">
        <el-table-column label="" width="30">
        </el-table-column>
        <el-table-column label="#" width="100">
          <template slot-scope="scope">{{scope.$index+1+(pager.page-1)*pager.rows}}</template>
        </el-table-column>
        <el-table-column :label="$t('address.address2')" min-width="280">
          <template slot-scope="scope">
            <span class="cursor-p click" @click="toUrl('addressInfo',scope.row.address)">
              {{ scope.row.address }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('address.address3')" width="200" prop="lock"></el-table-column>
        <el-table-column :label="$t('address.address4')" width="200" prop="available"></el-table-column>
        <el-table-column :label="$t('address.address5')" width="200" prop="totalBalance"></el-table-column>
      </el-table>
      <paging :pager="pager" @change="getAccountList" v-show="pager.total > pager.rows"></paging>
    </div>
  </div>
</template>

<script>
  import paging from '@/components/pagingBar';
  import {timesDecimals} from '@/api/util.js'

  export default {
    data() {
      return {
        addressLoading: true,
        addressList: [],
        sort: 0,
        pager: {
          total: 0,
          page: 1,
          rows: 15,
        }
      }
    },
    components: {
      paging,
    },
    created() {
      this.getAccountList();
    },
    methods: {

      /**
       * @disc: 获地址列表
       * @params: page, rows
       * @date: 2019-09-09 17:32
       * @author: Wave
       */
      getAccountList() {
        this.addressLoading = true;
        this.$post('/jsonrpc', 'getAccountList', [this.pager.page, this.pager.rows])
          .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
              for (let item of response.result.list) {
                item.totalBalance = timesDecimals(item.totalBalance, 8);
                item.available = timesDecimals(item.available, 8);
                item.lock = timesDecimals(item.businessLock + item.timeLock, 8);
              }
              this.addressList = response.result.list;
              this.pager.total = response.result.total;
              this.addressLoading = false;
            }
          })
      },

      /**
       * url 连接跳转
       * @param name
       * @param parmes
       * @param type
       */
      toUrl(name, parmes,) {
        this.$router.push({
          name: name,
          query: {address: parmes}
        })
      }
    },
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .address {
    //height: 1050px;
    .bg-white {
      height: 133px;
      @media screen and (max-width: 1000px) {
        height: 5rem;
      }
    }
    .tabs {
      margin-bottom: 100px;
      @media screen and (max-width: 1000px) {
        width: 95%;
        margin: -1.4rem auto 5rem;
      }
      .el-table__header {
        .has-gutter {
          tr {
            th {
              padding: 0;
            }
          }
        }
      }
    }
  }
</style>
