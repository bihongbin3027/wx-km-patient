<template>
  <div class="picture">
    <div id="viewImageId" class="p" v-html="message.html" @click="showViewer(0)"></div>
    <p class="loading" v-show="message._msg.status == -1">
      <img width="32" height="32" src="../images/loading.gif" alt="" />
    </p>
    <md-image-viewer
      v-model="isViewerShow"
      :list="imgs"
      :has-dots="true"
      :initial-index="viewerIndex">
    </md-image-viewer>
  </div>
</template>
<script>
import { ImageViewer } from "mand-mobile";

/*图片消息 */
export default {
  components: {
    [ImageViewer.name]: ImageViewer
  },
  data() {
    return {
      isViewerShow: false,
      viewerIndex: 0,
      imgs: []
    };
  },
  props: {
    message: {
      type: Object
    }
  },
  mounted() {
    let childrenDom = document.getElementById('viewImageId').children[0]
    if (childrenDom) {
      this.imgs = [childrenDom.src]
    }
  },
  methods: {
    showViewer(index) {
      this.viewerIndex = index
      this.isViewerShow = true
    }
  }
};
</script>

<style lang="scss" scoped>
.picture {
  border-radius: 10px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  position: relative;
  max-width: 60%;

  .p {
    height: 100%;
    width: 100%;
  }

  img {
    display: block;
    cursor: pointer;
  }

  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #000;
    filter: alpha(opacity=50);
    opacity: 0.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.talk .content .wrap .self:after {
  display: none;
}
</style>
