
const publicPropertiesMap = {
    $el: (i) =>  i.vnode.el
} 


export const publicInstanceHandlers = {
    get({_:instance},key) {
        console.log(instance)
        
        const {setupState} = instance
        if(key in setupState) {
            return setupState[key]
        }
        
       const publicGetter = publicPropertiesMap[key]
       
       if(publicGetter) {
           return publicGetter(instance)
       }
    }
}