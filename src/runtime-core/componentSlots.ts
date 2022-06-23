import { ShapeFlags } from "../shared/shapeFlags"


export function initSlots(instance,children) {
    const {vnode} = instance
    if(vnode.shapeFlags | ShapeFlags.SLOTS_CHILDREN) {
        normalizeObjectSlots(children,instance.slots)
    }
   
}

function normalizeObjectSlots(children,slots) {
    console.log('children',children);
    
    for(let key in children) {
      const value = children[key]
      if(typeof value === 'function') {
         slots[key] = (props) => normalizeSlotValue(value(props));
      }else {
          slots[key] = normalizeSlotValue(value)
      }
    }
    slots = slots
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}