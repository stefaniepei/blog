// 节流函数 每隔一段时间发起一次
const throttle = function(fn,wait=50){
	let lastTime = 0
	return function(...args){
		let now = +new Date()
		if(now - lastTime > wait){
			lastTime = now
			fn.apply(this,args)
		}
	}
}
// 转自https://github.com/mqyqingfeng/Blog/issues/26
function throttle(func, wait, options) {
	var timeout, context, args, result;
	var previous = 0;
	if (!options) options = {};

	var later = function() {
			previous = options.leading === false ? 0 : new Date().getTime();
			timeout = null;
			func.apply(context, args);
			if (!timeout) context = args = null;
	};

	var throttled = function() {
			var now = new Date().getTime();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
					if (timeout) {
							clearTimeout(timeout);
							timeout = null;
					}
					previous = now;
					func.apply(context, args);
					if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
					timeout = setTimeout(later, remaining);
			}
	};
	return throttled;
}

// 防抖函数 隔一段时间后没继续触发事件则发起一次
const debounce = function(fn,wait=50){
  let timer = 0
  return function(...args){
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this,args)
    },wait)
  }
}
// 转自https://github.com/mqyqingfeng/Blog/issues/22
function debounceByUnderscore(func, wait, immediate) {
	var timeout, result;
	var debounced = function () {
			var context = this;
			var args = arguments;

			if (timeout) clearTimeout(timeout);
			if (immediate) {
					// 如果已经执行过，不再执行
					var callNow = !timeout;
					timeout = setTimeout(function(){
							timeout = null;
					}, wait)
					if (callNow) result = func.apply(context, args)
			}
			else {
					timeout = setTimeout(function(){
							func.apply(context, args)
					}, wait);
			}
			return result;
	};
	debounced.cancel = function() {
			clearTimeout(timeout);
			timeout = null;
	};
	return debounced;
}