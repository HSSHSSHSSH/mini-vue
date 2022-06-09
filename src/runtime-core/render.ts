import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode,container) {
    
    
    patch(vnode,container)
}

export function patch(vnode: any, container: any) {
   //element类型用于渲染
   //instance类型储存着element与其他数据
    const {shapeFlags} = vnode
    if(shapeFlags === ShapeFlags.ELEMENT){

        //vnode 是 element类型
        processElement(vnode,container)
        
    } else if(shapeFlags === ShapeFlags.STATEFUL_COMPONENT) {
        
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
    
    //component类型的vnode进一步封装为 component的instance
    const instance = createComponentInstance(initialVNode)
    //初始化component的instance
    setupComponent(instance)
    //instance -> element
    setupRenderEffect(instance,initialVNode,container)
}


function setupRenderEffect(instance: any, initinalVode, container: any) {
    
    const {proxy} = instance
    var subTree = instance.render.call(proxy) //element
    
    patch(subTree,container)
    instance.vnode.el = subTree.el
}

function processElement(vnode: any, container: any) {
    mountElement(vnode,container)
}

function mountElement(vnode: any, container: any) {
    const el = vnode.el = document.createElement(vnode.type)
        console.log('vnode.el',vnode);
        
        const {props,children,shapeFlags} = vnode
        setAttributes(el,props)
        if(shapeFlags & ShapeFlags.ARRAY_CHILDREN){
            mountChildren(children,el)
        }else if(shapeFlags & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        }
        container.append(el)
}

