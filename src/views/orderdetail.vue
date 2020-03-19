<template>
  <div class="order-detail" v-if="loading">
    <div class="orderd-name">
      {{ orderDetail.patientName }}（ {{ formatGender() }}，{{
        orderDetail.patientAge
      }}岁 ）<span>{{ orderDetail.patientPhone }}</span>
    </div>
    <div class="orderd-info">
      <div>{{ orderDetail.doctorName }}（ {{ orderDetail.hospitalName }}， {{orderDetail.departmentName}} ）</div>
      <div>图文咨询服务</div>
      <div>单价：&yen;{{ orderDetail.total || 0 }}</div>
    </div>
    <div class="sa-ul">
      <div class="as-li">
        <div class="color1">订单编号</div>
        <div>{{ orderDetail.orderNo }}</div>
      </div>
      <div class="as-li">
        <div class="color1">下单时间</div>
        <div>{{ orderDetail.createTime }}</div>
      </div>
      <div  v-if="orderDetail.orderStatus === 30 && orderDetail.payStatus === 2">
        <div class="as-li">
          <div class="color1">支付方式</div>
          <div>微信支付</div>
        </div>
        <div class="as-li">
          <div class="color1">支付时间</div>
          <div>{{ orderDetail.payTime }}</div>
        </div>
      </div>
    </div>
    <div class="sa-ul">
      <div class="as-li">
        <div class="color1">总额</div>
        <div>&yen;{{ orderDetail.total || 0 }}</div>
      </div>
      <div class="as-li" v-if="orderDetail.payStatus !== 2">
        <div class="color1">需付款</div>
        <div class="color2">&yen;{{ orderDetail.total || 0 }}</div>
      </div>
      <div class="as-li" v-else>
        <div class="color1">实付款</div>
        <div class="color2">&yen;{{ orderDetail.actualTotal || 0 }}</div>
      </div>
    </div>
    <div class="confirm-btn" v-if="orderDetail.orderStatus === 20">
      <md-button type="primary" @click.stop="pay()" round>立即支付</md-button>
      <div class="m-t-10">
        <md-button type="default" @click.stop="cancelOrder()" round>取消订单 </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Button, Dialog } from "mand-mobile";
import API from "../api/api";
import { setTimeout } from 'timers';

export default {
  name: "orderdetail",
  data() {
    return {
      loading: false,
      orderDetail: {}
    };
  },
  components: {
    [Button.name]: Button
  },
  created() {
    document.title = "订单详情";
    this.init();
  },
  methods: {
    formatGender() {
      let { patientGender } = this.orderDetail;
      if (patientGender === 0) {
        return "男";
      } else if (patientGender === 1) {
        return "女";
      } else {
        return "未知";
      }
    },
    init() {
      Toast.loading("加载中...");
      API.getOrderById({
        id: this.$route.query.id
      }).then(res => {
        Toast.hide();
        this.loading = true;
        this.orderDetail = res;
      });
    },
    cancelOrder() {
      Dialog.confirm({
        title: "提示",
        content: "确定取消订单吗？",
        confirmText: "确定",
        onConfirm: () => {
          API.cancle({ id: this.$route.query.id }).then(() => {
            Toast.info("已取消", 1500);
            this.init();
          });
        }
      });
    },
    pay() {
      let self = this;
      function onBridgeReady() {
        // eslint-disable-next-line
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: self.rows.appId, // 公众号名称，由商户传入
            timeStamp: self.rows.timeStamp, // 时间戳 这里随意使用了一个值
            nonceStr: self.rows.nonceStr, // 随机串
            package: self.rows.package, // 扩展字段，由商户传入
            signType: self.rows.signType, // 微信签名方式:sha1
            paySign: self.rows.paySign // 微信签名
          },
          function(res) {
            Toast.hide();
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              Toast.info("支付成功", 1500);
              setTimeout(() => {
                self.$router.push("/order");
              }, 1500)
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              Toast.info("已取消支付", 1500);
            } else {
              Toast.info("支付失败", 1500);
            }
          }
        );
      }
      Toast.loading("支付中...");
      API.pay({
        id: this.orderDetail.id
      }).then(res => {
        this.rows = res;
        if (typeof WeixinJSBridge === "undefined") {
          if (document.addEventListener) {
            document.addEventListener(
              "WeixinJSBridgeReady",
              onBridgeReady,
              false
            );
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
            document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-detail {
  .orderd-name {
    display: flex;
    min-height: 88px;
    align-items: center;
    background-color: #fff;
    padding-left: 30px;
    padding-right: 30px;
    position: relative;
    span {
      margin-left: 20px;
    }
  }
  .orderd-info {
    margin-top: 20px;
    padding: 20px 30px;
    background-color: #fff;
  }
  .orderd-info > div {
    display: flex;
    height: 56px;
    align-items: center;
  }
  .sa-ul {
    padding-left: 30px;
    padding-right: 30px;
    background-color: #fff;
    margin-top: 20px;
  }
}
</style>
