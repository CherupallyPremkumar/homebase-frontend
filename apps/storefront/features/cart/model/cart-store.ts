// Re-export the cart store from the shared package.
// When cart-specific state beyond what shared provides is needed,
// create a separate store here that composes with the shared one.
export { useCartStore } from '@homebase/shared';
