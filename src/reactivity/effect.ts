// let _activeEffect  //当前活跃函数
// let bucket = new Map()  //target为键 reactive数据为值
// // let depsMap = new WeakMap() //key为键 与之对应的所有副作用函数为值
// // let deps = new Set() //某一target的某一key所对应的所有副作用函数集合

import { extend } from "../shared";


// function track(target,key){
//    if(!_activeEffect) return
//    let dpsmp = bucket.get(target)  //找到与target对应的depsMap
//    if(!dpsmp) {  //首次添加target对应的depsMap
//        bucket.set(target,( dpsmp =  new Map()))
//    }
   
//    let dps = dpsmp.get(key)  //找到与target中与key 对应的副作用函数集合
//    if(!dps) {
//        dpsmp.set(key,(dps =  new Set())) //初始化与target中key对应的集合
//    }
//    dps.add(_activeEffect)
// }

// function trigger(target,key) {
    
//     let dpsmp = bucket.get(target)  //找到与target对应的depsMap
//     let dps = dpsmp.get(key)  //找到与target中与key 对应的副作用函数集合
//     dps.forEach(f => {
//         f()
//     })
// }

// function effect(f) {
//     _activeEffect = f
//     f()
// }

// export {track, trigger,effect}


//引入oop
let activeEffect;
const targetMap = new Map()
export class ReactiveEffect {
 private _fn: any;
 scheduler: Function | undefined
 onStop?:  () => void
 active = true;
 depsEffect = new Set();
 constructor(fn, scheduler?: Function, onStop? :Function) {
     this._fn = fn
     this.scheduler = scheduler
 };
 run() {
     activeEffect = this
    return this._fn()
 }

 stop() {
   if(this.onStop) {
       this.onStop()
   }
   if(!this.active) return
   this.active = false
   cleanupEffect(this)
 }

 resume() {
     if(this.active) return
     this.active = true
 }
}

function cleanupEffect(effect) {
    effect.depsEffect.forEach((dep:any) => {
        dep.delete(effect)
    })
}

export function trackEffects(deps) {
    if(!(activeEffect && activeEffect.active)) return  //改版 stop后需手动resume唤醒trigger
  
    deps.add(activeEffect)
    
    activeEffect.depsEffect.add(deps)
}

export function triggerEffects(deps) {
    deps.forEach(f => {
        if(f.scheduler){
            f.scheduler()
        }else {
            f.run()
        }
    })
}


function track(target,key){
  if(!activeEffect) return
  let depsMap = targetMap.get(target)
  if(!depsMap) {
      targetMap.set(target,depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if(!deps) {
      depsMap.set(key,deps = new Set())
  }
  trackEffects(deps)
  
}



function trigger(target,key){
    let depsMap = targetMap.get(target)
    let deps = depsMap.get(key)
    triggerEffects(deps)
}

function effect(fn,options:any = {}) {
   const _effect = new ReactiveEffect(fn)
   extend(_effect,options)
   _effect.run()
   const runner: any = _effect.run.bind(_effect)
   runner.reactiveEffect = _effect
   return runner
}

function stop(runner) {
  runner.reactiveEffect.stop()
}

function resume(runner) {
  runner.reactiveEffect.resume()
}

export {track, trigger,effect,stop,resume}