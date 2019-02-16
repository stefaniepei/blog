# react
  ## 组件化：封装-视图，数据，数据驱动视图变化
    复用-props传递，复用

  ## JSX：语法：html形式，引入JS变量和表达式，if...else...，循环，style和className，事件
    JSX糖，需要解析成JS  React.createElement('div' || 构造函数,{属性},[...] || child1,child2)

  ## vdom：由react推广开，结合JSX
    JSX就是模板，最终渲染成html
    初次渲染+修改state后的re-render
    正好符合vdom的应用场景

  ## 何时patch  
    初次渲染 ReactDOM.render(<App/>,container)会触发patch(container,vnode)
    re-render(setState)会触发patch(vnode,newVnode)

  ## 自定义组件解析：div等html标签可以直接渲染成<div>,vdom可以做到
    Input等自定义组件(class)，vdom默认不认识，定义的时候必须声明render函数
    根据props初始化实例,然后执行实例的render函数 
    render函数返回的还是vnode对象

  ## setState过程
    异步 可能会一次执行多次setState且无法规定,限制用户如何使用setState
    没必要每次setState都重新渲染(考虑性能),只需要看到最后结果即可
    每个组件实例，都有renderComponent方法
    执行renderComponent会重新执行实例都render
    render函数返回newVnode,然后拿到preVnode
    执行patch(preVnode,newVnode)

  ## react VS vue  
    本质区别  
      vue-本质MVVM，由MVC发展而来
      react-本质是前端组件化，由后端组件化发展而来
      vue-模板 模板分离强 支持组件化(MVVM上扩展)
      react-jsx 模板语法强 本身就是组件化
      
    共同点    
      都支持组件化，都是数据驱动视图





