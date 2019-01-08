Function.prototype.myCall = function(context){
	if(typeof this !== 'function'){
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	const args = [...arguments].slice(1)
	const result = context.fn(...args)
	// Reflect.deleteProperty(context,'fn')
	delete context.fn
	return result
}

Function.prototype.myApply = function(context) {
	if(typeof this !== 'function'){
		throw new TypeError('Error')
	}
	context = context || window
	context.fn = this
	let result
	if(arguments[1]){
		result = context.fn(...arguments[1])
	}else{
		result = context.fn()
	}
	// Reflect.deleteProperty(context,'fn')
	delete context.fn
	return result
}

Function.prototype.myBind = function(context){
	if(typeof this !== 'function'){
		throw new Error('Error')
	}
	context = context || window
	const that = this
	const args = [...arguments].slice(1)
	return function F(){
		if(this instanceof F){
			return new that(...args,...arguments)
		}
		return that.apply(context,args.concat(...arguments))
	}
}

function myInstanceof(left,right){
	let prototype = right.prototype
	left = left.__proto__
	while(true){
		if(left == null || left == undefined){
			return false
		}
		if(prototype === left){
			return true
		}
		left = left.__proto__
	}
}