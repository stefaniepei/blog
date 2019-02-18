# 原型
  ## 原型
    1.所有的引用类型都有一个隐式原型（__proto__）,属性值是一个普通的对象
    2.所有的函数都有一个显式原型（prototype）属性，属性值也是一个普通的对象,隐式原型(__proto__)属性指向它的构造函数的显式原型(prototype)属性值 
    3.当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__（即它的构造函数的prototype）中寻找 

# 原型链
  ## 创建对象的方法：
    ```
    // 字面量  
    var o1={name:'o1'}  
    var o2=new Object({name:'o2'})
    // 显示的构造函数
    var M=function(name){this.name=name;}
    var o3=M('o3')
    M.prototype.constructor === M // true
    o3.__proto__ === M.prototype // true
    M.__proto__=== Function.prototype // true
    M.prototype.__proto__=== Object.prototype
    o3.__proto__.constructor===M  // true 证明o3是M的实例
    o3.__proto__.constructor=== Object // false 证明o3不是Object的实例
    // Object函数  Object.create
    var p={name:'p'} 
    var o4=Object.create(p) 
    ```

# 继承

  ## new运算符
    一个新对象被创建，继承X.prototype,构造函数X被执行。相应参数会被传入，上下文this会被指定新实例。如果构造函数返回一个对象，该对象会取代整个new的结果。如果没则为新对象

  ```
  function _new(fn, ...arg) {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, arg);
    return ret instanceof Object ? ret : obj;
  }
  ```

  ```
  //借助构造函数实现继承,无法继承到原型链上面的say方法
  function Parent1(){
    this.name='parent1'
  }
  Parent1.prototype.say=function(){...}
  function Child1(){
    Parent1.call(this);
    this.type='child1'
  }

  //借助原型链实现继承,原型链上面的原型对象是共用的
  function Parent2(){
    this.name='parent2';
  }
  function Child2(){
    this.type='child2'
  }
  Child2.prototype=new Parent2();

  //组合构造函数和原型链结合的方式,父级构造函数执行了2次
  function Parent3(){
    this.name='parent3'
  }
  function Child3(){
  Parent3.call(this)
  this.type='child3'
  }
  Child3.prototype=new Parent3();

  //组合构造函数和原型链结合的方式2,分不清是父类的实例还是子类的实例
  function Parent4(){
    this.name='parent4'
  }
  function Child4(){
  Parent4.call(this)
  this.type='child4'
  }
  Child4.prototype=Parent4.prototype;

  //组合构造函数和原型链结合的方式3,强烈推荐
  function Parent5(){
    this.name='parent5'
  }
  function Child5(){
  Parent5.call(this)
  this.type='child5'
  }
  Child5.prototype=Object.create(Parent5.prototype); // 原型对象是父类的
  Child5.prototype.constructor=Child5;// 覆盖成子类的原型对象

  class Child6 extend Parent6{}

  // 圣杯模式 转自:https://juejin.im/post/5c64d15d6fb9a049d37f9c20
  var inherit = (function(c,p){
    var F = function(){};
    return function(c,p){
      F.prototype = p.prototype;
      c.prototype = new F();
      c.uber = p.prototype;
      c.prototype.constructor = c;
    }
  })();
  ```