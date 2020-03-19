<template>
  <div id="container" style="display: none;">
    <div id="pop" class="pop">
      <canvas id="the-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Toast } from "mand-mobile";
import API from '../api/api'

let PDFJS = window.pdfjsLib

export default {
  name: "prescription",
  data() {
    return {};
  },
  created() {
    document.title = "查看处方";
    Toast.loading("加载中...");
    API.getRescriptionPdfUrl({
      id: this.$route.query.id
    }).then(res => {
      Toast.hide();
      this.previewPdf(res);
    });
  },
  methods: {
    previewPdf(url) {
      var container = document.getElementById("container");
      container.style.display = "block";
      PDFJS.getDocument(url).then(function(pdf) {
        pdf.getPage(1).then(function(page) {
          if (container.offsetHeight < 500) {
            var scale = 0.5;
          } else {
            var scale = 1;
          }
          var viewport = page.getViewport(scale);
          var canvas = document.getElementById("the-canvas");
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  #container {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: 1;
    overflow: auto;
  }
</style>
