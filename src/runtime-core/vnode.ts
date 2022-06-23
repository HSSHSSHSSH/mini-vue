import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type,props?,children?){
   const vnode = {
       type,
       props,
       children,
       el: null,
       shapeFlags: getShapeFlags(type)
   }
  
   if(typeof children === "string") {  //基于children 判断shapeFlags
       vnode.shapeFlags |=  ShapeFlags.TEXT_CHILDREN
   } else if(Array.isArray(children)) {
       vnode.shapeFlags |=  ShapeFlags.ARRAY_CHILDREN
   } else if (isObject(children)) {
    normalizeChildren(vnode)
   }
   
   return vnode
}

export function createTextVNode(text: string) {
    return createVNode(Text,{},text)
}


function getShapeFlags(type) {  //基于type 判断shapFlags
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

function normalizeChildren(vnode) {
    if(!(vnode.shapeFlags & ShapeFlags.ELEMENT)) vnode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN
}