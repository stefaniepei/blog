# diff算法
  ## 概念 linux的基本命令，对比vnode节点，为了找出需要更新的节点
                
  ## 为何使用  
    1.DOM操作是昂贵的，尽量减少DOM操作
    2.找出本次DOM必须更新到节点，其他不更新
    3.这个找出的过程就是diff算法
  
  ## 实现流程 
    1.patch(container,vnode)  createElement
    2.patch(vnode,newVnode)   updateChildren
    3.节点新增和删除
    4.节点重新排序
    5.节点属性，样式，事件绑定
    6.如何极致压榨性能

  ## virtual dom 
    虚拟DOM，用JS模拟DOM结构，DOM变化的对比放在JS层面来做，提高重绘性能
    DOM操作是昂贵的，JS运行效率高，尽量减少DOM操作而不是推倒重来，项目越复杂影响就越大
    核心API：snabbdom库
            h函数（'标签'，{属性/事件}，[子元素] 或者 '子元素'）返回的vnode节点
            patch函数（真实节点，vnode节点）第一次渲染的时候渲染所有数据源
            patch函数（vnode旧节点，更新后的vnode节点）对比需要更新的节点

    ```
    // create element
    function createElement(vnode) {
        var tag = vnode.tag  // 'ul'
        var attrs = vnode.attrs || {}
        var children = vnode.children || []
        if (!tag) {
            return null
        }
        // 创建真实的 DOM 元素
        var elem = document.createElement(tag)
        // 属性
        var attrName
        for (attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                // 给 elem 添加属性
                elem.setAttribute(attrName, attrs[attrName])
            }
        }

        // 子元素
        children.forEach(function (childVnode) {
            // 给 elem 添加子元素
            elem.appendChild(createElement(childVnode))  // 递归
        })
        // 返回真实的 DOM 元素
        return elem
    }
    // update children
    function updateChildren(vnode, newVnode) {
        var children = vnode.children || []
        var newChildren = newVnode.children || []
        children.forEach(function (childVnode, index) {
            var newChildVnode = newChildren[index]
            if (childVnode.tag === newChildVnode.tag) {
                // 深层次对比，递归
                updateChildren(childVnode, newChildVnode)
            } else {
                // 替换
                replaceNode(childVnode, newChildVnode)
            }
        })
    }
    function replaceNode(vnode, newVnode) {
        var elem = vnode.elem  // 真实的 DOM 节点
        var newElem = createElement(newVnode)
        // 替换
    }
    ```