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