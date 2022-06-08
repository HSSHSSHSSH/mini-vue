import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container) {
    
    
    patch(vnode,container)
}

export function patch(vnode: any, container: any) {
   
    
    if(typeof vnode.type === 'string'){

        //vnode 是 element类型
        processElement(vnode,container)
        
    } else if(isObject(vnode.type)) {
        
        //vnode 是 component类型
        processComponent(vnode,container)
    }

}

function setAttributes(el,props){
  for (const key in props) {
      const val = props[key]
      el.setAttribute(key,val)
  }
}

function mountChildren(children,container){
    children.forEach(el => {
        patch(el,container)
    });
}

function processComponent(vnode: any, container: any) {
    
    //component的初始化与更新
    //初始化
    mountComponent(vnode,container)
    //todo 更新
}

function mountComponent(initialVNode: any, container: any) {
    
    //component 转为element
    const instance = createComponentInstance(initialVNode)
    //初始化element
    setupComponent(instance)
    //处理element
    setupRenderEffect(instance,initialVNode,container)
}


function setupRenderEffect(instance: any, initinalVode, container: any) {
    
    const {proxy} = instance
    var subTree = instance.render.call(proxy)
    
    patch(subTree,container)
    instance.vnode.el = subTree.el
    console.log(instance.vnode.el,'123');
}

function processElement(vnode: any, container: any) {
    mountElement(vnode,container)
}

function mountElement(vnode: any, container: any) {
    const el = vnode.el = document.createElement(vnode.type)
        console.log('vnode.el',vnode);
        
        const {props,children} = vnode
        setAttributes(el,props)
        if(Array.isArray(children)){
            mountChildren(children,el)
        }else {
            el.textContent = children
        }
        container.append(el)
}

