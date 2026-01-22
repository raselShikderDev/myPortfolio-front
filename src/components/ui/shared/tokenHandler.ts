import { cookies } from "next/headers"

export const deleteCookie = async (key:string)=>{
    const cookieStore = await cookies()
    return cookieStore.delete(key)
}