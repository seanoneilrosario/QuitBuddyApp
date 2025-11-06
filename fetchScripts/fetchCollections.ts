import {shopifyFetch} from "@/shopifyFetch";
import {GET_COLLECTIONS} from "@/queries/getCollections";

export async function fetchCollectionsByHandles(handles: string[]) {
    try {
        const results = [];

        for (const handle of handles) {
            const data = await shopifyFetch<any>(GET_COLLECTIONS, { handle });

            if (data?.collection) {
                results.push(data.collection);
            }
        }

        return results;
    } catch (error) {
        console.error("Error fetching collections by handles:", error);
        return [];
    }
}