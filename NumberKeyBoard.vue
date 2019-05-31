<template>
  <table class="betting-keyboard">
    <tr>
      <td @click="keyboard(1)">1</td>
      <td @click="keyboard(2)">2</td>
      <td @click="keyboard(3)">3</td>
    </tr>
    <tr>
      <td @click="keyboard(4)">4</td>
      <td @click="keyboard(5)">5</td>
      <td @click="keyboard(6)">6</td>
    </tr>
    <tr>
      <td @click="keyboard(7)">7</td>
      <td @click="keyboard(8)">8</td>
      <td @click="keyboard(9)">9</td>
    </tr>
    <tr>
      <td></td>
      <td @click="keyboard(0)">0</td>
      <td @click="keyboard(-1)">✖</td>
    </tr>
  </table>
</template>

<script>//
export default {
  name: 'NumberKeyBoard',
  props: {
    amount: { type: Number }
  },
  methods: {
    keyboard (key) {
      if (key < 0) {
        this.$emit('update:amount', 0)
      } else {
        this.$emit('update:amount', this.amount * 10 + key)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .betting-keyboard {
    width: 100%;
    height: 188px;
    table-layout: fixed;
    overflow: hidden;

    > tr {
      border-top: 5px solid #131313;

      > td {
        user-select: none;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        border-left: 5px solid #131313;
        background-color: #444;
      }

      > td:active {
        background-color: #131313;
      }

      > td:last-child {
        border-right: 5px solid #131313;
        /*border-right: none;*/
      }
    }
  }
</style>
