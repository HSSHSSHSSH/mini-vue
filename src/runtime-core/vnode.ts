import { ShapeFlags } from "../shared/shapeFlags"

export function createVNode(type,props?,children?){
   const vnode = {
       type,
       props,
       children,
       el: null,
       shapeFlags: getShapeFlags(type)
   }

   if(typeof children === "string") {
       vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN
   } else if(Array.isArray(children)) {
       vnode.shapeFlags = vnode.shapeFlags | ShapeFlags.ARRAY_CHILDREN
   }
   debugger
   return vnode
}

function getShapeFlags(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}