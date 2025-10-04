import { config } from "./config.js";

/**
 * HTTP client for communicating with the SuperUI API server
 */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpClient {
  get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ status: number; data: T }>;
  post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ status: number; data: T }>;
  put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ status: number; data: T }>;
  delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ status: number; data: T }>;
  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<{ status: number; data: T }>;
}

/**
 * Create HTTP method function
 * @param method - HTTP method
 * @returns Function that performs HTTP request
 */
const createMethod = (method: HttpMethod) => {
  return async <T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ) => {
    const url = `${config.apiBaseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "User-Agent": "SuperUI-MCP-Server/1.0.0",
      ...options.headers,
    };

    console.log(`🌐 HTTP ${method} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        method,
        headers,
        ...(data ? { body: JSON.stringify(data) } : {}),
        signal: AbortSignal.timeout(config.timeout || 30000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API Server Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log(`✅ HTTP ${method} ${url} - Status: ${response.status}`);
      
      return { status: response.status, data: responseData };
    } catch (error) {
      console.error(`❌ HTTP ${method} ${url} - Error:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${config.timeout}ms`);
        }
        throw error;
      }
      
      throw new Error(`Unknown error occurred: ${error}`);
    }
  };
};

/**
 * HTTP client instance
 */
export const httpClient: HttpClient = {
  get: createMethod("GET"),
  post: createMethod("POST"),
  put: createMethod("PUT"),
  delete: createMethod("DELETE"),
  patch: createMethod("PATCH"),
};
