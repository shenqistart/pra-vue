import {track,trigger} from './effect'
export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            console.log('get', key);
            const res = Reflect.get(target, key);
            // TODO 收集依赖
            track(target, key);
            return res;
        },
        set(target, key, value) {
            console.log('set', key, value);
            const res =  Reflect.set(target, key, value);
            trigger(target, key);
            return res;
        }
    })
}