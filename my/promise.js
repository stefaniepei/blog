// 1. 术语
// promise是一个包含了兼容promise规范then方法的对象或函数，
// thenable 是一个包含了then方法的对象或函数。
// value 是任何Javascript值。 (包括 undefined, thenable, promise等).
// exception 是由throw表达式抛出来的值。
// reason 是一个用于描述Promise被拒绝原因的值。

// 要求
// 2 Promise状态
// 一个Promise必须处在其中之一的状态：pending, fulfilled 或 rejected.
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
// 如果是pending状态,则promise：

// 可以转换到fulfilled或rejected状态。
// 如果是fulfilled状态,则promise：

// 不能转换成任何其它状态。
// 必须有一个值，且这个值不能被改变。
// 如果是rejected状态,则promise可以：

// 不能转换成任何其它状态。
// 必须有一个原因，且这个值不能被改变。
// ”值不能被改变”指的是其identity不能被改变，而不是指其成员内容不能被改变。
// x 是then中的回调函数的返回值。可能的值为Promise，value和undefined。
function resolvePromise(promise2, x, resolve, reject) {
  let then,thenCalledOrThrow = false
  //如果promise2 和 x 指向相同的值, 使用TypeError做为原因将promise拒绝。
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }

  //判断x是否是一个Promise，如果是，那么就直接把MyPromise中的resolve和reject传给then;
  //返回值是一个Promise对象，直接取它的结果做为promise2的结果
  if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
    try {
      then = x.then
      if (typeof then === 'function') {
        then.call(x, function rs(y) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return resolvePromise(promise2, y, resolve, reject)
        }, function rj(r) {
          if (thenCalledOrThrow) return
          thenCalledOrThrow = true
          return reject(r)
        })
      } else {
        return resolve(x)
      }
    } catch(e) {
      if (thenCalledOrThrow) return
      thenCalledOrThrow = true
      return reject(e)
    }
  } else {
    return resolve(x)
  }

}

function MyPromise(callback) {
  let that = this;
  //定义初始状态
  //Promise状态
  that.status = PENDING;
  //value reject&&resolve
  that.value = null;
  //用来解决异步问题的数组
  that.onFullfilledCallbacks = [];
  that.onRejectedCallbacks = [];

  //定义resolve
  function resolve(value) {
  	if(value instanceof MyPromise) {
  		console.log('resolve value instanceof MyPromise')
	  return value.then(resolve, reject)
	}
	 
    //当status为pending时，定义返回值，定义其状态为fulfilled
    setTimeout(() => {
	  if(that.status === PENDING) {
	    that.value = value;
	    that.status = FULFILLED;
	    that.onFullfilledCallbacks.map(cb => cb(that.value));
	  }
	})
  }

  //定义reject
  function reject(value) {
    //当status为pending时，定义返回值，定义其状态为rejected
    setTimeout(() => {
      if(that.status === PENDING) {
        that.value = value;
        that.status = REJECTED
        that.onRejectedCallbacks.map(cb => cb(that.value));    
  	  }
  	})
  }

  //捕获callback是否报错
  try {
    callback(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// 定义then
// 一个promise必须有一个then方法，then方法接受两个参数：
// promise.then(onFulfilled,onRejected)
//观察者模式解决异步调用问题

// 如果onFulfilled是一个函数:
// 它必须在promise fulfilled后调用， 且promise的value为其第一个参数。
// 它不能在promise fulfilled前调用。
// 不能被多次调用。

// 如果onRejected是一个函数,
// 它必须在promise rejected后调用， 且promise的reason为其第一个参数。
// 它不能在promise rejected前调用。
// 不能被多次调用。
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  let that = this;
  let promise2;

  // 根据标准，如果then的参数不是function，则我们需要忽略它
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : fn => fn;
  onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
  //需要修改下，解决异步问题，即当Promise调用resolve之后再调用then执行onFulfilled(that.value)。
  //用两个数组保存下onFulfilledCallbacks

  if(that.status === FULFILLED) {
    return promise2 = new MyPromise((resolve, reject) => {
      setTimeout(()=>{
	      try {
	        let x = onFulfilled(that.value);
	        //处理then的多种情况
	        resolvePromise(promise2, x, resolve, reject)
	      } catch (error) {
	        reject(error);
	      }
      })
    })
  }

  if(that.status === REJECTED) {
    return new MyPromise((resolve, reject) => {
      setTimeout(()=>{
	      try {
	        let x = onRejected(that.value);
	        //处理then的多种情况
	        resolvePromise(promise2, x, resolve, reject);
	      } catch (error) {
	        reject(error)
	      }
	  })
    })
  }

  if(that.status === PENDING) {

    return promise2 = new Promise((resolve, reject) => {
      that.onFullfilledCallbacks.push(value => {
        try {
          let x = onFulfilled(value);
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          return reject(e)
        }
      });

      that.onRejectedCallbacks.push(value => {
        try {
          let x = onRejected(value);
          resolvePromise(promise2, x, resolve, reject)
        } catch(e) {
          return reject(e)
        }
      });
    })
  }
}

// catch
MyPromise.prototype.catch = onRejected => this.then(null, onRejected)

//module.exports = MyPromise;

// 如果没有异步，此时status状态肯定为三种状态之一，一般为resolved，反之，为pending。

// 测试

new MyPromise(resolve=>resolve(8))
  .then(val=>{console.log('1')})
  .then()
  .then(function foo(value) {
    console.log(value)
  })