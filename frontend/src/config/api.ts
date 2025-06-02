/**
 * API Configuration
 * This file contains all API endpoints and configuration for the EliteReplicas application
 */

// Base API URL - this should be your actual backend URL in production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API Version - not used in current backend implementation
export const API_VERSION = '';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  FORGOT_PASSWORD: '/auth/forgot-password',
  REQUEST_PASSWORD_RESET: '/auth/forgot-password', // Alias for FORGOT_PASSWORD
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_TOKEN: '/auth/verify-token',
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  ORDERS: '/users/orders',
};

// Product endpoints
export const PRODUCT_ENDPOINTS = {
  ALL: '/products',
  DETAIL: (id: string) => `/products/${id}`,
  FEATURED: '/products?featured=true',
  BY_CATEGORY: (category: string) => `/products?category=${category}`,
  SEARCH: (query: string) => `/products?search=${query}`,
  ADD_REVIEW: (id: string) => `/products/${id}/reviews`,
};

// Category endpoints
export const CATEGORY_ENDPOINTS = {
  ALL: '/categories',
  DETAIL: (slug: string) => `/categories/${slug}`,
};

// Cart endpoints
export const CART_ENDPOINTS = {
  GET: '/cart',
  ADD: '/cart/add',
  UPDATE: '/cart/update',
  REMOVE: '/cart/remove',
  CLEAR: '/cart/clear',
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  CREATE: '/orders',
  DETAIL: (id: string) => `/orders/${id}`,
  USER_ORDERS: '/orders/user',
};

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  DASHBOARD: '/admin/dashboard',
  DASHBOARD_STATS: '/admin/dashboard/stats',
  PRODUCTS: '/admin/products',
  PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
  CATEGORIES: '/admin/categories',
  CATEGORY_DETAIL: (id: string) => `/admin/categories/${id}`,
  ORDERS: '/admin/orders',
  ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  VERIFY_TOKEN: '/auth/verify-token',
};

// Determine if we should use the local Next.js API or the backend API
export const shouldUseLocalApi = (endpoint: string): boolean => {
  // Always use the real backend API
  return false;
};

// Get the full API URL based on the endpoint
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Always use external backend API
  // Note: The backend doesn't use /api prefix in routes based on the backend code
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
