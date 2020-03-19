<template>
  <div class="thepatient">
    <md-scroll-view
      ref="scrollView"
      :scrolling-x="false"
      :bouncing="false"
      :manual-init="true"
      @endReached="$_onEndReached"
    >
      <ul class="order-ul" v-if="list.length">
        <li
          class="order-li"
          v-for="(item, index) in list"
          :key="index"
          @click="goDetail(item)"
        >
          <div class="order-head">
            <div v-text="orderType(item)"></div>
            <div v-html="orderText(item)"></div>
          </div>
          <div class="order-box">
            <div>
              <div class="order-basi">
                <div class="order-bx color1">就诊人</div>
                <div>
                  {{ item.patientName }}（ {{ formatGender(item) }}，{{
                    item.patientAge
                  }}岁 ）
                </div>
              </div>
              <div class="order-basi">
                <div class="order-bx color1">问诊医生</div>
                <div>{{ item.doctorName }}</div>
              </div>
            </div>
            <div v-if="item.orderType === 1 || item.orderType === 3">
              <div class="order-list">
                <div class="durg-name">{{ deugType(item).name }}</div>
                <div>{{ item.drugNum }}{{ deugType(item).unit }}</div>
                <div class="price">&yen;{{ durgPrice(item.total, item.freight) }}</div>
              </div>
              <div class="order-list">
                <div class="durg-name">配送费</div>
                <div></div>
                <div class="price">&yen;{{ item.freight }}</div>
              </div>
            </div>
            <div class="order-total color2">合计：&yen;{{ item.total }}</div>
          </div>
          <div class="order-foot">
            <div class="time">{{ item.createTime }}</div>
            <div class="btn-flex">
              <md-button
                type="warning"
                size="small"
                inline
                plain
                v-if="item.orderStatus === 20"
                >立即支付</md-button
              >
              <md-button
                type="default"
                size="small"
                inline
                plain
                @click.stop="cancelOrder(item)"
                v-if="item.orderStatus === 20"
                >取消订单</md-button
              >
              <md-button
                type="warning"
                size="small"
                inline
                plain
                @click.stop="goRoom(item)"
                v-if="
                  item.orderType === 2 &&
                  item.orderStatus === 30 &&
                  item.payStatus === 2
                "
                >进入咨询</md-button
              >
              <md-button
                type="primary"
                size="small"
                inline
                plain
                @click.stop="getRescriptionPdfUrl(item)"
                v-if="
                  item.orderType === 3 &&
                  item.orderStatus !== 10 &&
                  item.orderStatus !== 20 &&
                  item.orderStatus !== 60 &&
                  item.orderStatus !== 70
                "
                >查看处方</md-button
              >
              <md-button
                type="default"
                size="small"
                inline
                plain
                @click.stop="viewLogistics(item)"
                v-if="item.orderStatus === 40 || item.orderStatus === 50"
                >查看物流</md-button
              >
              <md-button
                type="default"
                size="small"
                inline
                plain
                @click.stop="cancelOrder(item)"
                v-if="item.orderStatus === 10"
                >取消</md-button
              >
            </div>
          </div>
        </li>
      </ul>
      <div class="no-result" v-else>暂无数据</div>
      <md-scroll-view-more
        slot="more"
        :is-finished="isFinished"
      >
      </md-scroll-view-more>
    </md-scroll-view>
  </div>
</template>

<script>
import { Button, Toast, Dialog, ScrollView, ScrollViewMore } from "mand-mobile";
import API from "../api/api";
import { accSub } from "../utils/utils"

export default {
  name: "thepatient",
  components: {
    [Button.name]: Button,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore
  },
  data() {
    return {
      list: [],
      pageIng: 1,
      isFinished: false
    };
  },
  mounted() {
    document.title = "我的订单";
    this.myOrders();
    this.$refs.scrollView.init();
  },
  methods: {
    $_onEndReached() {
      this.pageIng = this.pageIng + 1
      this.myOrders()
    },
    deugType({ recipeType }) {
      let obj = {}
      if (recipeType === 1) {
        obj.name = "中药处方药品"
        obj.unit = "味"
      }
      if (recipeType === 2) {
        obj.name = "西药处方药品"
        obj.unit = "件"
      }
      return obj
    },
    durgPrice(a, b) {
      return accSub(a, b)
    },
    sexformat(sex) {
      if (sex === 0) {
        return "男";
      } else if (sex === 1) {
        return "女";
      } else {
        return "";
      }
    },
    goRoom({ id }) {
      Toast.loading("加载中...");
      API.getMemberConsultByOrderId({
        id
      }).then(res => {
        Toast.hide();
        this.$router.push({
          path: "/talk",
          query: {
            id: res.channelId,
            doctorId: res.doctorId,
            headPortrait: res.doctorPortrait,
            patientPortrait: res.patientPortrait
          }
        });
      });
    },
    goDetail({ id, orderType }) {
      if (orderType === 1 || orderType === 3) {
        this.$router.push({
          path: "/drugorder",
          query: {
            id
          }
        });
      }
      if (orderType === 2) {
        this.$router.push({
          path: "/orderdetail",
          query: {
            id
          }
        });
      }
    },
    orderType({ orderType }) {
      if (orderType === 1) {
        return "药品订单";
      } else if (orderType === 2) {
        return "图文咨询";
      } else if (orderType === 3) {
        return "处方订单";
      } else {
        return "未知";
      }
    },
    orderText({ orderStatus, payStatus }) {
      let text = "";
      switch (orderStatus) {
        case 10:
          text = '<span class="color5">待审核</span>';
          break;
        case 20:
          text = '<span class="color5">待支付</span>';
          break;
        case 30:
          if (payStatus === 2) {
            text = '<span class="color1">已支付</span>';
          } else {
            text = '<span class="color5">待审核</span>';
          }
          break;
        case 40:
          text = '<span class="color5">待收货</span>';
          break;
        case 50:
          text = '<span class="color1">已完成</span>';
          break;
        case 60:
          text = '<span class="color1">已取消</span>';
          break;
        case 70:
          text = '<span class="color1">已失效</span>';
          break;  
        default:
          text = '<span class="color1">未知</span>';
          break;
      }
      return text;
    },
    formatGender({ patientGender }) {
      if (patientGender === 0) {
        return "男";
      } else if (patientGender === 1) {
        return "女";
      } else {
        return "未知";
      }
    },
    getRescriptionPdfUrl({ id }) {
      this.$router.push({
        path: "/prescription",
        query: {
          id
        }
      });
    },
    viewLogistics({ phone }) {
      window.location.href = `http://drugstore.km1818.com:8182/zyf/search.htm?mbl_no=${phone}`;
    },
    cancelOrder({ id }) {
      Dialog.confirm({
        title: "提示",
        content: "确定取消订单吗？",
        confirmText: "确定",
        onConfirm: () => {
          API.cancle({ id }).then(() => {
            Toast.info("已取消", 1500);
            this.myOrders();
          });
        }
      });
    },
    myOrders() {
      if (this.isFinished) {
        return
      }
      Toast.loading("加载中...");
      API.myOrders({
        page: this.pageIng,
        rows: 10
      }).then(res => {
        Toast.hide();
        this.list = [...this.list, ...res.dataList]
        // 停止分页加载
        if (this.pageIng === res.pages) {
          this.isFinished = true
        }
        this.$refs.scrollView.finishLoadMore()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .thepatient {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }
</style>
