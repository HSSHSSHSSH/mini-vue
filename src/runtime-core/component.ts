import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"
import { patch } from "./render"
let currentInstance = null
export function createComponentInstance(vnode: any) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => {}
    }
     instance.emit = emit.bind(null,instance) as any
    return instance
}

export function setupComponent(instance) {
    
    // initProps
    initProps(instance,instance.vnode.props)
    // initSlots
    initSlots(instance,instance.vnode.children)
    //initSetup
    
    setupStatefulInstance(instance)
}

function setupStatefulInstance(instance: any) {
    const component = instance.type
    const {setup} = component
    if(setup) {
        setCurrentInstance(instance)
        const setupResult = setup(shallowReadonly(instance.props),{
            emit: instance.emit
        })  //setup传参问题 有的传有的不传统一写成传的  answer不传的就是undefined
        setCurrentInstance(null)
        handleSetupResult(instance,setupResult)
    }
}

function handleSetupResult(instance,setupResult: any) {
    if(typeof setupResult === 'object') {
      instance.setupState = setupResult
      instance.proxy = new Proxy({_:instance},publicInstanceHandlers)  
      /**
       * question
       * 1.why proxy
       * 2.what & why {_:instance}   why not new Proxy(setupResult: {...})
       * answer
       * this访问的不止setupResult中的属性
       */
    }
    finishComponentSetup(instance,setupResult)
}
 
function finishComponentSetup(instance: any, setupResult: any) {
    const component = instance.type
     
    instance.render = component.render
}

export function setCurrentInstance(instance) {
    currentInstance = instance
}

export function getCurrentInstance() {
    return currentInstance
}


  


