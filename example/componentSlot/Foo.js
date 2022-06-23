import { h, renderSlot,getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const Foo = {
    name: "Foo",
    setup() {
        const currentInstance = getCurrentInstance()
        console.log('Foo:',currentInstance);
        return {}
    },

    render() {
        const a = 'aaa'
        const b = 'bbb'
        window.self = this
        console.log('slots',this.$slots);
        const foo = h("p",{},"Foo")
        return h("h1",{},[renderSlot(this.$slots,'header',{a}),foo,renderSlot(this.$slots,'footer',{b})])   
    }                                                     // 不可确定slots类型而在初始化时都是对component的vnode进行处理

}