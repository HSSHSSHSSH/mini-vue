import { camelize, capitalize, toHandlerKey } from "../shared/index";

export function emit(instance,event,...args) {  //question 只希望用户在使用中传入第二个参数 answer 采用Function.prototype.bind
    
    //触发props中传入的事件
    const {props} = instance
    
    const handler = props[toHandlerKey(camelize(capitalize(event)))]
    
    handler && handler(...args)
}