import type { User, Address, SearchRequest, SearchResponse, StateEntityServiceResponse, WishlistItem } from '@homebase/types';
import { getApiClient } from './client';

export const usersApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<User>>('/user/users', params);
  },

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

  async getProfile() {
    const response = await getApiClient().post<SearchResponse<User>>('/storefront/my-profile', {});
    const item = response.list?.[0];
    if (!item) throw new Error('Profile not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: [] } as StateEntityServiceResponse<User>;
  },
  updateProfile(payload: Partial<User>) {
    return getApiClient().put<StateEntityServiceResponse<User>>('/user/me', payload);
  },

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

  async getWishlist() {
    const response = await getApiClient().post<SearchResponse<WishlistItem>>('/storefront/my-wishlist', {});
    return response.list?.map((item) => item.row) ?? [];
  },
  addToWishlist(productId: string) {
    return getApiClient().post<WishlistItem>('/user/me/wishlist', { productId });
  },
  removeFromWishlist(productId: string) {
    return getApiClient().delete<void>('/user/me/wishlist/' + productId);
  },
};
