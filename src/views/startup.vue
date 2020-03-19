<template>
  <div></div>
</template>

<script>
import { Toast } from "mand-mobile";
import { saveToLocal } from "../utils/utils";
import API from "../api/api"

export default {
  name: "statup",
  created() {
    let path = "";
    let query = this.$route.query;
    let fowardPage = query.fowardPage;
    let search = {};
    if (query.accessToken) {
      saveToLocal("h5", "accessToken", query.accessToken);
    }
    if (query.action) {
      if (query.action === "MYDOCTOR") {
        path = "/doctorlist";
      }
      if (query.action === "DOCTOR_DETAIL") {
        path = "/doctordetail";
      }
      if (query.action === "MYORDER") {
        path = "/order";
      }
      if (query.action === "ORDER_DETAIL") {
        path = "/orderdetail";
      }
      if (query.action === "ORDER_DETAIL_CONSULT") {
        path = "/drugorder";
      }
      if (query.action === "UPDATE_USERINFO") {
        path = "/member";
      }
      if (query.action === 'IM') {
        path = "/talk"
      }
    }
    if (query.action === "LOGIN" && fowardPage) {
      let searchName = "";
      path = "/login";
      if (fowardPage === "MYORDER") {
        searchName = "order";
      }
      if (fowardPage === "MYDOCTOR") {
        searchName = "doctorlist"
      }
      search.fowardPage = searchName;
    }
    if (query.data) {
      search.id = query.data;
    }
    let toRouter = {
      path
    }
    if (search.id) {
      toRouter.query = search
    }
    if (path === "/talk") {
      Toast.loading("请稍候");
      API.getMemberConsultByOrderId({
        id: search.id
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
        })
      })
    } else {
      this.$router.push(toRouter);
    }
  }
};
</script>
