<template>
  <div class="userInfo">
    <nav-head title="个人信息"/>
    <div class="item-wrap">
      <label for="file" @click="fileInit" class="item">
        <span class="icon-head icon"></span>
        <span>头像</span>
        <div class="portrait" v-if="UserInfo.avatar" v-bind:style="{ backgroundImage: 'url(' + UserInfo.avatar + ')'}"></div>
        <div class="portrait" v-else></div>
        <span class="arrow-right"></span>
      </label>
      <router-link :to="{ path: '/nickName', query: { name: UserInfo.user_nickname }}" tag="div" class="item">
        <span class="icon-name icon"></span>
        <span>昵称</span>
        <span class="text" v-if="UserInfo.user_nickname">{{UserInfo.user_nickname}}</span>
        <span class="text" v-else>{{UserInfo.mobile | phoneNumFormat}}</span>
        <span class="arrow-right"></span>
      </router-link>
    </div>
    <!--<camera-dialog v-show="cameraDisplay" @close="onCloseCamera"></camera-dialog>-->
    <input
      ref="file"
      style="visibility: hidden"
      id="file"
      type="file"
      name="file"
      accept="image/*"
      capture="camera"
      @change="FileChange"
    />
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      style="width: 100%;max-width: 640px;max-height: 100%"
    >
      <div style="display: block;height: 100vw">
        <img id="image" src="../../../assets/public/ic_placepic@2x.png">
      </div>
      <p style="color: red;text-align: left;text-indent: 10px">注:图片上传大小必须小于1MB</p>
      <div class="button-rotatable">
        <button @click="cropper&&cropper.rotate(-45)">旋转-45°</button>
        <button @click="cropper&&cropper.rotate(45)">旋转+45°</button>
        <button @click="Cropped">剪裁上传</button>
      </div>
    </mt-popup>
  </div>
</template>
<script>//
import NavHead from '@/components/NavHead.vue'
// import 'jquery'
import { Button, Popup, Toast } from 'mint-ui'
import { mapMutations, mapState } from 'vuex'
import { SET_AVATAR_IMG } from '../../../vuex/Mine'
import http from '../../../tool/http'
import loading from '../../../tool/loading'

if (!document.querySelector('script#canvasToBlob') && !HTMLCanvasElement.prototype.toBlob) {
  const hm = document.createElement('script')
  // 如果toBlob不兼容
  hm.id = 'canvasToBlob'
  hm.src = `https://cdnjs.cloudflare.com/ajax/libs/javascript-canvas-to-blob/3.14.0/js/canvas-to-blob.min.js`
  document.body.appendChild(hm)
}
export default {
  name: 'userInfo',
  data () {
    return {
      popupVisible: false,
      cropper: null
    }
  },
  methods: {
    ...mapMutations({
      setAvatarImg: SET_AVATAR_IMG
    }),
    fileInit () {
      this.$refs.file.removeAttribute('capture')
    },
    FileChange (event) {
      if (/.*(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(event.target.value)) {
        const windowURL = window.URL || window.webkitURL
        const dataUrl = windowURL.createObjectURL(event.target.files[0])
        if (dataUrl === document.getElementById('image').getAttribute('src')) {
          return
        }
        if (this.cropper === null) {
          const image$ = document.getElementById('image')
          image$.setAttribute('src', dataUrl)
          loading.show()
          Promise.all([
            import('jquery'),
            import('cropperjs/dist/cropper.min.css'),
            import('cropperjs')
          ]).then(value => {
            loading.hide()
            this.init(image$, value[2].default)
            this.popupVisible = true
          })
        } else {
          this.cropper.replace(dataUrl)
          this.popupVisible = true
        }
      } else Toast('错误文件格式,请重新选择')
    },
    init ($image, Cropper) {
      this.cropper = new Cropper($image, {
        minContainerWidth: window.innerWidth || 250,
        minContainerHeight: window.innerWidth || 250,
        // minCanvasWidth: window.innerWidth || 250,
        minCanvasHeight: window.innerWidth || 250,
        initialAspectRatio: 1,
        dragMode: 'move',
        aspectRatio: 1
      })
    },
    Cropped () {
      if (this.cropper) {
        this.cropper.getCroppedCanvas({
          maxWidth: window.innerWidth || 250,
          maxHeight: window.innerWidth || 250,
          fillColor: '#fff',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'medium'
        }).toBlob((blob) => {
          this.popupVisible = false
          if (blob.size > 1048576) {
            Toast('图片超出上传大小,请重选')
          } else {
            const formData = new FormData()
            formData.append('file', blob, `${this.UserInfo.mobile}_${new Date().getTime()}_${parseInt(Math.random() * 10000)}.jpg`)
            http.postUserUpload(formData).then(val1 => {
              val1.url && http.postEditNickname({ avatar: val1.url }).then(val2 => {
                if (val1.url !== val2.avatar) {
                  this.setAvatarImg(val1.url)
                } else Toast('修改失败')
              })
            })
          }
        }, 'image/jpeg')
      }
    }
  },
  beforeDestroy () {
    this.cropper && this.cropper.destroy()
  },
  components: {
    NavHead,
    [Button.name]:
    Button,
    [Popup.name]:
    Popup
  },
  computed: {
    ...mapState({
      UserInfo: state => state.mine.User
    })
  }
}
</script>
<style scoped lang="scss">
  .userInfo {
    text-align: center;
    .button-rotatable {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      > button {
        color: white;
        background-color: #5A2EFF;
        flex: 1;
        border: 0;
        padding: 10px 0;
        font-size: 15px;
        margin-right: 5px;
        margin-left: 5px;
      }
      > button:first-child {
        margin-left: 10px;
      }
      > button:last-child {
        flex: 2;
        margin-right: 0;
      }
    }
  }

  .item-wrap {
    @if ($TfDj) {
      background-color: #FFFFFF;
    } @else {
      background-color: $background-light-color;
    }
    padding: 0 15px;
    margin-top: 15px;
    .item {
      display: block;
      height: 54px;
      line-height: 54px;
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      @if ($TfDj) {
        border-bottom: 1px solid #ddd;
      } @else {
        border-bottom: 1px solid $border-color;
      }
      > span.icon {
        position: absolute;
        margin-top: 15px;
        left: 0;
      }
      > span:nth-child(2) {
        @if ($TfDj) {
          color: #131313;
        } @else {
          color: $font-color;
        }
        margin-left: 30px;
      }
      > span.text {
        float: right;
        margin-right: 30px;
        @if $IF365 {
          color: #ccc;
        } @else if $TfDj {
          color: #ccc;
        }
        @else { color: #999; }
        font-weight: normal;
      }
      > span.arrow-right {
        position: absolute;
        right: 0;
        top: 15px;
      }
      > div.portrait {
        width: 33px;
        height: 33px;
        border-radius: 50px;
        float: right;
        margin-right: 30px;
        margin-top: 10px;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        @if $IF365 { background-color: #FFF9E0; background-image: url("../../../assets/public/ic_avatar_365@2x.png"); } @else if ($TfDj) {
          background-color: #FFF9E0;
          background-image: url("../../../assets/public/ic_avatar_365@2x.png");
        }
        @else { background-color: #4E25E6; background-image: url("../../../assets/public/ic_avatar@2x.png"); }
      }
    }
    .item:last-child {
      border-bottom: none;
    }
  }
</style>
