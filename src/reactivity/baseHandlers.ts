import { extend, isObject } from "../shared"
import { track ,trigger} from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"



const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true,true)

const mutableHandler = {
    get,
    set
}

const readonlyHandler = {
    get:readonlyGet,
    set: (target,key) => {
        console.warn(`key${key}不可被修改，因为${target}是readonly`)
        return true
    }
}

const shallowReadonlyHandler = extend({},readonlyHandler,{
    get: shallowReadonlyGet
})



function createGetter(isReadonly = false,shallow = false) {
    return function get(target,key){
        const res = Reflect.get(target,key)

        if(key == ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }
        if(key == ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        
        if(shallow) {
            return res
        }
           // 收集依赖
           if(!isReadonly) {
               track(target,key)
           }
           if(isObject(res)){
               return isReadonly ? readonly(res): reactive(res)
           }
           return res
    }
}

function createSetter() {
    return function set(target,key,value) {
        const res = Reflect.set(target,key,value)
        //todo 触发依赖
        trigger(target,key)
        return res
    }
}







export {mutableHandler,readonlyHandler,shallowReadonlyHandler}