<template>
  <div id="wrap" class="perfect-info">
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
      >
        <div
          class="input-operator"
          slot="right"
          @click="getCode()"
          @blur="onBlur"
          v-html="codeText"
        ></div>
      </md-input-item>
      <md-input-item
        class="required"
        title="验证码："
        placeholder="请输入您的验证码"
        v-model="code"
        :maxlength="6"
        @blur="onBlur"
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
        @blur="onBlur"
        clearable
      ></md-input-item>
      <md-field-item
        class="required"
        title="家人关系："
        :content="relaValue"
        @click="showRela"
        arrow
        solid
      ></md-field-item>
    </md-field>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round>保存</md-button>
    </div>
    <md-selector
      v-model="isRelaShow"
      :default-value="relaDefault"
      :data="relaData"
      title="家人关系"
      @choose="onRelaChoose"
    >
    </md-selector>
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
  Selector,
  Toast,
  Button
} from "mand-mobile";
import district from "../utils/district";
import API from "../api/api";

let timerTime = 60;
let timerStatus = false;
// var height= document.documentElement.clientHeight; //获取当前可视区域的高度存到height变量
//   window.onload = function(){ //在页面整体加载完毕时
//     document.getElementById('wrap').style.height= height + 'px'//把获取到的高度赋值给根div
// }
export default {
  name: "editmember",
  components: {
    [Picker.name]: Picker,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Selector.name]: Selector,
    [Button.name]: Button
  },
  data() {
    return {
      isPickerShow: false,
      pickerData: district,
      pickerValue: "",
      name: "",
      idcard: "",
      sex: "",
      age: "",
      phone: "",
      code: "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      areaCode: "",
      area: "",
      detailedAddress: "",
      codeText: '<span class="color3">获取验证码</span>',
      isRelaShow: false,
      relaData: [
        {
          value: "0",
          text: "父亲"
        },
        {
          value: "1",
          text: "母亲"
        },
        {
          value: "2",
          text: "妻子"
        },
        {
          value: "3",
          text: "丈夫"
        },
        {
          value: "4",
          text: "儿子"
        },
        {
          value: "5",
          text: "女儿"
        },
        {
          value: "6",
          text: "岳父"
        },
        {
          value: "7",
          text: "岳母"
        },
        {
          value: "8",
          text: "其他"
        }
      ],
      relaDefault: "0",
      relaValue: "父亲"
    };
  },
  created() {
    document.title = "新增家庭成员";
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
    getBirthdayFromIdCard(idCard) {
      let birthday = "";
      if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
          birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
          birthday = idCard.substr(6, 8);
        }
        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
      }
      return birthday;
    },
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
    isPhone() {
      let regphone = /(^1[3|4|5|7|6|8|9]\d{9}$)|(^09\d{8}$)|^0\d{2,3}-?\d{7,8}$/;
      let bool = regphone.test(this.phone) ? true : false;
      if (!bool) {
        Toast.info("请填写正确的手机号", 1500);
      }
      return bool;
    },
    getCode() {
      if (this.isPhone()) {
        if (timerStatus) {
          return;
        }
        Toast.loading("验证码发送中..");
        API.sendCodeRedPassword({
          phone: this.phone,
        }).then(res => {
          Toast.hide();
          Toast.info("验证码已发送", 1500);
          this.codeAuthToken = res
          this.timer = setInterval(() => {
            if (timerTime === 0) {
              clearInterval(this.timer);
              timerTime = 60;
              timerStatus = false;
              this.codeText = '<span class="color3">获取验证码</span>';
            } else {
              this.codeText = `<span class="color1">${timerTime}秒</span>`;
              timerStatus = true;
              timerTime--;
            }
          }, 1000);
        });
      }
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
    showRela() {
      this.isRelaShow = true;
    },
    onRelaChoose(obj) {
      this.relaDefault = obj.value;
      this.relaValue = obj.text;
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
      if (!this.code) {
        Toast.info("请输入验证码", 1500);
        return;
      }
      // if (this.code !== this) {
      //   Toast.failed("验证码不正确", 1500);
      //   return;
      // }
      if (!this.province) {
        Toast.info("请选择收货地址", 1500);
        return;
      }
      if (!this.detailedAddress) {
        Toast.info("请填写详细地址", 1500);
        return;
      }
      let params = {
        name: this.name,
        idNumber: this.idcard,
        birthday: this.getBirthdayFromIdCard(this.idcard),
        sex: this.sex,
        age: this.age,
        phone: this.phone,
        verifyCode: this.code,
        province: this.provinceCode,
        city: this.cityCode,
        district: this.areaCode,
        address: this.detailedAddress,
        relation: this.relaDefault,
        codeAuthToken: this.codeAuthToken
      };
      Toast.loading("提交中...");
      API.addFamilyMemberVO(params).then(() => {
        const { id, path, consultingFees } = this.$route.query
        Toast.hide();
        if (path) {
          this.$router.push({
            path,
            query: {
              id
            }
          })
        } else {
          this.$router.push("/member");
        }
      });
    },
    onBlur() {
      //失去焦点 页面滚动回顶部
      document.body.scrollTop = 0
      //滚动到顶部 或者使用
      window.scrollTo(0,0)
    }
  }
};
</script>
