/**
 * API utility functions for making consistent backend requests
 */
import { getApiUrl, shouldUseLocalApi } from '@/config/api';

// Cache for API responses to improve performance and reduce redundant requests
const apiCache: Record<string, { data: any; timestamp: number }> = {};

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Get the API base URL from environment variables or use default
export const getApiBaseUrl = (): string => {
  // For Next.js API routes, we don't need a base URL
  // For external API calls to the backend, use the backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

// Clear cache for a specific endpoint or pattern
export const clearApiCache = (pattern?: string): void => {
  if (!pattern) {
    // Clear all cache
    Object.keys(apiCache).forEach(key => delete apiCache[key]);
  } else {
    // Clear cache for matching pattern
    Object.keys(apiCache).forEach(key => {
      if (key.includes(pattern)) {
        delete apiCache[key];
      }
    });
  }
};



// WebSocket connection for real-time updates (if available)
let wsConnection: WebSocket | null = null;

// Initialize WebSocket connection for real-time updates
const initWebSocketConnection = () => {
  // Only initialize in browser environment and if not already connected
  if (typeof window !== 'undefined' && !wsConnection) {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';
      wsConnection = new WebSocket(wsUrl);
      
      wsConnection.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different types of real-time updates
          if (data.type === 'product_update') {
            // Clear product cache to fetch fresh data
            clearApiCache('products');
          } else if (data.type === 'category_update') {
            // Clear category cache
            clearApiCache('categories');
          } else if (data.type === 'order_update') {
            // Clear order cache
            clearApiCache('orders');
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsConnection = null;
      };
      
      wsConnection.onclose = () => {
        console.log('WebSocket connection closed');
        wsConnection = null;
        
        // Try to reconnect after a delay
        setTimeout(() => {
          initWebSocketConnection();
        }, 5000);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }
};

// Initialize WebSocket in browser environment
if (typeof window !== 'undefined') {
  initWebSocketConnection();
}

/**
 * Make a GET request to the API
 * @param endpoint - API endpoint (without leading slash)
 * @param queryParams - Optional query parameters
 * @param useCache - Whether to use and update cache (default: true)
 * @returns Promise with the response data
 */
export const apiGet = async <T>(
  endpoint: string, 
  queryParams: Record<string, string> = {}, 
  useCache: boolean = true
): Promise<T> => {
  // Build query string
  const queryString = Object.keys(queryParams).length > 0
    ? `?${new URLSearchParams(queryParams).toString()}`
    : '';
  
  // Get the full URL using the configuration
  const fullEndpoint = endpoint + queryString;
  const url = getApiUrl(fullEndpoint);
  
  // Check cache first if useCache is true
  const cacheKey = `GET:${url}`;
  if (useCache && apiCache[cacheKey]) {
    const { data, timestamp } = apiCache[cacheKey];
    const now = Date.now();
    
    // Return cached data if it's not expired
    if (now - timestamp < CACHE_EXPIRATION) {
      return data as T;
    } else {
      // Remove expired cache
      delete apiCache[cacheKey];
    }
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update cache if useCache is true
    if (useCache) {
      apiCache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
    }

    return data as T;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param endpoint - API endpoint (without leading slash)
 * @param data - Request body data
 * @param clearCachePattern - Optional pattern to clear from cache after successful request
 * @returns Promise with the response data
 */
export const apiPost = async <T>(
  endpoint: string, 
  data: any, 
  clearCachePattern?: string
): Promise<T> => {
  // Get the full URL using the configuration
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Clear cache pattern if specified (for real-time updates)
    if (clearCachePattern) {
      clearApiCache(clearCachePattern);
    }

    return responseData as T;
  } catch (error) {
    console.error(`Failed to post to ${url}:`, error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param endpoint - API endpoint (without leading slash)
 * @param data - Request body data
 * @param clearCachePattern - Optional pattern to clear from cache after successful request
 * @returns Promise with the response data
 */
export const apiPut = async <T>(
  endpoint: string, 
  data: any, 
  clearCachePattern?: string
): Promise<T> => {
  // Get the full URL using the configuration
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Clear cache pattern if specified (for real-time updates)
    if (clearCachePattern) {
      clearApiCache(clearCachePattern);
    }

    return responseData as T;
  } catch (error) {
    console.error(`Failed to put to ${url}:`, error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param endpoint - API endpoint (without leading slash)
 * @param clearCachePattern - Optional pattern to clear from cache after successful request
 * @returns Promise with the response data
 */
export const apiDelete = async <T>(
  endpoint: string, 
  clearCachePattern?: string
): Promise<T> => {
  // Get the full URL using the configuration
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Clear cache pattern if specified (for real-time updates)
    if (clearCachePattern) {
      clearApiCache(clearCachePattern);
    }

    return responseData as T;
  } catch (error) {
    console.error(`Failed to delete from ${url}:`, error);
    throw error;
  }
};

/**
 * Simplified fetch data function that uses apiGet
 * @param endpoint - API endpoint (with or without leading slash)
 * @param queryParams - Optional query parameters
 * @param useCache - Whether to use and update cache (default: true)
 * @returns Promise with the response data
 */
export const fetchData = async <T>(
  endpoint: string, 
  queryParams: Record<string, string> = {},
  useCache: boolean = true
): Promise<T> => {
  // Pass the endpoint directly to apiGet without modifying it
  // The apiGet function will handle both Next.js API routes and external APIs
  return apiGet<T>(endpoint, queryParams, useCache);
};

/**
 * Upload a file to the API
 * @param endpoint - API endpoint (without leading slash)
 * @param file - File to upload
 * @param additionalData - Additional form data to include
 * @param clearCachePattern - Optional pattern to clear from cache after successful request
 * @returns Promise with the response data
 */
export const uploadFile = async <T>(
  endpoint: string, 
  file: File, 
  additionalData: Record<string, string> = {},
  clearCachePattern?: string
): Promise<T> => {
  // Get the full URL using the configuration
  const url = getApiUrl(endpoint);
  
  // Create FormData object
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // Include cookies for authentication
      body: formData,
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Clear cache pattern if specified (for real-time updates)
    if (clearCachePattern) {
      clearApiCache(clearCachePattern);
    }

    return responseData as T;
  } catch (error) {
    console.error(`Failed to upload file to ${url}:`, error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a specific resource
 * @param resourceType - Type of resource to subscribe to (e.g., 'products', 'categories')
 * @param callback - Callback function to execute when updates are received
 */
export const subscribeToUpdates = (resourceType: string, callback: (data: any) => void): () => void => {
  if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
    initWebSocketConnection();
  }
  
  // Create a unique subscription ID
  const subscriptionId = `${resourceType}_${Date.now()}`;
  
  // Send subscription request
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify({
      type: 'subscribe',
      resource: resourceType,
      subscriptionId,
    }));
  }
  
  // Create message handler
  const messageHandler = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      // Check if this message is for our subscription
      if (data.type === `${resourceType}_update`) {
        callback(data.data);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  
  // Add event listener
  if (wsConnection) {
    wsConnection.addEventListener('message', messageHandler);
  }
  
  // Return unsubscribe function
  return () => {
    if (wsConnection) {
      // Remove event listener
      wsConnection.removeEventListener('message', messageHandler);
      
      // Send unsubscribe request
      if (wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.send(JSON.stringify({
          type: 'unsubscribe',
          subscriptionId,
        }));
      }
    }
  };
};
