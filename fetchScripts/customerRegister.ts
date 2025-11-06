import {shopifyFetch} from "@/shopifyFetch";
import {CUSTOMER_REGISTER} from "@/queries/customerRegister";

export async function customerRegister(
    email: string,
    password: string,
    firstName: string,
    lastName: string
) {
    const mutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;

    const variables = {
        input: { email, password, firstName, lastName }
    };

    const res: any = await shopifyFetch(mutation, variables);

    const errors = res?.customerCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
    }

    return res.customerCreate.customer;
}
