# mvvm实现

  ## 1.解析模板成render函数
    with的用法，模板中的所有信息都被render函数包含，data中的属性都变成JS变量，指令都变成JS逻辑，render函数返回vnode

  ## 2.响应式开始监听
    Object.defineProperty监听属性变化，将data的属性代理到vm对象上（with）

  ## 3.首次渲染，显示页面，且绑定依赖
    1.首次渲染patch(container,vnode)
    2.初次渲染，执行updateComponent，执行vm._render()
    3.执行render函数，会访问到vm.list和vm.title
    4.会被响应式的get方法监听到（data属性中只有被用到的才走get,避免不必要的重复渲染）
    5.执行updateComponent，会走到vdom的patch方法
    6.patch将vnode渲染成DOM，初次渲染完成

  ## 4.data属性变化，触发rerender
    1.修改属性，被响应式的set监听到
    2.set中执行 updateComponent，执行vm._render()
    3.生成的vnode和prevnode，通过patch对比，渲染到html中

# 渲染

  ## render函数：模板中所有的信息都包含在render函数中。返回vNode
    1.this即vm,price即this.price,vm.price。即data中的price
    2.with函数 with(obj)=>直接读取obj的属性
    3.vm._c函数 _v(_s(属性))  _v创建文本节点 
    4.v-mode: 双向数据绑定，既有get->directives->value也有set on->input:e=>x=e.target.value
    5.v-click:渲染时绑定click事件
    6.v-for:_l函数遍历list元素循环创建返回数组节点
    7.vue2.0开始支持预编译
  ## vdom    
    h函数('标签',{属性},['children']||'children')
    patch函数(container, vNode) || patch(oldVnode,newVnode)
  ## updateComponent
    _update函数类似patch函数，内部判断是否第一次和获取旧的vNode，传入新vNode
