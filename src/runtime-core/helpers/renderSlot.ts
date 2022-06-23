import { createVNode, Fragment } from "../vnode";

export function renderSlot(slots,name,props) {
    console.log('props',props);
    
    let slot = slots[name]
    if(slot) {
        if(typeof slot === 'function') {
            
            return createVNode("div",{},slot(props)) 
        }
        
        return createVNode(Fragment,{},slot)
    }
}