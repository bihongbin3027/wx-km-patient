<template>
  <div>
    <md-field class="field-style">
      <md-input-item
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
          v-html="codeText"
        ></div>
      </md-input-item>
      <md-input-item
        title="验证码："
        placeholder="请输入您的验证码"
        v-model="code"
        :maxlength="6"
        clearable
      ></md-input-item>
    </md-field>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round>提交</md-button>
    </div>
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
import API from "../api/api";

let timerTime = 60;
let timerStatus = false;

export default {
  name: "login",
  components: {
    [Picker.name]: Picker,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Button.name]: Button
  },
  data() {
    return {
      phone: "",
      code: "",
      codeText: '<span class="color3">获取验证码</span>'
    };
  },
  created() {
    document.title = "注册会员"
  },
  methods: {
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
        API.sendPhoneGetCode({
          phone: this.phone
        }).then(res => {
          Toast.hide();
          Toast.info("验证码已发送", 1500);
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
    confirmClick() {
      if (!this.isPhone()) {
        return;
      }
      if (!this.code) {
        Toast.info("请输入验证码", 1500);
        return;
      }
      Toast.loading("提交中...");
      API.loginByPhone({
        phone: this.phone,
        code: this.code
      }).then(() => {
        Toast.hide();
        let params = {
          path: `/${this.$route.query.fowardPage}`
        };
        if (this.$route.query.id) {
          params.query = {
            id: this.$route.query.id
          };
        }
        this.$router.push(params);
      });
    }
  }
};
</script>

