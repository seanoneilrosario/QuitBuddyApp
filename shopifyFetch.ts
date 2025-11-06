const SHOPIFY_DOMAIN = "vape-scripts.myshopify.com";
const STOREFRONT_API_TOKEN = "7ed9642436072ba0a30fc3a686925434";

export async function shopifyFetch<T>(query: string, variables: object = {}): Promise<T> {
    const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_API_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
        console.error("Shopify GraphQL Error:", json.errors);
        throw new Error(json.errors[0].message);
    }

    return json.data;
}