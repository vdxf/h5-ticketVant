import {Toast} from "vant";

export function withLoading (fn, opt = true) {
    return async (parmas, options = opt) => {
        if (typeof  options  === 'boolean'&& options) {
            options = { duration: 0, forbidClick: true, message: 'Loading' }
        } else if (typeof  options === 'string' ) {
            options = { duration: 0, forbidClick: true, message: options }
        }
        const toast = options ? Toast.loading(options) : null
        try {
            const res = await fn(parmas)
            toast && toast.close()
            return res
        } catch (err) {
            toast && toast.close()
            throw err
        }
    }
}