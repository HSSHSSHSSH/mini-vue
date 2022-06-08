import { h } from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const App = {
    render(){
        window.self = this
        return h('div',{class:'red'},[
            h('div',{class:'red'},this.name),
            h('div',{class:'red'},this.age),
        ])
    },

    setup() {
       return {
           name: 'hsh',
           age: 25
       }
    }
}