<template>
  <div class="attach">
    <div class="attach_bd">
      <div class="cover">
        <i class="web_wechat_folder"></i>
      </div>
      <div class="cont">
        <p class="title" v-html="message.FileName"></p>
        <div class="opr">
          <span class="sep">{{ message.FileSize }}</span>
          <span v-show="message.FileUrl != ''">|</span>
          <a
            target="_blank"
            v-show="message.FileUrl != ''"
            :href="message.FileUrl + '?download=1'"
          >
            下载
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*附件消息*/
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    message: {}
  },
  methods: {},
  created() {}
};
</script>

<style lang="scss" scoped>
.attach {
  .attach_bd {
    .cont {
      vertical-align: middle;
      .title {
        text-align: left;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        max-width: 100px;
      }
      .opr {
        margin-top: 0.1rem;
        a {
          color: #26B7BC;
        }
      }
    }
  }
}
</style>
