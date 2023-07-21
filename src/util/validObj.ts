import { obj } from "../types/global"

const validObj = (data: obj) => {
    return Object.keys(data)?.length > 0
}

export default validObj;