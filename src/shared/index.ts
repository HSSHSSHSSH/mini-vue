export const extend = Object.assign


export function isObject(value) {
    return value !== undefined && typeof(value) == "object"
}

export function hasChanged(newValue,value) {
    return Object.is(newValue,value)
}