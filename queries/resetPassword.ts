export const CUSTOMER_PASSWORD_RESET = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          message
        }
      }
    }
  `;