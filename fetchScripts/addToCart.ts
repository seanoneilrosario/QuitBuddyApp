import { shopifyFetch } from "@/shopifyFetch";
import {ADD_TO_CART} from "@/queries/addToCart";

/**
 * Adds a variant to the cart
 * @param cartId - The ID of the cart (or create a new cart first)
 * @param variantId - The Shopify variant ID to add
 * @param quantity - Number of items
 */
export async function addToCart(cartId: string | null, variantId: string, quantity = 1) {
    try {
        const data = await shopifyFetch<any>(ADD_TO_CART, {
            cartId,
            lines: [{ quantity, merchandiseId: variantId }],
        });

        if (data.cartLinesAdd.userErrors.length > 0) {
            throw new Error(data.cartLinesAdd.userErrors.map((e: any) => e.message).join(", "));
        }

        return data.cartLinesAdd.cart;
    } catch (err) {
        console.error("Error adding to cart:", err);
        throw err;
    }
}
