import { h } from "../../lib/guide-mini-vue.esm.js";
/**
 * props满足：
 * 1.可传入
 * 2.可在render中读取
 * 3.不可修改  readonly
 */
export const Foo = {
    setup(props) {
        console.log('props in foo',props);
        return props
    },

    render() {
        return h(
            'div',
            {
                onClick() {
                    console.log('点击事件触发');
                }
            },
            "foo: " + this.count
        )
    }
}