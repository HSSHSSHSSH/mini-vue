import { ReactiveEffect } from "./effect"

class ComputedRefImp {
    private _getter :any
    private _dirty: boolean = true
    private _effect: any
    private _value:any
    constructor(getter) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter,() => {
            this._dirty = true
            
        })
    }

    get value() {
        
        if(this._dirty){
            this._dirty = false
            this._value =  this._effect.run() //赋值 activeEffect以及其他操作
        }
        return this._value
    }
}


export function computed(getter) {
   return new ComputedRefImp(getter)
}