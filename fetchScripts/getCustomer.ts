import { shopifyFetch } from "@/shopifyFetch";
import {CUSTOMER_INFO_QUERY} from "@/queries/customerLogin";

export async function getCustomer(token: string) {
    const data = await shopifyFetch(CUSTOMER_INFO_QUERY, {
        customerAccessToken: token,
    });

    // @ts-ignore
    return data.customer;
}


