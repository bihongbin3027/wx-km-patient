<template>
  <div class="msg_url">
    <a :href="message.FileUrl" target="_blank" class="app">
      <h4 class="title" v-text="message.FileName"></h4>
      <img class="cover" :src="message.Conver" />
      <p class="desc" v-text="message.Desc"></p>
    </a>
  </div>
</template>
<script>
/*连接消息 */
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

<style lang="scss" rel="stylesheet/less" scoped>
.msg_url {
  max-width: 40%;
  a {
    display: inline-block;
    width: 100%;
  }
}
</style>
