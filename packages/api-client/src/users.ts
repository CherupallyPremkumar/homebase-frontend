import type { User, Address, SearchRequest, SearchResponse, StateEntityServiceResponse, WishlistItem } from '@homebase/types';
import { getApiClient } from './client';

export const usersApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<User>>('/user/users', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<User>>('/user/user', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('User not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<User>;
  },
  create(entity: Partial<User>) {
    return getApiClient().post<StateEntityServiceResponse<User>>('/user', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<User>>('/user/' + id + '/' + eventId, payload ?? {});
  },

  // Profile (convenience — uses current user's ID from JWT)
  getProfile() {
    return getApiClient().get<StateEntityServiceResponse<User>>('/user/me');
  },
  updateProfile(payload: Partial<User>) {
    return getApiClient().put<StateEntityServiceResponse<User>>('/user/me', payload);
  },

  // Addresses
  getAddresses() {
    return getApiClient().get<Address[]>('/user/me/addresses');
  },
  addAddress(address: Omit<Address, 'id'>) {
    return getApiClient().post<Address>('/user/me/addresses', address);
  },
  updateAddress(addressId: string, address: Partial<Address>) {
    return getApiClient().put<Address>('/user/me/addresses/' + addressId, address);
  },
  deleteAddress(addressId: string) {
    return getApiClient().delete<void>('/user/me/addresses/' + addressId);
  },

  // Wishlist
  getWishlist() {
    return getApiClient().get<WishlistItem[]>('/user/me/wishlist');
  },
  addToWishlist(productId: string) {
    return getApiClient().post<WishlistItem>('/user/me/wishlist', { productId });
  },
  removeFromWishlist(productId: string) {
    return getApiClient().delete<void>('/user/me/wishlist/' + productId);
  },
};
