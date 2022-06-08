import { hasChanged, isObject } from '../shared'
import {trackEffects,triggerEffects} from './effect'
import { reactive } from './reactive'
class RefImpl {
   _value:any
   public deps
   private _rawValue
   public _v_isRef = true
   constructor(value) {
       this._rawValue = value
       this._value = convert(value)
       this.deps = new Set()
   }

   get value() {
       trackEffects(this.deps)
       return this._value
   }

   set value(newValue) {
       if(hasChanged(newValue,this._rawValue)) return //The Object.is() method determines whether two values are the same value.
       this._rawValue = newValue
       this._value = convert(newValue)
      triggerEffects(this.deps)
   }
}


function convert(value) {
    return isObject(value) ? reactive(value) : value
}

export function ref(value) {
    return new RefImpl(value)
}


export function isRef(ref) {
    return !!ref._v_isRef
}


export function unRef(ref) {
    return isRef(ref) ? ref._rawValue : ref
}

export function proxyRefs(objWithRef) {
    return new Proxy(objWithRef,{
        get(target,key) {
            return isRef(Reflect.get(target,key)) ? Reflect.get(target,key).value : Reflect.get(target,key)
        },
        set(target,key,value) {
            if(isRef(Reflect.get(target,key)) && !isRef(value)){
                return Reflect.get(target,key).value = value
            } else {
                return Reflect.set(target,key,value)
            }
        }
    })
}
