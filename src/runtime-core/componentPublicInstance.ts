
const publicPropertiesMap = {
    $el: (i) =>  i.vnode.instance
} 


export const publicInstanceHandlers = {
    get({_:instance},key) {
        const {setupState} = instance
        if(key in setupState) {
            return setupState[key]
        }
        
       const publicGetter = publicPropertiesMap[key]
       if(publicGetter) {
           return publicGetter()
       }
    }
}