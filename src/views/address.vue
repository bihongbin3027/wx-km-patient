<template>
  <div v-if="loading">
    <ul class="user-list" v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="selectAddress(item)">
        <div>
          <div class="ad-user">
            <b v-if="item.isDefault">【默认】</b>{{ item.contacts
            }}<span class="color1">{{ item.phone }}</span>
          </div>
          <div class="ad-text color1">
            {{ item.provinceName }}{{ item.cityName }}{{ item.districtName
            }}{{ item.address }}
          </div>
        </div>
        <div class="icon-event">
          <md-icon
            name="share"
            size="lg"
            color="#26b7bc"
            @click="editRow(item)"
          ></md-icon>
          <md-icon
            name="delete"
            size="lg"
            color="#26b7bc"
            @click="deleteRow(item)"
          ></md-icon>
        </div>
      </li>
    </ul>
    <div class="no-result" v-else>暂无数据</div>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round
        >新增收货地址</md-button
      >
    </div>
  </div>
</template>

<script>
import { Button, Icon, Dialog, Toast } from "mand-mobile";
import API from "../api/api";

export default {
  name: "addresslist",
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog
  },
  data() {
    return {
      loading: false,
      list: []
    };
  },
  created() {
    document.title = "收货地址";
    this.getAddressList();
  },
  methods: {
    selectAddress(item) {
      const { id, prev } = this.$route.query
      if (id) {
        if (prev === '/drugorder') {
          this.$router.push({
            path: prev,
            query: {
              id,
              addressData: JSON.stringify(item)
            }
          })
        }
      }
    },
    getAddressList() {
      Toast.loading("加载中...");
      API.getAddressList({
        page: 1,
        rows: 10
      }).then(res => {
        Toast.hide();
        this.loading = true;
        if (res) {
          this.list = res.dataList;
        }
      });
    },
    editRow(item) {
      this.$router.push({
        path: "/editaddress",
        query: {
          search: JSON.stringify(item)
        }
      });
    },
    deleteRow({ id }) {
      Dialog.confirm({
        title: "提示",
        content: "确认删除吗？",
        confirmText: "确定",
        onConfirm: () => {
          Toast.loading("删除中...");
          API.delAddress({ id }).then(() => {
            Toast.hide();
            Toast.info("删除成功", 1500);
            this.getAddressList();
          });
        }
      });
    },
    confirmClick() {
      this.$router.push("/editaddress");
    }
  }
};
</script>

