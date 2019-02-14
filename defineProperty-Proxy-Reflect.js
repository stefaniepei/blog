function obseve(obj){
  if(!obj || typeof obj !== 'object'){
    return
  }
  Object.keys(obj).forEach(key=>{
    defineReactive(obj,key,obj[key])
  })
}

function defineReactive(obj,key,val){
  obseve(val) // 递归子属性
  // 通过下标方式修改数组数据或者给对象新增属性并不会触发组件的重新渲染
  Object.defineProperty(obj,key,{
    enumerable:true,// 可枚举
    configurable:true,// 可配置
    get:function reactiveGetter(){
      return val
    },
    set:function reactiveSetter(newVal){
      val = newVal
    }
  })
}

let handler = {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver)
  },
  defineProperty(target, key, attribute) {
    Reflect.defineProperty(target, key, attribute);
  }
};
let p = {
  a: 'a'
};
let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty


