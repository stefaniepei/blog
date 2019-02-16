// 基于CREATE-ELEMENT把JSX转换为一个对象，当RENDER渲染这个对象的时候，遇到TYPE是一个函数或者类，不是直接创建元素，而是先把方法执行：
//     ->如果是函数式声明的组件，就把它当做普通方法执行（方法中的THIS是UNDEFINED），把函数返回的JSX元素（也是解析后的对象）进行渲染
//     ->如果是类声明式的组件，会把当前类NEW它执行，创建类的一个实例（当前本次调取的组件就是它的实例），执行CONSTRUCTOR之后，会执行THIS.RENDER()，把RENDER中返回的JSX拿过来渲染，所以“类声明式组件，必须有一个RENDER的方法，方法中需要返回一个JSX元素”
//    但是不管是哪一种方式，最后都会把解析的出来的PROPS属性对象作为实参传递给对应的函数或者类

/*
 * CREATE-ELEMENT：创建JSX对象
 *   参数：至少两个 type/props，childrens可能没有可能有多个
 */
function createElement(type, props, ...childrens) {
    let ref, key;
    if ('ref' in props) {
        ref = props['ref'];
        props['ref'] = undefined;
    }
    if ('key' in props) {
        key = props['key'];
        props['key'] = undefined;
    }
    return {
        type,
        props: {
            ...props,
            children: childrens.length <= 1 ? (childrens[0] || '') : childrens
        },
        ref,
        key
    };
}

// RENDER渲染的时候，我们需要做处理，首先判断TYPE的类型，如果是字符串，就创建一个元素标签，如果函数或者类，就把函数执行，把PROPS中的每一项（包含CHILDREN）传递给函数
// 在执行函数的时候，把函数中RERURN的JSX转换为新的对象（通过CREATE-ELEMENT），把这个对象返回；紧接着RENDER按照以往的渲染方式，创建DOM元素，插入到指定的容器中即可

function render(objJSX, container, callBack) {
    let {type, props} = objJSX,
        {children} = props;
    let newElement = document.createElement(type);
    for (let attr in props) {
        if (!props.hasOwnProperty(attr)) break;
        let value = props[attr];
        if (value == undefined) continue;//=>NULL OR UNDEFINED

        switch (attr.toUpperCase()) {
            case 'CLASSNAME':
                newElement.setAttribute('class', value);
                break;
            case 'STYLE':
                for (let styleAttr in value) {
                    if (value.hasOwnProperty(styleAttr)) {
                        newElement['style'][styleAttr] = value[styleAttr];
                    }
                }
                break;
            case 'CHILDREN':
                /*
                 * 可能是一个值：可能是字符串也可能是一个JSX对象
                 * 可能是一个数组：数组中的每一项可能是字符串也可能是JSX对象
                 */
                //->首先把一个值也变为数组，这样后期统一操作数组即可
                !(value instanceof Array) ? value = [value] : null;
                value.forEach((item, index) => {
                    //->验证ITEM是什么类型的：如果是字符串就是创建文本节点，如果是对象，我们需要再次执行RENDER方法，把创建的元素放到最开始创建的大盒子中
                    if (typeof item === 'string') {
                        let text = document.createTextNode(item);
                        newElement.appendChild(text);
                    } else {
                        render(item, newElement);
                    }
                });
                break;
            default:
                newElement.setAttribute(attr, value);
        }
    }
    container.appendChild(newElement);
    callBack && callBack();
}

export {
    createElement,
    render
};