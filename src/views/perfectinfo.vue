<template>
  <div class="perfect-info" v-if="loading">
    <md-field class="field-style">
      <md-input-item
        class="required"
        title="姓名："
        placeholder="请输入真实姓名，方便医生联系"
        v-model="name"
        :maxlength="10"
        clearable
      ></md-input-item>
      <md-input-item
        class="required"
        title="身份证："
        placeholder="请输入您的身份证号码"
        v-model="idcard"
        :maxlength="18"
        clearable
      ></md-input-item>
      <md-input-item
        class="required"
        title="性别："
        :value="sexformat()"
        readonly
      ></md-input-item>
      <md-input-item
        class="required"
        title="年龄："
        :value="ageformat()"
        readonly
      ></md-input-item>
      <md-input-item
        class="required"
        title="手机号："
        placeholder="请输入您的手机号"
        type="phone"
        v-model="phone"
        clearable
      ></md-input-item>
      <md-field-item
        class="dw-icon required"
        title="所在地区："
        :addon="pickerValue"
        @click="isPickerShow = true"
      ></md-field-item>
      <md-input-item
        class="required"
        title="详细地址："
        placeholder="请填写详细地址"
        v-model="detailedAddress"
        :maxlength="100"
        clearable
      ></md-input-item>
    </md-field>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round>提交</md-button>
    </div>
    <md-picker
      ref="picker"
      v-model="isPickerShow"
      :data="pickerData"
      :cols="3"
      is-cascade
      title="选择省市区/县"
      @confirm="onPickerConfirm()"
    ></md-picker>
  </div>
</template>

<script>
import {
  Picker,
  InputItem,
  Field,
  FieldItem,
  Toast,
  Button
} from "mand-mobile";
import district from "../utils/district";
import API from "../api/api";

export default {
  name: "perfectinfo",
  components: {
    [Picker.name]: Picker,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Button.name]: Button
  },
  data() {
    return {
      loading: false,
      isPickerShow: false,
      pickerData: district,
      pickerValue: "",
      name: "",
      idcard: "",
      sex: "",
      age: "",
      phone: "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      areaCode: "",
      area: "",
      detailedAddress: ""
    };
  },
  created() {
    document.title = "完善个人信息";
    this.init();
  },
  watch: {
    idcard(val) {
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = myDate.getFullYear() - val.substring(6, 10) - 1;
      if (val.length === 18) {
        if (
          val.substring(10, 12) < month ||
          (val.substring(10, 12) == month && val.substring(12, 14) <= day)
        ) {
          age++;
        }
        this.age = age + 1;
        if (parseInt(val.substr(16, 1)) % 2 === 1) {
          this.sex = 0;
        } else {
          this.sex = 1;
        }
      } else {
        this.age = this.sex = "";
      }
    }
  },
  methods: {
    sexformat() {
      if (this.sex === 0) {
        return "男";
      } else if (this.sex === 1) {
        return "女";
      } else {
        return "";
      }
    },
    ageformat() {
      if (this.age) {
        return `${this.age}岁`;
      } else {
        return "";
      }
    },
    init() {
      Toast.loading("加载中...");
      API.getUserInfo().then(res => {
        Toast.hide();
        if (res.isComplete) {
          let { id, consultingFees } = this.$route.query;
          if (id) {
            this.$router.replace({
              path: "/consult",
              query: {
                id,
                consultingFees
              }
            });
          } else {
            this.loading = true;
            if (res.trueName) {
              this.name = res.trueName;
            }
            if (res.idNumber) {
              this.idcard = res.idNumber;
            }
            if (res.phone) {
              this.phone = res.phone;
            }
            if (res.address) {
              let arr = [].concat(res.address.split(","));
              this.detailedAddress = arr[arr.length - 1];
              this.pickerValue = arr.slice(0, arr.length - 1).join(" ");
            }
          }
        } else {
          this.loading = true;
        }
      });
    },
    isPhone() {
      let regphone = /(^1[3|4|5|7|6|8|9]\d{9}$)|(^09\d{8}$)|^0\d{2,3}-?\d{7,8}$/;
      let bool = regphone.test(this.phone) ? true : false;
      if (!bool) {
        Toast.info("请填写正确的手机号", 1500);
      }
      return bool;
    },
    onPickerConfirm() {
      const values = this.$refs[`picker`].getColumnValues();
      let res = "";
      values.forEach(value => {
        value && (res += `${value.text || value.label} `);
      });
      if (values[0]) {
        this.provinceCode = values[0].value;
        this.province = values[0].label;
      } else {
        this.provinceCode = "-1";
        this.province = "-1";
      }
      if (values[1]) {
        this.cityCode = values[1].value;
        this.city = values[1].label;
      } else {
        this.cityCode = "-1";
        this.city = "-1";
      }
      if (values[2]) {
        this.areaCode = values[2].value;
        this.area = values[2].label;
      } else {
        this.areaCode = "-1";
        this.area = "-1";
      }
      this[`pickerValue`] = res;
    },
    confirmClick() {
      let regcard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
      let regname = /^[\u4E00-\u9FA5]{2,10}$/;
      if (!this.name) {
        Toast.info("请填写姓名", 1500);
        return;
      }
      if (!regname.test(this.name)) {
        Toast.info("姓名在2-10个中文字符内", 1500);
        return;
      }
      if (!regcard.test(this.idcard)) {
        Toast.info("请填写正确的身份证号码", 1500);
        return;
      }
      if (!this.isPhone()) {
        return;
      }
      if (!this.pickerValue) {
        Toast.info("请选择地址", 1500);
        return;
      }
      if (!this.detailedAddress) {
        Toast.info("请填写详细地址", 1500);
        return;
      }
      Toast.loading("提交中...");
      API.updateUserInfoJJ({
        trueName: this.name,
        idNumber: this.idcard,
        address: this.pickerValue.split(" ").join(",") + this.detailedAddress
      }).then(() => {
        let { id, consultingFees } = this.$route.query;
        Toast.hide();
        if (id) {
          this.$router.push({
            path: "/consult",
            query: {
              id,
              consultingFees
            }
          });
        } else {
          Toast.info("修改成功", 1500);
        }
      });
    }
  }
};
</script>
