import React, { useEffect, useState } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { shopifyFetch } from "@/shopifyFetch";
import { GET_PRODUCT_BY_HANDLE } from "@/queries/getProduct";
import { prefetchImages } from "@/app/utils/prefetchImages";

const ProductDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const data = await shopifyFetch<{ product: any }>(GET_PRODUCT_BY_HANDLE, { handle: id });
                const prod = data.product;
                setProduct(prod);

                // Prefetch all images: featured + variants
                const urls: string[] = [];
                if (prod.featuredImage?.url) urls.push(prod.featuredImage.url);
                prod.variants.edges.forEach((v: any) => {
                    if (v.node.image?.url) urls.push(v.node.image.url);
                });
                prefetchImages(urls);

                // Default to first variant
                if (prod.variants.edges.length > 0) setSelectedVariant(prod.variants.edges[0].node);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <View className="flex-1">
                <Image
                    source={require("../../assets/images/bg_img.png")}
                    className="absolute w-full h-full"
                    resizeMode="cover"
                />
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#888" />
                    <Text className="mt-2 text-gray-500">Loading product...</Text>
                </SafeAreaView>
            </View>
        );

    return (
        <View className="flex-1">
            <Image
                source={require("../../assets/images/bg_img.png")}
                className="absolute w-full h-full z-[-1]"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1">
                <ScrollView className="p-4 flex-1">
                    <Stack.Screen options={{ headerShown: false }} />

                    {/* Back button */}
                    <View className="flex-row items-center mb-[10px]">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-gray-100"
                        >
                            <Ionicons name="arrow-back" size={22} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Product Image */}
                    <Image
                        source={{ uri: selectedVariant?.image?.url || product.featuredImage?.url }}
                        className="w-full h-96 rounded-lg mb-4"
                        resizeMode="contain"
                    />

                    {/* Product info */}
                    <Text className="text-2xl font-bold mb-2">{product.title}</Text>
                    <Text className="text-gray-500 mb-4">
                        ₱{parseFloat(selectedVariant?.priceV2?.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                        {selectedVariant?.priceV2?.currencyCode || product.priceRange.minVariantPrice.currencyCode}
                    </Text>
                    <Text className="text-gray-700 mb-4">{product.description}</Text>

                    {/* Variant Selector */}
                    <View className="mb-4 flex-col gap-[5px]">
                        {product.variants.edges.map(({ node }: any) => (
                            <Pressable
                                key={node.id}
                                onPress={() => setSelectedVariant(node)}
                                className={`px-3 py-1 mr-2 rounded-full border ${
                                    selectedVariant?.id === node.id ? "border-transparent bg-[#34b9fd]" : "bg-gray-100 border-transparent"
                                }`}
                            >
                                <Text className="text-sm color-inherit">{node.title}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Add to Cart Button */}
                    <TouchableOpacity
                        className="bg-primary py-3 rounded-lg mb-4 items-center"
                        onPress={() => console.log("Add to cart variant:", selectedVariant?.id)}
                    >
                        <Text className="text-white font-bold">Add to Cart</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProductDetails;