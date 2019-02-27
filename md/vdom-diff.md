# virtual dom 
    虚拟DOM，用JS模拟DOM结构，DOM变化的对比放在JS层面来做，提高重绘性能
    DOM操作是昂贵的，JS运行效率高，尽量减少DOM操作而不是推倒重来，项目越复杂影响就越大
    核心API：snabbdom库
            createElement/h函数（'标签'，{属性/事件}，[子元素] 或者 '子元素'）返回的vnode节点
                    render函数可以把vnode转换成真是dom
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
# diff算法
  ## 概念 linux的基本命令，对比vnode节点，为了找出需要更新的节点
                
  ## 为何使用  
    1.DOM操作是昂贵的，尽量减少DOM操作
    2.找出本次DOM必须更新到节点，其他不更新
    3.这个找出的过程就是diff算法

  ## 优化策略
    1.同级对比，不会跨级对比，如果没有则整个删除
    2.同级下的两个节点对比，可以互换位置
  
  ## 实现流程 
    1.patch(container,vnode)  createElement
    2.patch(vnode,newVnode)   updateChildren
    3.节点新增和删除
    4.节点重新排序
    5.节点属性，样式，事件绑定
    6.如何极致压榨性能

  ## 原理实现
    创建 dom 树

    树的diff，同层对比，输出patchs(listDiff/diffChildren/diffProps)

        没有新的节点，返回
        新的节点tagName与key不变， 对比props，继续递归遍历子树
            对比属性(对比新旧属性列表):
                旧属性是否存在与新属性列表中
                都存在的是否有变化
                是否出现旧列表中没有的新属性
        tagName和key值变化了，则直接替换成新节点

    渲染差异
        遍历patchs， 把需要更改的节点取出来
        局部更新dom

    ```
    // diff算法的实现
    function diff(oldTree, newTree) {
        // 差异收集
        let pathchs = {}
        dfs(oldTree, newTree, 0, pathchs)
        return pathchs
    }
    function dfs(oldNode, newNode, index, pathchs) {
        let curPathchs = []
        if (newNode) {
            // 当新旧节点的 tagName 和 key 值完全一致时
            if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
                // 继续比对属性差异
                let props = diffProps(oldNode.props, newNode.props)
                curPathchs.push({ type: 'changeProps', props })
                // 递归进入下一层级的比较
                diffChildrens(oldNode.children, newNode.children, index, pathchs)
            } else {
                // 当 tagName 或者 key 修改了后，表示已经是全新节点，无需再比
                curPathchs.push({ type: 'replaceNode', node: newNode })
            }
        }
        // 构建出整颗差异树
        if (curPathchs.length) {
                if(pathchs[index]){
                    pathchs[index] = pathchs[index].concat(curPathchs)
                } else {
                    pathchs[index] = curPathchs
                }
        }
    }
    // 属性对比实现
    function diffProps(oldProps, newProps) {
        let propsPathchs = []
        // 遍历新旧属性列表
        // 查找删除项
        // 查找修改项
        // 查找新增项
        forin(olaProps, (k, v) => {
            if (!newProps.hasOwnProperty(k)) {
                propsPathchs.push({ type: 'remove', prop: k })
            } else {
                if (v !== newProps[k]) {
                    propsPathchs.push({ type: 'change', prop: k , value: newProps[k] })
                }
            }
        })
        forin(newProps, (k, v) => {
            if (!oldProps.hasOwnProperty(k)) {
                propsPathchs.push({ type: 'add', prop: k, value: v })
            }
        })
        return propsPathchs
    }
    // 对比子级差异
    function diffChildrens(oldChild, newChild, index, pathchs) {
            // 标记子级的删除/新增/移动
        let { change, list } = diffList(oldChild, newChild, index, pathchs)
        if (change.length) {
            if (pathchs[index]) {
                pathchs[index] = pathchs[index].concat(change)
            } else {
                pathchs[index] = change
            }
        }

        // 根据 key 获取原本匹配的节点，进一步递归从头开始对比
        oldChild.map((item, i) => {
            let keyIndex = list.indexOf(item.key)
            if (keyIndex) {
                let node = newChild[keyIndex]
                // 进一步递归对比
                dfs(item, node, index, pathchs)
            }
        })
    }
    // 列表对比，主要也是根据 key 值查找匹配项
    // 对比出新旧列表的新增/删除/移动
    function diffList(oldList, newList, index, pathchs) {
        let change = []
        let list = []
        const newKeys = getKey(newList)
        oldList.map(v => {
            if (newKeys.indexOf(v.key) > -1) {
                list.push(v.key)
            } else {
                list.push(null)
            }
        })
        // 标记删除
        for (let i = list.length - 1; i>= 0; i--) {
            if (!list[i]) {
                list.splice(i, 1)
                change.push({ type: 'remove', index: i })
            }
        }
        // 标记新增和移动
        newList.map((item, i) => {
            const key = item.key
            const index = list.indexOf(key)
            if (index === -1 || key == null) {
                // 新增
                change.push({ type: 'add', node: item, index: i })
                list.splice(i, 0, key)
            } else {
                // 移动
                if (index !== i) {
                    change.push({
                        type: 'move',
                        form: index,
                        to: i,
                    })
                    move(list, index, i)
                }
            }
        })

        return { change, list }
    }
    ```
