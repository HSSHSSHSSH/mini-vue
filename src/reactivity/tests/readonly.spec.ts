import {readonly,isReadonly, isProxy} from '../reactive'
describe("readonly",() => {
    it("happy path",() => {
      const original = {foo: 1, bar: { baz : 2}}
      const wrapped = readonly(original)
      expect(wrapped).not.toBe(original)
      expect(wrapped.foo).toBe(1)
      expect(wrapped.bar).toStrictEqual({baz:2})
      expect(wrapped.bar.baz).toBe(2)
      expect(isReadonly(wrapped.bar)).toBe(true)
      expect(isReadonly(original)).toBe(false)  //判断数据是否为readonly
      expect(isReadonly(original.bar)).toBe(false)
      expect(isReadonly(wrapped)).toBe(true)
      expect(isProxy(original)).toBe(false)
      expect(isProxy(wrapped)).toBe(true)
    })

    it("warning when set readonly",() => {
        //mock
        console.warn = jest.fn()
        const obj = readonly({foo:1})
        obj.foo = 2
        expect(console.warn).toBeCalled()
    })

})