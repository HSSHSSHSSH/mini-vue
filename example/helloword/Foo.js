import { h } from "../../lib/guide-mini-vue.esm";
/**
 * props满足：
 * 1.可传入
 * 2.可在render中读取
 * 3.不可修改  readonly
 */
export const Foo = {
    setup(props) {
        console.log('props in foo',props);
    },

    render() {
        return h(
            'div',
            {},
            "foo" + this.propsa
        )
    }
}