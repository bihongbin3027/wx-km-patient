<template>
  <div
    class="voice"
    :style="{ width: message.voiceSize / 10000 + 30 + 'px' }"
    @click="playVoice(message)"
  >
    <i
      class="icon"
      :class="{
        voice_ok: message.isSend,
        voice_waiting: !message.isSend,
        voice_playing: message.voicePlaying && message.isSend,
        voice__play_over: message.voicePlaying && !message.isSend
      }"
    ></i>
    <!--语音总时长-->
    <span class="duration">
      {{ message.voiceSecond }}''
      <i class="web_wechat_noread" v-show="message.voiceUnRead"></i>
    </span>
  </div>
</template>
<script>
/*语音消息 */
export default {
  data() {
    return {};
  },
  props: {
    message: {}
  },
  methods: {
    playVoice(message) {
      var self = this;
      var voice = new Audio(message.voiceUrl);
      voice.loop = false;
      voice.addEventListener(
        "ended",
        function() {
          self.message.voicePlaying = false;
        },
        false
      );
      console.log("message: ", message);
      message.voicePlaying = true;
      voice.play();
    }
  },
  created() {},
  mounted() {
    //console.log('语音： ',this.message);
  }
};
</script>

<style lang="scss" rel="stylesheet/less" scoped>
.voice {
  position: relative;
  .icon {
    position: absolute;
    left: -20px;
  }
  .voice_ok {
  }
  .voice_waiting {
    color: #999;
  }
  .voice_playing {
  }
  .voice__play_over {
  }
}
</style>
