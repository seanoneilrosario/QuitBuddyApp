import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { shopifyFetch } from "@/shopifyFetch";
import { GET_COLLECTIONS } from "@/queries/getCollections";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const PAGE_SIZE = 10;

const CollectionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [collection, setCollection] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [endCursor, setEndCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (after: string | null = null) => {
        try {
            const data = await shopifyFetch<{ collection: any }>(GET_COLLECTIONS, {
                handle: id,
                first: PAGE_SIZE,
                after,
            });
            const coll = data.collection;
            if (!collection) setCollection(coll);

            const newProducts = coll.products.edges.map(({ node }: any) => {
                // Safe metafield parsing
                node.metafieldsParsed = node.metafields
                    ?.filter((mf: any) => mf?.value)
                    .map((mf: any) => {
                        try {
                            mf.value = JSON.parse(mf.value);
                        } catch {
                            mf.value = [mf.value];
                        }
                        return mf;
                    }) || [];

                // Prefetch featured image for visible items
                if (node.featuredImage?.url) Image.prefetch(node.featuredImage.url);

                return node;
            });

            setProducts((prev) => [...prev, ...newProducts]);
            setEndCursor(coll.products.pageInfo.endCursor);
            setHasNextPage(coll.products.pageInfo.hasNextPage);
        } catch (err: any) {
            console.error("Error fetching collection products:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (id) fetchProducts();
    }, [id]);

    const loadMore = () => {
        if (hasNextPage && !loadingMore) {
            setLoadingMore(true);
            fetchProducts(endCursor);
        }
    };

    return (
        <View className="flex-1">
            <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                <View className="flex-row items-center p-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-gray-100">
                        <Ionicons name="arrow-back" size={22} color="#2c2f6a" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold ml-4 color-primary">{collection?.title || "Collection"}</Text>
                </View>

                {loading && <ActivityIndicator size="large" color="#888" className="mt-10" />}

                {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}

                <ScrollView
                    className="p-4"
                    onScroll={({ nativeEvent }) => {
                        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) loadMore();
                    }}
                    scrollEventThrottle={200}
                >
                    <View className="flex-row flex-wrap gap-3 justify-center">
                        {products.map((node: any, idx: number) => (
                            <Pressable
                                key={`${node.id}-${idx}`}
                                className="bg-white p-3 rounded-xl shadow w-[48%] mb-4"
                                onPress={() => router.push(`../products/${node.handle}`)}
                            >
                                <View className="absolute z-10 mt-[10px] ml-[10px]">
                                    {node.metafieldsParsed?.map((mf: any) => (
                                        <View key={mf.key} className="flex-col items-start mt-[2px] ml-[2px]">
                                            {mf.value.map((v: string, i: number) => (
                                                <Text
                                                    key={`${mf.key}-${i}`}
                                                    className="text-[10px] bg-gray-200 color-primary px-2 py-1 rounded-full mr-2 mb-2"
                                                >
                                                    {v}
                                                </Text>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                                {node.featuredImage?.url && (
                                    <Image
                                        source={{ uri: node.featuredImage.url }}
                                        className="w-full h-40 rounded-lg mb-2"
                                        resizeMode="contain"
                                    />
                                )}
                                <Text className="font-bold mb-1 color-primary uppercase">{node.title}</Text>
                                <Text className="text-sm font-semibold color-primary">
                                    ₱{parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)} {node.priceRange.minVariantPrice.currencyCode}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {loadingMore && <ActivityIndicator size="small" color="#888" className="mt-4" />}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default CollectionDetails;
