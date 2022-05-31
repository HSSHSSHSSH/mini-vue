import {reactive,isReactive,isProxy} from '../reactive'


describe('reactive',() => {
    it('happy path',()  => {
      const original = {foo:1}
      const observed = reactive(original)
      const arr = [0,1]
      const reactiveArr = reactive(arr)
      expect(isReactive(reactiveArr)).toBe(true)
      expect(observed).not.toBe(original)
      expect(observed.foo).toBe(original.foo)
      expect(isReactive(observed)).toBe(true) //判断数据是否为响应式数据
      expect(isReactive(original)).toBe(false)
      expect(isProxy(original)).toBe(false)
      expect(isProxy(observed)).toBe(true)
    })

    it('nested reactive',() => {
      const original = {
        obj: {
          foo :1
        },
        arr: [{prop:0},1]
      }
      const observed = reactive(original)
      expect(isReactive(observed)).toBe(true)
      expect(isReactive(observed.obj)).toBe(true)
      expect(isReactive(observed.arr)).toBe(true)
      expect(isReactive(observed.arr[0])).toBe(true)
    })
})