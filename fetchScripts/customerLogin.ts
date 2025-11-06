import * as SecureStore from "expo-secure-store";
import { CUSTOMER_LOGIN } from "@/queries/customerLogin";
import { shopifyFetch } from "@/shopifyFetch";
import { getCustomer } from "./getCustomer";

export async function login(email: string, password: string) {
    const data = await shopifyFetch(CUSTOMER_LOGIN, { email, password });

    // @ts-ignore
    const token = data.customerAccessTokenCreate.customerAccessToken?.accessToken;

    if (!token) {
        throw new Error("Email or password is incorrect");
    }

    // ✅ Save token
    await SecureStore.setItemAsync("customer_token", token);

    // ✅ Get customer info (tags, name, email)
    const customer = await getCustomer(token);

    // ✅ Save customer in SecureStore too
    await SecureStore.setItemAsync("customer_data", JSON.stringify(customer));

    return {
        token,
        customer,
    };
}
