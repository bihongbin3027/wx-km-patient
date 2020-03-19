<template>
  <div v-if="loading">
    <ul class="doctor-list" v-if="list.length">
      <li v-for="(item, index) in list" :key="index" @click="todetail(item)">
        <div class="doctor-info">
          <div
            class="doctor-img"
            :style="{ backgroundImage: `url(${item.doctorHead})` }"
          ></div>
          <div class="doctor-more">
            <div class="doctor-text">
              {{ item.doctorName }}<span>{{ item.doctorTitle }}</span
              ><span v-text="deps(item)"></span>
            </div>
            <div class="doctor-address color1">{{ item.organizationName }}</div>
            <div class="doctor-label-box">
              <b class="doctor-label label-border1">图文咨询</b>
              <b class="doctor-label label-border2">专家团队</b>
            </div>
          </div>
        </div>
        <p class="doctor-goodat">
          擅长：<span class="color1">{{ item.advantage }}</span>
        </p>
      </li>
    </ul>
    <div class="no-result" v-else>暂无数据</div>
  </div>
</template>

<script>
import API from "../api/api";
import { Toast } from "mand-mobile";

export default {
  name: "doctorlist",
  data() {
    return {
      loading: false,
      list: []
    };
  },
  created() {
    document.title = "我的医生";
    this.getMyDotors();
  },
  methods: {
    todetail({ doctorId }) {
      this.$router.push({
        path: "doctordetail",
        query: {
          id: doctorId
        }
      });
    },
    deps({ staffDepartmentList }) {
      if (staffDepartmentList) {
        let arr = []
        staffDepartmentList.forEach((el) => {
          arr.push(el.name)
        })
        return arr.join(",");
      }
    },
    getMyDotors() {
      Toast.loading("加载中...");
      API.getMyDotors({
        page: 1,
        rows: 10
      }).then(res => {
        this.loading = true;
        Toast.hide();
        if (res) {
          this.list = res.content.list;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.doctor-list {
  background-color: #fff;
  > li {
    padding: 30px 40px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 30px;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: #eaeaea;
      z-index: 1;
    }
  }
  .doctor-info {
    display: flex;
    .doctor-img {
      width: 128px;
      height: 128px;
      flex: 0 0 128px;
      border-radius: 100%;
      background-color: #e5e5e5;
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: contain;
      margin-right: 26px;
    }
    .doctor-more {
      flex: 1;
      .doctor-text {
        font-size: 32px;
        span {
          font-size: 28px;
          margin-left: 30px;
        }
      }
      .doctor-address {
        font-size: 26px;
        margin-top: 16px;
      }
      .doctor-label-box {
        display: flex;
        align-items: center;
        margin-top: 16px;
        .doctor-label {
          margin-right: 24px;
        }
      }
    }
  }
  .doctor-goodat {
    font-size: 26px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 25px;
  }
}
</style>
