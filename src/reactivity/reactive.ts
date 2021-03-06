import {track, trigger} from './effect'
import {mutableHandler,readonlyHandler, shallowReadonlyHandler} from './baseHandlers'
import { isObject } from '../shared/index'

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

function createActiveObject(raw:any,baseHandlers){
    if(!isObject(raw)) return
    return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
    return createActiveObject(raw,mutableHandler)
}


export function readonly(raw) {
    return createActiveObject(raw,readonlyHandler)
 }
export function shallowReadonly(raw) {
    return createActiveObject(raw,shallowReadonlyHandler)
}

 export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
 }

 export function isProxy(value) {
     return isReactive(value) || isReadonly(value)
 }

 export function isReadonly(value) {
   return !!value[ReactiveFlags.IS_READONLY]
 }


 

