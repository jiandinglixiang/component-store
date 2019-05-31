<template>
  <div id="nav-head">
    <div :class="FixedOrTransparency">
      <img class="back-icon" v-if="hideBack" @click="goBack" src="../assets/public/ic_back@2x.png">
      <div v-if="title" class="center">
        <span>{{title}}</span>
        <slot name="center"></slot>
      </div>
      <span class="right-content">
      <slot name="right"></slot>
    </span>
    </div>
  </div>
</template>

<script>//
export default {
  name: 'NavHead',
  props: {
    title: { type: String },
    hideBack: { type: Boolean, default: true },
    to: { type: String },
    FixedOrTransparency: { type: String, default: 'NoTransparency' }, // 背景透明与固定NoTransparency isFixed
    fn: { type: Function }
  },
  methods: {
    goBack () {
      if (this.fn && typeof this.fn === 'function') {
        this.fn()
      } else {
        if (this.to) {
          this.$router.replace(this.to)
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  #nav-head {
    height: 46px;
    .isFixed {
      z-index: 1;
      position: fixed;
      top: 0;
    }
    .transparency {
      background-color: transparent;
    }

    .NoTransparency {
      background-color: $nav-head-bg-color;
    }
    div {
      max-width: 640px;
      width: 100%;
      position: relative;
      text-align: center;
      color: white;
      .back-icon {
        position: absolute;
        left: 0;
        top: 0;
        height: 46px;
        width: 42px;
        padding: 12px 10px;
        z-index: 1;
      }
      .center {
        font-size: 19px;
        font-weight: bold;
        line-height: 46px;
        span {
          vertical-align: middle;
        }
      }
      .right-content {
        height: 100%;
        position: absolute;
        max-height: 46px;
        right: 0;
        top: 0;
        z-index: 1;
      }
    }
  }

</style>
