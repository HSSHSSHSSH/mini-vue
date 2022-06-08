import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from '../ref'

describe("ref",() => {
    it("happy path", () => {
        const a = ref(1)
        expect(a.value).toBe(1)
    })

    it("shoule be reactive", () => {
        const a = ref(1)
        let dummy
        let calls = 0
        effect(() => {
            calls++
            dummy = a.value
        })
        expect(dummy).toBe(1)
        expect(calls).toBe(1)
        a.value = 2
        expect(dummy).toBe(2)
        expect(calls).toBe(2)
        a.value = 2
        ////same value should not trigger
        expect(dummy).toBe(2)
        expect(calls).toBe(2)
    })

    it("shoule make nested properties reactive", () => {
        const a = ref({
            count:1
        })
        let dummy 
        effect(() => {
            dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
    })


    it("isRef",() => {
        const a = ref(1)
        const user = reactive({
            age:1
        })
        expect(isRef(a)).toBe(true)
        expect(isRef(1)).toBe(false)
        expect(isRef(user)).toBe(false)
        expect(isRef(user.age)).toBe(false)
    })

    it('unRef',() => {
        const a = ref(1)
        const user = ref({
            age:1
        })
        expect(unRef(a)).toBe(1)
        expect(unRef(user)).toStrictEqual({age:1})
        expect(unRef(1)).toBe(1)
        expect(unRef({age:1})).toStrictEqual({age:1})
    })

    it("proxyRefs",() => {
        const user = {
            name: "hsh",
            age: ref(10)
        }
        const proxyUser = proxyRefs(user)
        expect(proxyUser.name).toBe('hsh')
        expect(user.age.value).toBe(10)
        expect(proxyUser.age).toBe(10)


        proxyUser.age = 11
        expect(proxyUser.age).toBe(11)
        expect(user.age.value).toBe(11)

        proxyUser.age = ref(12)
        expect(proxyUser.age).toBe(12)
        expect(user.age.value).toBe(12)

    })
})