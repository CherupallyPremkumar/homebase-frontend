import type { User, Address, SearchRequest, SearchResponse, StateEntityServiceResponse, WishlistItem } from '@homebase/types';
import { getApiClient } from './client';

export const usersApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<User>>('/api/v1/users/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<User>>(`/api/v1/users/${id}`);
  },
  getProfile() {
    return getApiClient().get<StateEntityServiceResponse<User>>('/api/v1/users/me');
  },
  updateProfile(payload: Partial<User>) {
    return getApiClient().put<StateEntityServiceResponse<User>>('/api/v1/users/me', payload);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<User>>(`/api/v1/users/${id}/${eventId}`, payload ?? {});
  },
  // Addresses
  getAddresses() {
    return getApiClient().get<Address[]>('/api/v1/users/me/addresses');
  },
  addAddress(address: Omit<Address, 'id'>) {
    return getApiClient().post<Address>('/api/v1/users/me/addresses', address);
  },
  updateAddress(addressId: string, address: Partial<Address>) {
    return getApiClient().put<Address>(`/api/v1/users/me/addresses/${addressId}`, address);
  },
  deleteAddress(addressId: string) {
    return getApiClient().delete<void>(`/api/v1/users/me/addresses/${addressId}`);
  },
  // Wishlist
  getWishlist() {
    return getApiClient().get<WishlistItem[]>('/api/v1/users/me/wishlist');
  },
  addToWishlist(productId: string) {
    return getApiClient().post<WishlistItem>('/api/v1/users/me/wishlist', { productId });
  },
  removeFromWishlist(productId: string) {
    return getApiClient().delete<void>(`/api/v1/users/me/wishlist/${productId}`);
  },
};
