<template>
  <div>
    <md-field class="field-style font-small">
      <md-field-item
        title="就诊人："
        :content="passiveText()"
        @click.native="selectMember()"
        arrow
        solid
        v-if="Object.keys(partObj).length"
      ></md-field-item>
      <md-field-item
        v-else
        @click.native="addMember()"
        title="就诊人："
        content="点击添加就诊人"
        arrow
        solid
        disabled
      />
      <md-field-item title="问诊类型：" solid>
        <md-radio name="2" v-model="consultType" label="复诊" inline />
        <md-radio
          name="1"
          v-model="consultType"
          label="初诊（ 初诊患者仅做咨询 ）"
          inline
        />
      </md-field-item>
    </md-field>
    <dl class="item-dl">
      <dt>病情描述</dt>
      <dd>
        <div class="textarea-view">
          <textarea
            v-model="consultdesc"
            @input="consultdescInput($event)"
            maxlength="300"
            placeholder="请描述你的问题，包括身体状况、疾病和症状等，医生会根据你的描述给出专业意见，并保证你的隐私安全！"
          ></textarea>
          <span class="textarea-desc color1">{{ consultdesc.length }}/300</span>
        </div>
        <div>
          <ul class="image-reader-list">
            <li
              class="image-reader-item"
              v-for="(img, index) in imageList['reader0']"
              :key="index"
              :style="{
                backgroundImage: `url(${img})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }"
            >
              <md-tag
                class="image-reader-item-del"
                size="small"
                shape="quarter"
                fill-color="#111A34"
                type="fill"
                font-color="#fff"
                @click.native="onDeleteImage('reader0', index)"
              >
                <md-icon name="close"></md-icon>
              </md-tag>
            </li>
            <li class="image-reader-item add" v-show="addviewimage">
              <md-image-reader
                name="reader0"
                size="10240"
                @select="onReaderSelect"
                @complete="onReaderComplete"
                @error="onReaderError"
              ></md-image-reader>
              <md-icon name="camera" size="md" color="#CCC"></md-icon>
              <p>添加图片</p>
            </li>
          </ul>
          <div class="font-12 color1">添加图片，最多9张</div>
        </div>
      </dd>
    </dl>
    <div class="foot-fiexd-btn">
      <div class="serve-price">
        服务价格：<span class="color2">&yen;{{ doctorInfo.consultingFees }}</span>
      </div>
      <md-button type="primary" @click="confirmClick()">立即购买</md-button>
    </div>
  </div>
</template>

<script>
import {
  Radio,
  Field,
  FieldItem,
  InputItem,
  Icon,
  ImageReader,
  Tag,
  Toast,
  Button
} from "mand-mobile";
import imageProcessor from "mand-mobile/lib/image-reader/image-processor";
import API from "../api/api";

export default {
  name: "perfectinfo",
  components: {
    [Field.name]: Field,
    [InputItem.name]: InputItem,
    [FieldItem.name]: FieldItem,
    [Radio.name]: Radio,
    [Icon.name]: Icon,
    [ImageReader.name]: ImageReader,
    [Tag.name]: Tag,
    [Button.name]: Button
  },
  data() {
    return {
      doctorInfo: {},
      consultType: "2",
      consultdesc: "",
      addviewimage: true,
      imageList: {
        reader0: []
      },
      partObj: {}
    };
  },
  created() {
    document.title = "图文咨询";
    this.init();
  },
  methods: {
    consultdescInput(e) {
      let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;
      this.consultdesc = e.target.value.replace(reg, '');
    },
    addMember() {
      const { id } = this.$route.query;
      this.$router.push({
        path: "/editmember",
        query: {
          id,
          path: "/consult"
        }
      });
    },
    selectMember() {
      const { id } = this.$route.query;
      this.$router.push({
        path: "/member",
        query: {
          id,
          path: "/consult"
        }
      });
    },
    sexformat({ sex }) {
      if (sex === 0) {
        return "男";
      } else if (sex === 1) {
        return "女";
      } else {
        return "";
      }
    },
    passiveText() {
      if (Object.keys(this.partObj).length) {
        return `${this.partObj.name}（ ${this.sexformat(this.partObj)}，${
          this.partObj.age
        }岁 ）`;
      } else {
        return true;
      }
    },
    init() {
      let { age, sex, patientId, idNumber, name } = this.$route.query;
      API.getMyDotorById({
        id: this.$route.query.id
      }).then(res => {
        this.doctorInfo = res
      });
      if (patientId) {
        this.partObj = {
          age,
          sex,
          id: patientId,
          idNumber,
          name
        };
      } else {
        Toast.loading("加载中...");
        API.getFamilyMemberList().then(res => {
          Toast.hide();
          if (res && res.length) {
            this.partObj = res[0];
          }
        });
      }
    },
    onReaderSelect(name, { files }) {
      files.forEach(file => {
        console.log(
          "[Mand Mobile] ImageReader Selected:",
          "File Name " + file.name
        );
      });
      Toast.loading("图片读取中...");
    },
    onReaderComplete(name, { dataUrl, file }) {
      Toast.hide();
      console.log(
        "[Mand Mobile] ImageReader Complete:",
        "File Name " + file.name
      );
      if (this.imageList.reader0.length >= 9) {
        Toast.info("最多上传9张", 1500);
        return;
      }
      imageProcessor({
        dataUrl,
        quality: 0.1
      }).then(({ dataUrl, blob }) => {
        console.log('bolb', blob)
        console.log('file', file)
        const dataURLtoFile = function(dataurl, filename) {
          var arr = dataurl.split(",");
          var mime = arr[0].match(/:(.*?);/)[1];
          var bstr = atob(arr[1]);
          var n = bstr.length;
          var u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          //转换成file对象
          return new File([u8arr], filename, { type: mime });
        };
        let formData = new FormData();
        formData.append("file", dataURLtoFile(dataUrl, file.name));
        Toast.loading("上传中...");
        API.useruploadFiles(formData).then(res => {
          Toast.hide();
          Toast.succeed("上传成功", 1500);
          const demoImageList = this.imageList[name] || [];
          demoImageList.push(res);
          this.$set(this.imageList, name, demoImageList);
          if (this.imageList.reader0.length >= 9) {
            this.addviewimage = false
          }
        });
      })
    },
    onReaderError(name, { msg }) {
      Indicator.close();
      Toast.failed(msg);
    },
    onDeleteImage(name, index) {
      const demoImageList = this.imageList[name] || [];
      demoImageList.splice(index, 1);
      this.addviewimage = true
      this.$set(this.imageList, name, demoImageList);
    },
    confirmClick() {
      let self = this;
      function onBridgeReady() {
        // eslint-disable-next-line
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: self.rows.appId, // 公众号名称，由商户传入
            timeStamp: self.rows.timeStamp, // 时间戳 这里随意使用了一个值
            nonceStr: self.rows.nonceStr, // 随机串
            package: self.rows.package, // 扩展字段，由商户传入
            signType: self.rows.signType, // 微信签名方式:sha1
            paySign: self.rows.paySign // 微信签名
          },
          function(res) {
            Toast.hide();
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              // Toast.loading("正在进入诊室，请稍候...");
              // self.timer = setInterval(() => {
              //   API.getMemberConsultByOrderId({
              //     id: self.patId
              //   }).then(res => {
              //     if (res.channelId) {
              //       clearInterval(self.timer);
              //       Toast.hide();
              //       self.$router.push({
              //         path: "/talk",
              //         query: {
              //           id: res.channelId,
              //           headPortrait: self.doctorInfo.portrait,
              //           patientPortrait: res.patientPortrait
              //         }
              //       });
              //     } else {
              //       self.timer()
              //     }
              //   });
              // }, 2000);
              Toast.info("支付成功", 1500);
              setTimeout(() => {
                self.$router.push({
                  path: "/order"
                })
              }, 1500)
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              Toast.info("已取消支付", 1500);
              setTimeout(() => {
                self.$router.push({
                  path: "/order"
                })
              }, 1500)
            } else {
              Toast.info("支付失败", 1500);
            }
          }
        );
      }
      if (!Object.keys(this.partObj).length) {
        Toast.info("请选择就诊人", 1500);
        return;
      }
      if (this.consultdesc.length < 10) {
        Toast.info("病情描述最少10个字符", 1500);
        return;
      }
      Toast.loading("支付中...");
      API.placeConsultOrder({
        doctorId: this.$route.query.id,
        patientAge: this.partObj.age,
        patientGender: this.partObj.sex,
        patientId: this.partObj.id,
        patientIdNum: this.partObj.idNumber,
        patientName: this.partObj.name,
        patientPhone: this.partObj.phone,
        type: this.consultType,
        remark: this.consultdesc,
        // 上传附件（需要做图片上传）
        attachments: this.imageList['reader0'].join(",")
      }).then(pat => {
        this.patId = pat.id;
        API.pay({
          id: pat.id
        }).then(res => {
          let self = this
          this.rows = res;
          if (this.doctorInfo.consultingFees === 0) {
            Toast.hide();
            Toast.loading("正在进入诊室，请稍候...");
            this.timer = setInterval(() => {
                API.getMemberConsultByOrderId({
                  id: self.patId
                }).then(oderdata => {
                  if (oderdata.channelId) {
                    clearInterval(self.timer);
                    Toast.hide();
                    self.$router.push({
                      path: "/talk",
                      query: {
                        id: oderdata.channelId,
                        doctorId: oderdata.doctorId,
                        headPortrait: self.doctorInfo.portrait,
                        patientPortrait: oderdata.patientPortrait
                      }
                    });
                  } else {
                    self.timer()
                  }
                });
              }, 2000);
          } else {
            if (typeof WeixinJSBridge === "undefined") {
              if (document.addEventListener) {
                document.addEventListener(
                  "WeixinJSBridgeReady",
                  onBridgeReady,
                  false
                );
              } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
                document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
              }
            } else {
              onBridgeReady();
            }
          }
        });
      });
    }
  }
};
</script>
