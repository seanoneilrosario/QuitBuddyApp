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
    }
  }
`;