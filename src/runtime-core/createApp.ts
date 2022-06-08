import { render } from "./render"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //创建VNode
            
            const vnode = createVNode(rootComponent)
            //处理VNode
            
            render(vnode,rootContainer)

        }
    }
}




