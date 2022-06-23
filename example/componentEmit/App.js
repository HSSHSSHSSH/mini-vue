import {h} from '../../lib/guide-mini-vue.esm.js'
import {Foo} from './Foo.js'

export const App = {
    name: "App",
    render() {
        return h(
            'div',
            {},
            [
                h("div",{},'App'),
                h(Foo,{
                    onAdd(a,b) {
                        console.log('onAdd in props',a,b);
                    },
                    onAddFoo(a,b){
                        console.log('props in add-foo props',a,b);
                    }
                })
            ]
        )
    },
    setup() {
        return {}
    }
}