export const extend = Object.assign


export function isObject(value) {
    return value !== undefined && typeof(value) == "object"
}

export function hasChanged(newValue,value) {
    return Object.is(newValue,value)
}

export function hasOwn(value,key) {
    return Object.prototype.hasOwnProperty.call(value,key)
}

export function capitalize  (str: string)  {
    return str.charAt(0).toUpperCase() + str.slice(1)
} 

export function toHandlerKey  (str: string)  {
    return str ?  "on" + capitalize(str) : ''
}

export function camelize(str:string) {
    return str.replace(/-(\w)/g,(_,c:string) => {
       return c ? c.toUpperCase() : ""
    })
}