import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {getCustomer} from "@/fetchScripts/getCustomer";

// ✅ Define the shape of the customer from Shopify
type Metafield = {
    namespace: string;
    key: string;
    value: string;
    type: string;
};

type OrderLineItem = {
    title: string;
    quantity: number;
    discountedTotalPrice: {
        amount: string;
        currencyCode: string;
    };
};

type Order = {
    id: string;
    name: string;
    processedAt: string;
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    fulfillmentStatus: string;
    financialStatus: string;
    lineItems: {
        edges: { node: OrderLineItem }[];
    };
};

type CustomerType = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    tags: string[];
    metafields: Metafield[] | null;
    orders?: {
        edges: { node: Order }[];
    } | null;
} | null;

type AuthContextType = {
    token: string | null;
    customer: CustomerType; // ✅ Already includes metafields & orders
    setToken: (t: string | null) => void;
    setCustomer: (c: CustomerType) => void;
    loading: boolean;
    logout: () => Promise<void>;
    refreshCustomer: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    customer: null,
    setToken: () => {},
    setCustomer: () => {},
    loading: true,
    logout: async () => {},
    refreshCustomer: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [customer, setCustomer] = useState<CustomerType>(null);
    const [loading, setLoading] = useState(true);
    const refreshCustomer = async () => {
        if (!token) return;

        try {
            const freshCustomer = await getCustomer(token);
            setCustomer(freshCustomer);
            await SecureStore.setItemAsync("customer_data", JSON.stringify(freshCustomer));
        } catch (error) {
            console.log("Failed to refresh customer", error);
        }
    };

    useEffect(() => {
        const loadAuth = async () => {
            const savedToken = await SecureStore.getItemAsync("customer_token");
            const savedCustomer = await SecureStore.getItemAsync("customer_data");

            if (savedToken) {
                setToken(savedToken);

                try {
                    // ✅ refresh customer from Shopify in case tags updated
                    const freshCustomer = await getCustomer(savedToken);
                    setCustomer(freshCustomer);
                    await SecureStore.setItemAsync("customer_data", JSON.stringify(freshCustomer));
                } catch (err) {
                    console.log("Customer fetch failed, logging out...");
                    await SecureStore.deleteItemAsync("customer_token");
                    await SecureStore.deleteItemAsync("customer_data");
                    setToken(null);
                    setCustomer(null);
                }
            } else if (savedCustomer) {
                // ✅ fallback (app offline)
                setCustomer(JSON.parse(savedCustomer));
            }

            setLoading(false);
        };

        loadAuth();
    }, []);

    const logout = async () => {
        await SecureStore.deleteItemAsync("customer_token"); // ✅ match login saved key
        setToken(null);
        setCustomer(null); // ✅ clear customer object
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                customer,
                setToken,
                setCustomer,
                loading,
                logout,
                refreshCustomer
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
