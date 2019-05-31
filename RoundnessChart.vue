<template>
  <div>
    <div class="RoundnessChart">
      <div class="left">
        <div :style="{transform:`rotateZ(${rotate[1]}deg)`}" class="left-red"></div>
        <div :style="{transform:`rotateZ(${rotate[3]}deg)`}" class="left-green"></div>
      </div>
      <div class="right">
        <div :style="{transform:`rotateZ(${rotate[0]}deg)`}" class="right-red"></div>
        <div :style="{transform:`rotateZ(${rotate[2]}deg)`}" class="right-green"></div>
      </div>
      <div class="progress">{{ red }}%</div>
    </div>
    <div class="minimum-guarantee">
      <span>保底</span><span style="color: #51af31">{{ green }}%</span>
    </div>
  </div>
</template>

<script>
  function validator (value) {
    return value >= 0 && value <= 100;
  }

  export default {
    name: 'RoundnessChart',
    props: {
      red: {
        type: Number,
        validator,
        default: 100
      },
      green: {
        type: Number,
        validator,
        default: 0
      }
    },
    data () {
      return {}
    },
    computed: {
      rotate () {
        const rotateZ = [-180, -180, -180, -180];
        const redAngle = dispose(this.red, this.green);
        rotateZ[1] = (redAngle[1] * 3.6) - 180;// left-red
        rotateZ[3] = (redAngle[3] * 3.6) - 180;// left-green
        // --
        rotateZ[0] = (redAngle[0] * 3.6) - 180;// right-red
        rotateZ[2] = (redAngle[2] * 3.6) - 180;// right-green
        return rotateZ
      }
    },
    methods: {}
  }

  function dispose (val3, val4) {
    const arr = [];
    if ((val3 + val4) / 100 > 1) {
      let temp = val3;
      val3 /= ((temp + val4) / 100);
      val4 /= ((temp + val4) / 100);
    }
    if (val3 > 50) {
      arr[0] = 50;// right-red
      arr[2] = 50; // right-green
      arr[1] = val3 - 50;// left-red
      arr[3] = (val3 - 50) + val4 <= 50 ? (val3 - 50) + val4 : 50;// left-green
    } else {
      arr[0] = val3;// right-red
      arr[2] = val3 + val4 <= 50 ? val3 + val4 : 50;// right-green
      arr[1] = 0;// left-red
      arr[3] = arr[2] === 50 ? (val3 + val4) - 50 : 0;// left-green
    }
    return arr
  }

</script>

<style scoped>
  .minimum-guarantee {
    max-width: 56px;
    text-align: center;
    font-size: 13px;
  }

  .RoundnessChart {
    width: 56px;
    height: 56px;
    position: relative;
  }

  .RoundnessChart .progress {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    left: 8px;
    top: 8px;
    line-height: 40px;
    text-align: center;
    z-index: 5;
  }

  .RoundnessChart .left, .RoundnessChart .right {
    width: 28px;
    height: 56px;
    overflow: hidden;
    position: relative;
    float: left;
    background-color: #eeeeee;
    z-index: 1;
  }

  .RoundnessChart .left {
    border-radius: 56px 0 0 56px;
  }

  .RoundnessChart .right {
    border-radius: 0 56px 56px 0;
  }

  .RoundnessChart .left > div, .RoundnessChart .right > div {
    position: absolute;
    width: 28px;
    height: 56px;
  }

  .RoundnessChart .left-red, .RoundnessChart .left-green {
    border-radius: 56px 0 0 56px;
    transform-origin: right center;
  }

  .RoundnessChart .right-red, .RoundnessChart .right-green {
    border-radius: 0 56px 56px 0;
    transform-origin: left center;
  }

  .RoundnessChart .left-green, .RoundnessChart .right-green {
    background-color: #c6ecb7;
    z-index: 2;
  }

  .RoundnessChart .left-red, .RoundnessChart .right-red {
    background-color: #e73f40;
    z-index: 3;
  }
</style>
