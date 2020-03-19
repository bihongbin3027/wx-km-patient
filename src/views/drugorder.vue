<template>
  <div class="drug-order" v-if="loading">
    <div class="drug-row padding-right-width" @click="selectAddress()">
      <div class="drug-icon place-icon"></div>
      <div class="drug-text">
        <div class="drug-order-name" v-if="contacts">
          {{ contacts }}<span>{{ phone }}</span>
        </div>
        <div v-if="addressText">{{ addressText }}</div>
        <div v-else class="color3">新增收货地址</div>
        <md-icon name="arrow-right" color="#bfbfbf"></md-icon>
      </div>
    </div>
    <div
      class="drug-row padding-right-width"
      @click="viewLogistics()"
      v-if="drugDetail.orderStatus === 40"
    >
      <div class="drug-icon peisong-icon"></div>
      <div class="drug-text">
        <md-icon name="arrow-right" color="#bfbfbf"></md-icon>
        <div class="drug-pei">
          <div class="color4">配送中</div>
        </div>
        <div class="drug-pei">
          <div>{{ drugDetail.logisCompanyName }}</div>
        </div>
      </div>
    </div>
    <div class="drug-min-tile color1">订单明细</div>
    <div class="as-follows">
      <div
        class="as-title"
        v-for="(item, index) in drugDetail.drugOrderDetails"
        :key="index"
      >
        <div>{{ item.drugName }}（{{ item.number }}{{ item.unit }}）</div>
        <div>
          <div>&yen;{{ accMul(item.price, item.number || 0) }}</div>
        </div>
      </div>
      <div class="as-title" v-if="drugDetail.recipeType === 1">
        <span>剂数</span>
        <span>{{ drugDetail.tcmQuantity }}剂</span>
      </div>
      <div class="sa-ul">
        <div class="as-li">
          <div class="color1">商品总价</div>
          <div>&yen;{{ allPrice }}</div>
        </div>
        <div class="as-li">
          <div class="color1">运费</div>
          <div>&yen;{{ drugDetail.freight }}</div>
        </div>
        <div class="as-li">
          <div class="color1">诊金</div>
          <div>&yen;{{ drugDetail.hospitalFee || 0 }}</div>
        </div>
        <div class="as-li">
          <div class="color1">订单总价</div>
          <div>&yen;{{ drugDetail.total }}</div>
        </div>
      </div>
      <div class="as-title" v-if="drugDetail.payStatus !== 2">
        <div>需付款</div>
        <div>
          <div class="color2">&yen;{{ drugDetail.total || 0 }}</div>
        </div>
      </div>
      <div
        class="as-title"
        v-if="drugDetail.orderStatus === 30 && drugDetail.payStatus === 2"
      >
        <div>实付款</div>
        <div>
          <div class="color2">&yen;{{ drugDetail.actualTotal || 0 }}</div>
        </div>
      </div>
      <div class="sa-ul">
        <div class="as-li">
          <div class="color1">订单编号</div>
          <div>{{ drugDetail.orderNo }}</div>
        </div>
        <div class="as-li">
          <div class="color1">下单时间</div>
          <div>{{ drugDetail.createTime }}</div>
        </div>
        <div v-if="drugDetail.orderStatus === 30 && drugDetail.payStatus === 2">
          <div class="as-li">
            <div class="color1">支付方式</div>
            <div>微信支付</div>
          </div>
          <div class="as-li">
            <div class="color1">支付时间</div>
            <div>{{ drugDetail.payTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="confirm-btn" v-if="drugDetail.orderStatus === 20">
      <md-button type="primary" @click="pay()" round>立即支付</md-button>
    </div>
  </div>
</template>

<script>
import { Toast, Button, Icon } from "mand-mobile";
import { accAdd, accMul } from "../utils/utils"
import API from "../api/api";

export default {
  name: "drugorder",
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button
  },
  data() {
    return {
      loading: false,
      allPrice: 0,
      drugDetail: {
        drugOrderDetails: []
      },
      contacts: "",
      phone: "",
      addressText: "",
      addressArr: []
    };
  },
  created() {
    document.title = "药品订单";
    this.getOrderById();
    this.getAddressList();
  },
  methods: {
    viewLogistics() {
      window.location.href = `http://drugstore.km1818.com:8182/zyf/search.htm?mbl_no=${
        this.drugDetail.phone
      }`;
    },
    accMul(x1, x2) {
      return accMul(x1, x2)
    },
    selectAddress() {
      this.$router.push({
        path: '/address',
        query: {
          id: this.$route.query.id,
          prev: '/drugorder'
        }
      })
    },
    getAddressList() {
      let { addressData } = this.$route.query
      if (addressData) {
        addressData = JSON.parse(addressData);
        let text = `${addressData.provinceName},${addressData.cityName},${addressData.districtName},${addressData.address}`;
        this.addressText = text;
        this.contacts = addressData.contacts;
        this.phone = addressData.phone;
      } else {
        API.getAddressList({
          page: 1,
          rows: 10
        }).then(res => {
          if (res) {
            let text = `${res.dataList[0].provinceName},${res.dataList[0].cityName},${res.dataList[0].districtName},${res.dataList[0].address}`;
            this.addressText = res ? text : "";
            this.contacts = res.dataList[0].contacts;
            this.phone = res.dataList[0].phone;
            this.addressArr = res.dataList;
          }
        });
      }
    },
    getOrderById() {
      Toast.loading("加载中...");
      API.getOrderById({
        id: this.$route.query.id
      }).then(res => {
        Toast.hide();
        this.loading = true;
        this.drugDetail = res;
        if (res.drugOrderDetails) {
          let total = 0;
          res.drugOrderDetails.forEach(element => {
            total = accAdd(total, accMul(element.price, element.number || 0));
          });
          if (this.drugDetail.recipeType === 1) {
            this.allPrice = accMul(total, this.drugDetail.tcmQuantity);
          } else {
            this.allPrice = total;
          }
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
              self.$router.push("/order");
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              Toast.info("已取消支付", 1500);
            } else {
              Toast.info("支付失败", 1500);
            }
          }
        );
      }
      Toast.loading("支付中...");
      API.editOrderAddress({
        id: this.drugDetail.id,
        address: this.addressText,
        consignee: this.contacts,
        phone: this.phone
      }).then(() => {
        API.pay({
          id: this.drugDetail.id
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
      })
    }
  }
};
</script>
