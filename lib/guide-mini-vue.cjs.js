'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const publicPropertiesMap = {
    $el: (i) => i.vnode.el
};
const publicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {}
    };
    return instance;
}
function setupComponent(instance) {
    //todo  
    // initProps
    // initSlots
    //initSetup
    setupStatefulInstance(instance);
}
function setupStatefulInstance(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
        instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance, setupResult) {
    const component = instance.type;
    instance.render = component.render;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    //element类型用于渲染
    //instance类型储存着element与其他数据
    const { shapeFlags } = vnode;
    if ((shapeFlags & 1 /* ELEMENT */) === 1 /* ELEMENT */) {
        //vnode 是 element类型
        processElement(vnode, container);
    }
    else if ((shapeFlags & 2 /* STATEFUL_COMPONENT */) === 2 /* STATEFUL_COMPONENT */) {
        //vnode 是 component类型
        processComponent(vnode, container);
    }
}
function setAttributes(el, props) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    for (const key in props) {
        const val = props[key];
        if (isOn(key)) { //注册事件
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else { //注册属性
            el.setAttribute(key, val);
        }
    }
}
function mountChildren(children, container) {
    children.forEach(el => {
        patch(el, container);
    });
}
function processComponent(vnode, container) {
    //component的初始化与更新
    //初始化
    mountComponent(vnode, container);
    //todo 更新
}
function mountComponent(initialVNode, container) {
    //component类型的vnode进一步封装为 component的instance
    const instance = createComponentInstance(initialVNode);
    //初始化component的instance
    setupComponent(instance);
    //instance -> element
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initinalVode, container) {
    const { proxy } = instance;
    var subTree = instance.render.call(proxy); //element
    patch(subTree, container);
    initinalVode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = vnode.el = document.createElement(vnode.type);
    const { props, children, shapeFlags } = vnode;
    setAttributes(el, props);
    if (shapeFlags & 8 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
    }
    else if (shapeFlags & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    container.append(el);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getShapeFlags(type)
    };
    if (typeof children === "string") {
        vnode.shapeFlags = vnode.shapeFlags | 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags = vnode.shapeFlags | 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === "string" ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //创建VNode
            const vnode = createVNode(rootComponent);
            //处理VNode
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
