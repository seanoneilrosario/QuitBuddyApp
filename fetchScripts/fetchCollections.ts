// fetchCollections.ts
import { shopifyFetch } from "@/shopifyFetch";
import { GET_COLLECTIONS } from "@/queries/getCollections";
import { Image } from "react-native";

export async function fetchCollectionsByHandles(handles: string[]) {
    try {
        const results: any[] = [];

        for (const handle of handles) {
            const data = await shopifyFetch<any>(GET_COLLECTIONS, { handle, first: 1 }); // first:1 is enough to satisfy Shopify
            const col = data.collection;
            if (col) {
                // Prefetch collection image
                if (col.image?.src) Image.prefetch(col.image.src);
                results.push(col);
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching collections by handles:", error);
        return [];
    }
}
