export const GET_COLLECTIONS = `
  query GetCollection($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        image { src altText }
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              tags
              description
              metafields(identifiers: [{ namespace: "custom", key: "product_strength2" }]) {
                namespace
                key
                value
              }
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }`;