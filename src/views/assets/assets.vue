<template>
  <div class="w1200 assets">
    <div class="title">BTC</div>
    <div class="info">
      <div class="fl info_left">
        <ul>
          <li>资产名称<span class="fr">BTC</span></li>
          <li>交易总数<span class="fr">234324</span></li>
          <li>持有地址数<span class="fr">3244324</span></li>
        </ul>
      </div>
      <div class="fr info_right">
        <ul>
          <li>价格<span class="fr">$ 112323</span></li>
          <li>市值<span class="fr">$ 112323</span></li>
          <li>交易量(24h)<span class="fr">$ 112323</span></li>
        </ul>
      </div>
    </div>
    <div class="cb assets_tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="交易" name="first">
          <div class="choice">
            <div class="fl">
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="fr">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage3"
                :page-size="100"
                layout="prev, pager, next, jumper"
                :total="1000">
              </el-pagination>
            </div>
          </div>
          <div class="cb tab">
            <el-table :data="tableData" stripe>
              <el-table-column prop="txid" label="TxID" width="180" align="center"></el-table-column>
              <el-table-column prop="height" label="高度" width="150" align="center"></el-table-column>
              <el-table-column prop="time" label="时间" width="180" align="center"></el-table-column>
              <el-table-column prop="type" label="交易类型" width="150" align="center"></el-table-column>
              <el-table-column prop="from" label="From" width="180" align="center"></el-table-column>
              <el-table-column prop="to" label="To" width="180" align="center"></el-table-column>
              <el-table-column prop="amount" label="金额(NULS)" width="150" align="center"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="持有地址" name="second">
          持有地址
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first',
        options: [
          {value: '选项1', label: '黄金糕'},
          {value: '选项2', label: '双皮奶'},
          {value: '选项3', label: '蚵仔煎'},
          {value: '选项4', label: '龙须面'},
          {value: '选项5', label: '北京烤鸭'}
          ],
        value: '',
        currentPage3: 5,
        tableData: [
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          {txid: 'dsfdsf...qwewq', height: '32424', time: '2020-02-02 02:02:02',type:1,from:'sdsfdsf...sfsdfds',to:'sdfsfsd...sdfsdf',amount:3453},
          ]
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    }
  };
</script>

<style lang="less">
  .assets {
    height: 800px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }

    .info {
      height: 145px;

      .info_left, .info_right {
        background-color: #ffffff;
        box-shadow: 5px 0 20px 0 #131732;
        border-radius: 5px;
        width: 580px;
        height: 145px;

        ul {
          li {
            border-bottom: 1px solid #dfe4ed;
            margin: 5px 20px;
            line-height: 40px;

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
        margin: 20px auto 100px;
      }
    }
  }
</style>