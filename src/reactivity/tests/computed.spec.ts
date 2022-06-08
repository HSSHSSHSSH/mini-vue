import { computed } from "../computed"
import { reactive } from "../reactive"

describe("computed",() => {
    it.skip("happy path",() => {
        const user = reactive({
            age:1
        })
        const age = computed(() => {
            return user.age
        })
        expect(age.value).toBe(1)
    })

    it("should computed lazliy",() => {
        /**
         * 仅当首次调用计算属性与改变计算属性的值时触发getter
         */
        const user = reactive({
            age: 1
        })
        const getter = jest.fn(() => {
            return user.age
        })
        const cValue = computed(getter)
        expect(getter).toHaveBeenCalledTimes(0)
        cValue.value  //首次调用计算属性，触发getter
        expect(getter).toHaveBeenCalledTimes(1)
        cValue.value //往后调用计算属性不会再触发getter
        expect(getter).toHaveBeenCalledTimes(1)
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)
        user.age = 9  //每当计算属性依赖的响应式对象触发set且computed触发get时，getter触发
        expect(cValue.value).toBe(9)
        expect(getter).toHaveBeenCalledTimes(2)
        user.age = 6
        expect(cValue.value).toBe(6)
        expect(getter).toHaveBeenCalledTimes(3)
    })
})