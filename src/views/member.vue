<template>
  <div v-if="loading">
    <ul class="user-list small" v-if="list !== null && list.length">
      <li v-for="(item, index) in list" :key="index" @click="selectMember(item)">
        <div>
          <div class="ad-user">
            <b v-if="index === 0">【默认】</b>{{ item.name }}（{{
              sexformat(item.sex)
            }}，{{ item.age }}岁）
          </div>
          <div class="ad-phone color1">{{ item.phone }}</div>
        </div>
        <div class="icon-event">
          <div></div>
          <md-icon
            name="share"
            size="lg"
            color="#26b7bc"
            v-if="false"
          ></md-icon>
          <md-icon
            name="delete"
            size="lg"
            color="#26b7bc"
            @click.stop="deleteRow(item)"
          ></md-icon>
        </div>
      </li>
    </ul>
    <div class="no-result" v-else>暂无数据</div>
    <div class="confirm-btn">
      <md-button type="primary" @click="confirmClick()" round
        >新增家庭成员</md-button
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
    document.title = "选择家庭成员";
    this.init();
  },
  methods: {
    selectMember({ age, sex, id, idNumber, name }) {
      let query = this.$route.query
      let queryId = query.id
      let { path, consultingFees } = query
      if (path) {
        this.$router.push({
          path,
          query: {
            id: queryId,
            consultingFees,
            age,
            sex,
            patientId: id,
            idNumber,
            name
          }
        })
      }
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
    init() {
      Toast.loading("加载中...");
      API.getFamilyMemberList({
        page: 1,
        pageSize: 10
      }).then(res => {
        Toast.hide();
        this.loading = true;
        this.list = res;
      });
    },
    deleteRow({ id }) {
      Dialog.confirm({
        title: "提示",
        content: "确认删除吗？",
        confirmText: "确定",
        onConfirm: () => {
          Toast.loading("删除中...");
          API.delFamilyMemberVOById({
            id
          }).then(() => {
            Toast.hide();
            Toast.info("已删除");
            this.init();
          });
        }
      });
    },
    confirmClick() {
      let { path, id } = this.$route.query
      if (path) {
        this.$router.push({
          path: "/editmember",
          query: {
            path,
            id
          }
        });
      } else {
        this.$router.push("/editmember");
      }
    }
  }
};
</script>

