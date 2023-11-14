/**
 * 配置滑动触发函数的指令
 * 
 * Usage:
 * <div v-slide:direction="callbackFunction"></div>
 * 
 * @param {string} direction - 滑动方向 ('top', 'bottom', 'left', 'right')
 * @param {function} callbackFunction - 滑动触发时的回调函数
 */

export default {
  mounted(el, binding) {
    const { arg: direction, value: callbackFunction } = binding;

    let startTime;
    let endTime;
    let moveTime;
    let startDistanceX;
    let endDistanceX;
    let moveDistanceX;
    let startDistanceY;
    let endDistanceY;
    let moveDistanceY;
    let status;

    // 触摸开始事件处理函数
    el.touchstartFunction = (e) => {
      startTime = new Date().getTime();
      startDistanceX = e.touches[0].clientX;
      startDistanceY = e.touches[0].clientY;
    };

    // 触摸结束事件处理函数
    el.touchendFunction = (e) => {
      endTime = new Date().getTime();
      endDistanceX = e.changedTouches[0].clientX;
      endDistanceY = e.changedTouches[0].clientY;
      moveTime = endTime - startTime;
      moveDistanceX = endDistanceX - startDistanceX;
      moveDistanceY = endDistanceY - startDistanceY;

      if ((Math.abs(moveDistanceX) > 40 || Math.abs(moveDistanceY) > 40) && moveTime < 500) {
        if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY)) {
          status = moveDistanceX > 0 ? 'right' : 'left';
        } else {
          status = moveDistanceY > 0 ? 'bottom' : 'top';
        }
        if (status === direction && callbackFunction) {
          callbackFunction(e);
        }
      }
    };

    el.addEventListener('touchstart', el.touchstartFunction);
    el.addEventListener('touchend', el.touchendFunction);

    // 添加过渡类名
    el.classList.add('slide-enter-active');
  },
  beforeUnmount(el) {
    el.removeEventListener('touchstart', el.touchstartFunction);
    el.removeEventListener('touchend', el.touchendFunction);

    // 移除过渡类名
    el.classList.remove('slide-enter-active');
  }
};