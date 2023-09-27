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
      
      el.touchstartFunction = (e) => {
        startTime = new Date().getTime();
        startDistanceX = e.touches[0].clientX;
        startDistanceY = e.touches[0].clientY;
      };
      
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
  