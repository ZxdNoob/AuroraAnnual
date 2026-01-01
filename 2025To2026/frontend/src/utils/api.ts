/**
 * API 工具函数
 * 
 * @description 提供统一的 API 请求方法，包括错误处理、认证等
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

/**
 * API 请求配置接口
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
  token?: string
}

/**
 * 构建请求 URL
 * 
 * @param endpoint - API 端点
 * @param params - 查询参数
 * @returns 完整的请求 URL
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }
  
  return url.toString()
}

/**
 * 获取认证头
 * 
 * @param token - JWT Token
 * @returns 认证头对象
 */
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * 处理 API 响应
 * 
 * @param response - Fetch 响应对象
 * @returns 解析后的数据
 * @throws 如果响应不成功，抛出错误
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

/**
 * GET 请求
 * 
 * @param endpoint - API 端点
 * @param config - 请求配置
 * @returns Promise<T>
 */
export async function get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}

/**
 * POST 请求
 * 
 * @param endpoint - API 端点
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns Promise<T>
 */
export async function post<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: data ? JSON.stringify(data) : undefined,
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}

/**
 * PUT 请求
 * 
 * @param endpoint - API 端点
 * @param data - 请求体数据
 * @param config - 请求配置
 * @returns Promise<T>
 */
export async function put<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: data ? JSON.stringify(data) : undefined,
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}

/**
 * DELETE 请求
 * 
 * @param endpoint - API 端点
 * @param config - 请求配置
 * @returns Promise<T>
 */
export async function del<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}

/**
 * 获取认证 Token（从 localStorage）
 * 
 * @returns JWT Token 或 null
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

