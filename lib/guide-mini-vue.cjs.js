'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const extend = Object.assign;
function isObject(value) {
    return value !== undefined && typeof (value) == "object";
}
function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(value, key);
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function toHandlerKey(str) {
    return str ? "on" + capitalize(str) : '';
}
function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
}

// let _activeEffect  //当前活跃函数
const targetMap = new Map();
function triggerEffects(deps) {
    deps.forEach(f => {
        if (f.scheduler) {
            f.scheduler();
        }
        else {
            f.run();
        }
    });
}
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let deps = depsMap.get(key);
    triggerEffects(deps);
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandler = {
    get,
    set
};
const readonlyHandler = {
    get: readonlyGet,
    set: (target, key) => {
        console.warn(`key${key}不可被修改，因为${target}是readonly`);
        return true;
    }
};
const shallowReadonlyHandler = extend({}, readonlyHandler, {
    get: shallowReadonlyGet
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key);
        if (key == "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        if (key == "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        //todo 触发依赖
        trigger(target, key);
        return res;
    };
}

function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw))
        return;
    return new Proxy(raw, baseHandlers);
}
function reactive(raw) {
    return createActiveObject(raw, mutableHandler);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandler);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandler);
}

function emit(instance, event, ...args) {
    //触发props中传入的事件
    const { props } = instance;
    const handler = props[toHandlerKey(camelize(capitalize(event)))];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const publicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlags | 16 /* SLOTS_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
function normalizeObjectSlots(children, slots) {
    console.log('children', children);
    for (let key in children) {
        const value = children[key];
        if (typeof value === 'function') {
            slots[key] = (props) => normalizeSlotValue(value(props));
        }
        else {
            slots[key] = normalizeSlotValue(value);
        }
    }
    slots = slots;
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

let currentInstance = null;
function createComponentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { }
    };
    instance.emit = emit.bind(null, instance);
    return instance;
}
function setupComponent(instance) {
    // initProps
    initProps(instance, instance.vnode.props);
    // initSlots
    initSlots(instance, instance.vnode.children);
    //initSetup
    setupStatefulInstance(instance);
}
function setupStatefulInstance(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        }); //setup传参问题 有的传有的不传统一写成传的  answer不传的就是undefined
        setCurrentInstance(null);
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
        instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers);
        /**
         * question
         * 1.why proxy
         * 2.what & why {_:instance}   why not new Proxy(setupResult: {...})
         * answer
         * this访问的不止setupResult中的属性
         */
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance, setupResult) {
    const component = instance.type;
    instance.render = component.render;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}
function getCurrentInstance() {
    return currentInstance;
}

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null,
        shapeFlags: getShapeFlags(type)
    };
    if (typeof children === "string") { //基于children 判断shapeFlags
        vnode.shapeFlags |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ARRAY_CHILDREN */;
    }
    else if (isObject(children)) {
        normalizeChildren(vnode);
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlags(type) {
    return typeof type === "string" ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}
function normalizeChildren(vnode) {
    if (!(vnode.shapeFlags & 1 /* ELEMENT */))
        vnode.shapeFlags |= 16 /* SLOTS_CHILDREN */;
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    //element类型用于渲染
    //instance类型储存着element与其他数据
    const { shapeFlags, type } = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if ((shapeFlags & 1 /* ELEMENT */) === 1 /* ELEMENT */) {
                //vnode 是 element类型
                processElement(vnode, container);
            }
            else if ((shapeFlags & 2 /* STATEFUL_COMPONENT */) === 2 /* STATEFUL_COMPONENT */) {
                //vnode 是 component类型
                processComponent(vnode, container);
            }
            break;
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
function processFragment(vnode, container) {
    mountChildren(vnode, container);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = vnode.el = document.createTextNode(children);
    container.append(textNode);
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

function renderSlot(slots, name, props) {
    console.log('props', props);
    let slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode("div", {}, slot(props));
        }
        return createVNode(Fragment, {}, slot);
    }
}

exports.createApp = createApp;
exports.createTextVNode = createTextVNode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.renderSlot = renderSlot;
