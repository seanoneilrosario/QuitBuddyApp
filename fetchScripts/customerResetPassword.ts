import {CUSTOMER_PASSWORD_RESET} from "@/queries/resetPassword";
import {shopifyFetch} from "@/shopifyFetch";

export async function resetPassword(email: string) {
    console.log("📨 Sending reset request for:", email);

    const response = await shopifyFetch<any>(CUSTOMER_PASSWORD_RESET, { email });

    console.log("📬 Shopify response:", response);

    const errors = response.customerRecover?.customerUserErrors;

    if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
    }

    return true;
}
