import { shopifyFetch } from "@/shopifyFetch";
import {CREATE_CART} from "@/queries/createCart";

export async function createCart() {
    try {
        const data = await shopifyFetch<any>(CREATE_CART, {});
        if (data.cartCreate.userErrors.length > 0) {
            throw new Error(data.cartCreate.userErrors.map((e: any) => e.message).join(", "));
        }
        return data.cartCreate.cart.id;
    } catch (err) {
        console.error("Error creating cart:", err);
        throw err;
    }
}
