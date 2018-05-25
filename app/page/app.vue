<template lang="pug">
#v-app
  .pointer
  .turntable(src='../res/0-9.gif')
  .ui.teal.button.start(v-stream:click='start') Start
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      tickTime: 2000,
      currentDeg: 0,
      finalSectorIndex: 3
    };
  },
  computed: {
    finalDeg() {
      return this.finalSectorIndex * 40 + 20;
    }
  },
  domStreams: ['start'],
  subscriptions() {
    const start$ = this.start.take(1);
    const normal$ = Rx.Observable.interval(this.tickTime)
      .do(() => {
        console.log('nanoha', new Date().getSeconds());
        this.currentDeg += 360;
        $('.turntable').css('transform', `rotate(${this.currentDeg}deg)`);
      })
      .take(Math.floor(7000 / this.tickTime));
    const slowDownTime = (this.finalDeg / 360 + 1) * this.tickTime * 2 / 1000;
    const slow$ = Rx.Observable.timer(this.tickTime).do(() => {
      console.log('fate', new Date().getSeconds());
      this.currentDeg += 360 + this.finalDeg;
      $('.turntable').css({
        transform: `rotate(${this.currentDeg}deg)`,
        transition: `transform ${slowDownTime}s ease-out`
      });
    });
    const tick$ = start$.concatMap(() => normal$.concat(slow$));
    return { tick$ };
  }
};
</script>

<style lang="sass" scoped>
@import '~src/mixin.sass'

#v-app
  +flexbox(center, center, column)
  height: 100%
  .pointer
    +size(20px)
    border-top: 20px solid red
    border-left: 10px solid transparent
    border-right: 10px solid transparent
  .turntable
    +size(200px)
    position: relative
    background-image: url('../res/0-9.gif')
    transition: transform 2s linear
    z-index: -1
  .button
    margin-top: 10px
</style>
