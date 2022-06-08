function isObject(value) {
    return value !== undefined && typeof (value) == "object";
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.instance
};
const publicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter();
        }
    }
};

function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type
    };
    return instance;
}
function setupComponent(instance) {
    //todo  initProps initSlots
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
    if (typeof vnode.type === 'string') {
        //vnode 是 element类型
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        //vnode 是 component类型
        processComponent(vnode, container);
    }
}
function setAttributes(el, props) {
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
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
    //component 转为element
    const instance = createComponentInstance(initialVNode);
    //初始化element
    setupComponent(instance);
    //处理element
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initinalVode, container) {
    const { proxy } = instance;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
    instance.vnode.el = subTree.el;
    console.log(instance.vnode.el, '123');
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = vnode.el = document.createElement(vnode.type);
    console.log('vnode.el', vnode);
    const { props, children } = vnode;
    setAttributes(el, props);
    if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    else {
        el.textContent = children;
    }
    container.append(el);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
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

export { createApp, h };
