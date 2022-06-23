import { h } from '../../lib/guide-mini-vue.esm.js'
import {Foo} from './Foo.js'
window.self = null
export const App = {
    render(){
        window.self = this
        return h(
        'div',
        {
            class:'red',
            
        },
        [
            h('div',{class:'red'},this.name),
            h('div',{class:'red'},this.age),
            h(Foo,{count:1})
        ]
        )
    },

    setup() {
       return {
           name: 'hsh',
           age: '25'
       }
    }
}