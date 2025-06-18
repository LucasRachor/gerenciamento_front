// src/services/api.ts
import axios from 'axios'
import { getTokenFromCookie } from '@/utils/getToken'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
    const token = getTokenFromCookie()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
