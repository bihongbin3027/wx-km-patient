<template>
  <div class="doctor-detail" v-if="loading">
    <div class="doctor-bg">
      <div class="doctor-info">
        <div
          class="doctor-img"
          :style="{ backgroundImage: `url(${doctorDetail.portrait})` }"
        ></div>
        <div class="doctor-more">
          <div>
            <div class="doctor-text">
              {{ doctorDetail.name
              }}<span>{{ doctorDetail.technicalTitleName }}</span
              ><span v-text="deps()"></span>
            </div>
            <div class="doctor-address">
              {{ doctorDetail.organizationName }}
            </div>
          </div>
        </div>
        <div
          :class="doctorDetail.followed ? 'follow_icon active' : 'follow_icon'"
          @click="followClick()"
        ></div>
      </div>
      <ul class="doctor-count">
        <li>
          <div class="count-num">{{ doctorDetail.attentionCount }}</div>
          <div>关注人数</div>
        </li>
        <li>
          <div class="count-num">100%</div>
          <div>好评率</div>
        </li>
        <li>
          <div class="count-num">{{ doctorDetail.countDcotorCon }}</div>
          <div>咨询人次</div>
        </li>
      </ul>
    </div>
    <div class="be-goodat">
      擅长：<span>{{ doctorDetail.personalGood }}</span>
    </div>
    <div class="item-box">
      <div class="list-item next-icon" @click="ishasUserInfo()">
        <div class="item-left-text">
          <i class="tw_icon"></i>
          图文咨询
        </div>
        <div class="item-right-text color2">
          &yen;{{ doctorDetail.consultingFees }}<md-icon name="arrow-right" color="#bfbfbf"></md-icon>
        </div>
      </div>
      <div class="list-item disable">
        <div class="item-left-text">
          <i class="zj_icon"></i>
          专家团队
        </div>
        <div class="item-right-text">即将开通</div>
      </div>
      <div class="list-item disable">
        <div class="item-left-text">
          <i class="dj_icon"></i>
          专家定制服务包
        </div>
        <div class="item-right-text">即将开通</div>
      </div>
    </div>
    <dl class="item-dl">
      <dt>医生介绍</dt>
      <dd>{{ doctorDetail.personalProfile }}</dd>
    </dl>
  </div>
</template>

<script>
import { Icon, Toast } from "mand-mobile";
import API from "../api/api";

export default {
  name: "doctordetail",
  components: {
    [Icon.name]: Icon
  },
  data() {
    return {
      loading: false,
      doctorDetail: {}
    };
  },
  created() {
    document.title = "医生主页";
    this.init();
  },
  methods: {
    deps() {
      let departmentsList = this.doctorDetail.departments
      if (departmentsList && departmentsList.length) {
        let arr = []
        departmentsList.forEach((el) => {
          arr.push(el.defaultDepartmentName)
        })
        return arr.join(",");
      }
    },
    followClick() {
      if (this.doctorDetail.followed) {
        Toast.loading("取消中...");
        API.unFoucusDoctor({
          id: this.doctorDetail.id
        }).then(() => {
          this.init();
          Toast.hide();
          Toast.info("已取消", 1500);
        });
      } else {
        Toast.loading("关注中...");
        API.foucusDoctor({
          id: this.doctorDetail.id
        }).then(() => {
          this.init();
          Toast.hide();
          Toast.info("已关注", 1500);
        });
      }
    },
    ishasUserInfo() {
      if (this.doctorDetail.consultingFeesSwitch === 1) {
        this.$router.push({
          path: "/perfectinfo",
          query: {
            id: this.doctorDetail.id
          }
        });
      } else {
        Toast.info("医生未开启服务", 1500);
      }
    },
    init() {
      Toast.loading("加载中...");
      API.getMyDotorById({
        id: this.$route.query.id
      }).then(res => {
        this.loading = true;
        Toast.hide();
        if (res) {
          this.doctorDetail = res;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/index.scss";
.doctor-detail {
  .follow_icon {
    position: absolute;
    right: 60px;
    top: 50%;
    margin-top: -40px;
    z-index: 1;
  }
  .doctor-bg {
    height: 332px;
    color: #fff;
    @include bg(doctor_bg);
    .doctor-info {
      display: flex;
      padding: 30px 39px;
      position: relative;
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
        display: flex;
        align-items: center;
        .doctor-text {
          font-size: 32px;
          span {
            font-size: 28px;
            margin-left: 30px;
          }
        }
        .doctor-address {
          font-size: 26px;
          margin-top: 20px;
        }
      }
    }
    .doctor-count {
      display: flex;
      height: 143px;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      position: relative;
      padding: 30px;
      &:after {
        content: "";
        position: absolute;
        left: 30px;
        right: 30px;
        top: 0;
        height: 2px;
        background-color: #14b2b6;
        transform: scaleY(0.5) translateY(100%);
        transform-origin: 50% 100%;
        z-index: 1;
      }
      > li {
        width: 33.3%;
        .count-num {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
          + div {
            font-size: 26px;
          }
        }
      }
    }
  }
  .be-goodat {
    line-height: 40px;
    background-color: #fff;
    padding: 20px 30px;
    margin-top: 20px;
    span {
      color: #888;
    }
  }
}
</style>
