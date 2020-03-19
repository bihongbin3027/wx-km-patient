<template>
  <div>
    <md-field class="field-style">
      <md-input-item
        title="联系人："
        placeholder="请输入您的姓名"
        v-model="name"
        :maxlength="10"
        clearable
      ></md-input-item>
      <md-input-item
        title="联系电话："
        placeholder="请输入您的联系方式"
        type="tel"
        v-model="phone"
        :maxlength="11"
      ></md-input-item>
      <md-field-item
        class="dw-icon"
        title="请选择地区："
        :addon="pickerValue"
        @click="isPickerShow = true"
      ></md-field-item>
      <md-input-item
        title="详细地址："
        placeholder="街道门牌信息"
        v-model="detailedAddress"
        :maxlength="100"
        clearable
      ></md-input-item>
    </md-field>
    <md-field class="field-style isnormal">
      <md-check-list :options="fruits" v-model="favorites" />
    </md-field>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round>保存</md-button>
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
  Button,
  CheckList
} from "mand-mobile";
import district from "../utils/district";
import API from "../api/api";

export default {
  name: "editaddress",
  components: {
    [Picker.name]: Picker,
    [InputItem.name]: InputItem,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [Button.name]: Button,
    [CheckList.name]: CheckList
  },
  data() {
    return {
      isPickerShow: false,
      pickerData: district,
      pickerValue: "",
      name: "",
      phone: "",
      provinceCode: "",
      province: "",
      cityCode: "",
      city: "",
      areaCode: "",
      area: "",
      detailedAddress: "",
      favorites: [],
      fruits: [{ value: "1", label: "是否默认" }]
    };
  },
  created() {
    document.title = "新增/编辑地址";
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let search = this.$route.query.search;
      if (search) {
        search = JSON.parse(search);
        this.name = search.contacts;
        this.phone = search.phone;
        if (search.province) {
          this.provinceCode = search.province;
          this.province = search.provinceName;
        }
        if (search.city) {
          this.cityCode = search.city;
          this.city = search.cityName;
        }
        if (search.district) {
          this.areaCode = search.district;
          this.area = search.districtName;
        }
        this.pickerValue = `${search.provinceName} ${search.cityName} ${
          search.districtName
        }`;
        this.detailedAddress = search.address;
        if (search.isDefault) {
          this.favorites.push("1");
        }
        setTimeout(() => {
          this.$refs.picker.refresh();
        }, 0);
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
    confirmClick() {
      let regphone = /(^1[3|4|5|7|6|8|9]\d{9}$)|(^09\d{8}$)|^0\d{2,3}-?\d{7,8}$/;
      let regname = /^[\u4E00-\u9FA5]{2,10}$/;
      let { search, perv } = this.$route.query;
      if (!this.name) {
        Toast.info("请输入您的姓名", 1500);
        return;
      }
      if (!regname.test(this.name)) {
        Toast({
          message: "联系人在2-10个中文字符内",
          duration: 1500
        });
        return;
      }
      if (!regphone.test(this.phone)) {
        Toast.info("请输入您的联系方式", 1500);
        return;
      }
      if (!this.province) {
        Toast.info("请选择地址", 1500);
        return;
      }
      if (!this.detailedAddress) {
        Toast.info("请输入街道门牌信息", 1500);
        return;
      }
      let params = {
        contacts: this.name,
        phone: this.phone,
        province: this.provinceCode,
        city: this.cityCode,
        district: this.areaCode,
        address: this.detailedAddress,
        isDefault: this.favorites[0] ? true : false
      };
      if (search) {
        search = JSON.parse(search);
        params.id = search.id;
      }
      Toast.loading("提交中...");
      API.addAddress(params).then(() => {
        Toast.hide();
        this.$router.go(-1);
      });
    }
  }
};
</script>

