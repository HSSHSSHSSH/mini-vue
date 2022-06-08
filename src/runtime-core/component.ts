import { publicInstanceHandlers } from "./componentPublicInstance"
import { patch } from "./render"

export function createComponentInstance(vnode: any) {
    const instance = {
        vnode,
        type: vnode.type
    }
    
    return instance
}

export function setupComponent(instance) {
    //todo  initProps initSlots

    //initSetup
    
    setupStatefulInstance(instance)
}

function setupStatefulInstance(instance: any) {
    const component = instance.type
    const {setup} = component
    if(setup) {
        const setupResult = setup()
        handleSetupResult(instance,setupResult)
    }
}

function handleSetupResult(instance,setupResult: any) {
    if(typeof setupResult === 'object') {
      instance.setupState = setupResult
      instance.proxy = new Proxy({_:instance},publicInstanceHandlers)
    }
    finishComponentSetup(instance,setupResult)
}
 
function finishComponentSetup(instance: any, setupResult: any) {
    const component = instance.type
     
    instance.render = component.render
}


  


