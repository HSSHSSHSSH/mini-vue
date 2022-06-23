import {h,createTextVNode,getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
import {Foo} from './Foo.js'
export const App = {
    name: "App",
    setup() {
        const currentInstance = getCurrentInstance()
        console.log('App:',currentInstance);
        return {}
    },

    render() {

        const app = h("div",{},"app")
        // const foo = h(Foo,{},{default: h("div",{},'slots')})
        // const foo = h(Foo,{},{default: [h("div",{},`aaa }`),h("div",{},`bbb `)]})
        const foo = h(
            Foo,
            {},
            {
              header: ({a}) => [h("p",{},`certain header ${a}`),createTextVNode('我叫你')],
              footer: ({b}) => h("p",{},`certain footer ${b}`)
            }
        )

        return h("div",{},[app,foo])
    }
}