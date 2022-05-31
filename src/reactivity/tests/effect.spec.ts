import {reactive} from '../reactive'
import {effect,stop,resume} from '../effect'
describe("effect", () => {
  it("happy path",() =>{
      //创建响应式对象
    const user = reactive({
        age:1
    })
    let nextAge
    //收集依赖
    effect(() => {
        nextAge = user.age + 1
    })
    expect(nextAge).toBe(2)
    //触发依赖
    user.age ++
    expect(nextAge).toBe(3)
  })
  it("shoule return runner whlie call effect",() => {  //返回当前副作用函数
    let foo = 10
    const runner = effect(() => {
      foo++
      return "foo"
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })

  it("scheduler",() => {  
    /**
     * 功能描述
     * scheduler 为一作为effect的参数的不同与副作用函数的另一参数
     * 当scheduler传入effect中且effect执行时，触发副作用函数，不触发scheduler
     * 当reactives数据发生set行为时，触发scheduler，不触发副作用函数
     * 当手动调用effect的返回函数runner时，触发副作用函数
     */
    let dummy
    let run: any
    const obj = reactive({
      foo:1
    })
    const scheduler = jest.fn(() => {
      run = runner
    })
    const runner = effect(() =>{
      dummy = obj.foo
    },{scheduler})
    expect(dummy).toBe(1)
    expect(scheduler).not.toHaveBeenCalled()
    obj.foo++
    expect(dummy).toBe(1)
    expect(scheduler).toHaveBeenCalledTimes(1)
    runner()
    expect(dummy).toBe(2)
    obj.foo++
    expect(dummy).toBe(2)
    expect(scheduler).toHaveBeenCalledTimes(2)
  })
  it("stop",() => {
    /**
     * 功能描述
     * 当执行stop时不会再触发trigger
     */
    let dummy
    let obj = reactive({props:1})
    const runner = effect(() => {
      dummy = obj.props
    })
    expect(dummy).toBe(1)
    obj.props ++
    expect(dummy).toBe(2)
    stop(runner)
    // obj.props = 3  //原版为stop后再次执行track自动唤醒trigger
    obj.props ++   //改版 stop后需手动唤醒 trigger
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })
  it("onStop",() => {
    /**
     * 功能描述：
     * 在触发stop时进行的额外操作
     */
    let dummy
    const obj = reactive({
      props:1
    })
    const onStop = jest.fn()
    const runner = effect(() => {
      dummy = obj.props
    },{onStop})
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })

  it('resume',() => {
    /**
     * 功能描述
     * 新增功能
     * 当stop后需手动调用resume唤醒副作用函数
     */
    let dummy
    const obj = reactive({
      props:1
    })
    const runner = effect(() => {
      dummy = obj.props
    })
    expect(dummy).toBe(1)
    stop(runner)
    obj.props ++
    expect(obj.props).toBe(2)
    expect(dummy).toBe(1)
    resume(runner)
    obj.props++
    expect(obj.props).toBe(3)
    expect(dummy).toBe(3)
  })
})