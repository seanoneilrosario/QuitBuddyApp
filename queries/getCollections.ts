export const GET_COLLECTIONS = `
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      image {
        src
        altText
      }
      products(first: 250) {   # adjust limit as needed
        edges {
          node {
            id
            title
            handle
            tags
            description
            metafields(identifiers: [
                { namespace: "custom", key: "product_strength2" }
              ]) {
                namespace
                key
                value
              }
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;