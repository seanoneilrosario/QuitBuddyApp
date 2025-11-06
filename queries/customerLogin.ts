// queries/shopifyQueries.js
// GraphQL queries for Shopify Login

export const CUSTOMER_LOGIN = `
mutation customerAccessTokenCreate($email: String!, $password: String!) {
  customerAccessTokenCreate(input: { email: $email, password: $password }) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

export const CUSTOMER_INFO_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      tags
      
      metafields(identifiers: [
        { namespace: "custom", key: "script_id" }
        { namespace: "customer", key: "script_expiry" }
        { namespace: "customer", key: "intake_success" }
      ]) {
        namespace
        key
        value
        type
      }
      
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            totalPrice {
              amount
              currencyCode
            }
            fulfillmentStatus
            financialStatus
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
