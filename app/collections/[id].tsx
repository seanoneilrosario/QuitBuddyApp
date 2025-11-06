import {router, Stack, useLocalSearchParams} from "expo-router";
import React, { useEffect, useState } from "react";
import {View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Pressable} from "react-native";
import {shopifyFetch} from "@/shopifyFetch";
import {GET_COLLECTIONS} from "@/queries/getCollections";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";

const CollectionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [collection, setCollection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchCollection = async () => {
            try {
                const data = await shopifyFetch<{ collection: any }>(GET_COLLECTIONS, {
                    handle: id,
                });
                setCollection(data.collection);
            } catch (err: any) {
                console.error("Error fetching collection:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                    <View className="flex-row items-center mb-[10px]">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-gray-100"
                        >
                            <Ionicons name="arrow-back" size={20} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center">
                        <Stack.Screen options={{ headerShown: false }} />
                        <ActivityIndicator size="large" color="#888" />
                        <Text className="mt-3 text-gray-500">Loading collection...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                    <View className="flex-row items-center mb-[10px]">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-gray-100"
                        >
                            <Ionicons name="arrow-back" size={20} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center p-4">
                        <Stack.Screen options={{ headerShown: false }} />
                        <Text className="text-red-500 text-center">{error}</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (!collection) {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                    <View className="flex-row items-center mb-[10px]">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-gray-100"
                        >
                            <Ionicons name="arrow-back" size={20} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1 justify-center items-center p-4">
                        <Stack.Screen options={{ headerShown: false }} />
                        <Text className="text-gray-500 text-center">No collection found.</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView className="flex-1 p-4">
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-row items-center mb-[10px]">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-gray-100"
                        >
                            <Ionicons name="arrow-back" size={20} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-primary mt-[10px] mb-[25px] text-[25px] text-center font-bold uppercase">
                        {collection.title}
                    </Text>

                    <View className="flex-row flex-wrap gap-[10px] items-stretch justify-center">
                        {collection.products.edges.map(({ node }: any) => (
                            <View
                                key={node.id}
                                className="bg-white rounded-xl shadow p-3 mb-4 flex-[0.5] max-w-[48%] w-[48%] basis-[48%] "
                            >
                                <Pressable className="relative flex-col" onPress={() => router.push(`../products/${node.handle}`)}>
                                    <View className="absolute z-10">
                                        {node?.metafields
                                            ?.filter((mf: null) => mf != null)
                                            .filter((mf: { key: string; }) => mf.key === "product_strength2")
                                            ?.map((mf: any) => {
                                                let values: string[] = [];

                                                try {
                                                    values = JSON.parse(mf.value); // ✅ parse JSON list
                                                } catch {
                                                    values = [mf.value]; // fallback if single value
                                                }

                                                return (
                                                    <View key={mf.key} className="flex-col items-start mt-[2px] ml-[2px]">
                                                        {values.map((v, i) => (
                                                            <Text
                                                                key={`${mf.key}-${i}`}
                                                                className="text-[10px] bg-gray-200 color-primary px-2 py-1 rounded-full mr-2 mb-2"
                                                            >
                                                                {v}
                                                            </Text>
                                                        ))}
                                                    </View>
                                                );
                                            })}
                                    </View>

                                    {node.featuredImage?.url && (
                                        <Image
                                            source={{ uri: node.featuredImage.url }}
                                            resizeMode="contain"
                                            className="w-full h-[120px] rounded-lg mb-2"
                                        />
                                    )}
                                    <Text className="font-bold text-[16px] mb-1 color-primary">{node.title}</Text>
                                    <Text className="color-primary text-sm mb-1 font-[600] flex-1 mt-auto">
                                        ₱{parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                                        {node.priceRange.minVariantPrice.currencyCode}
                                    </Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default CollectionDetails;
