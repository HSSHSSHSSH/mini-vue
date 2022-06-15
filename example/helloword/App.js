import { h } from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const App = {
    render(){
        window.self = this
        return h(
        'div',
        {
            class:'red',
            onClick() {
                console.log('点击事件触发');
            }
        },
        [
            h('div',{class:'red'},this.name),
            h('div',{class:'red'},this.age),
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