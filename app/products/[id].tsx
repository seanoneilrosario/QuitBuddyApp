import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {shopifyFetch} from "@/shopifyFetch";
import {GET_PRODUCT_BY_HANDLE} from "@/queries/getProduct";


const productDetails = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {id} = useLocalSearchParams();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [product, setProduct] = useState<any>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const data = await shopifyFetch(GET_PRODUCT_BY_HANDLE, { handle: id });
                // @ts-ignore
                setProduct(data?.product);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1 }}>
                <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" />
                        <Text className="mt-2 text-gray-600">Loading product...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={{ flex: 1 }}>
                <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-600">Product not found.</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
                <SafeAreaView style={{ flex: 1 }}>
                    <Stack.Screen options={{ headerShown: false }} />

                    <ScrollView className="flex-1 p-4">
                        {/* Custom back button */}
                        <View className="flex-row items-center mb-4">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="p-2 mr-2 rounded-full bg-gray-100"
                            >
                                <Ionicons name="arrow-back" size={22} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Product image */}
                        {product.featuredImage?.url && (
                            <Image
                                source={{ uri: product.featuredImage. url }}
                                className="w-full h-64 rounded-lg mb-4"
                                resizeMode="contain"
                            />
                        )}

                        {/* Product info */}
                        <Text className="text-2xl font-bold mb-2">{product.title}</Text>
                        <Text className="text-gray-500 mb-4">
                            ₱{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                            {product.priceRange.minVariantPrice.currencyCode}
                        </Text>
                        <Text className="text-gray-700 mb-6">{product.description}</Text>

                        {/* Product tags */}
                        <View className="flex-row flex-wrap mb-4">
                            {product.tags?.map((tag: string) => (
                                <Text
                                    key={tag}
                                    className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full mr-2 mb-2"
                                >
                                    {tag}
                                </Text>
                            ))}
                        </View>

                        {/* Example: Product strength metafield */}
                        {product.metafields?.edges
                            ?.map((edge: any) => edge.node)
                            ?.filter((mf: any) => mf && mf.key === "product_strength2")
                            ?.map((mf: any) => {
                                let values: string[] = [];
                                try {
                                    values = JSON.parse(mf.value);
                                } catch {
                                    values = [mf.value];
                                }
                                return (
                                    <View key={mf.key} className="flex-row flex-wrap mb-4">
                                        {values.map((v, i) => (
                                            <Text
                                                key={`${mf.key}-${i}`}
                                                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full mr-2 mb-2"
                                            >
                                                {v}
                                            </Text>
                                        ))}
                                    </View>
                                );
                            })}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    );
}

export default productDetails;
