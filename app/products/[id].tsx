import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { shopifyFetch } from "@/shopifyFetch";
import { GET_PRODUCT_BY_HANDLE } from "@/queries/getProduct";
import { prefetchImages } from "@/app/utils/prefetchImages";
import {createCart} from "@/fetchScripts/createCart";
import {addToCart} from "@/fetchScripts/addToCart";
import ProductDescriptionAccordion from "@/screens/ProductDescriptionAccordion";

const ProductDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [cartId, setCartId] = useState<string | null>(null);

    const handleAddToCart = async () => {
        try {
            let currentCartId = cartId;

            if (!currentCartId) {
                currentCartId = await createCart();
                setCartId(currentCartId);
            }

            const updatedCart = await addToCart(currentCartId, selectedVariant.id, quantity);
            console.log("Added to cart:", updatedCart);
            alert(`Added ${quantity} item(s) to cart!`);
        } catch (err: any) {
            console.error(err);
            alert("Failed to add to cart: " + err.message);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const data = await shopifyFetch<{ product: any }>(GET_PRODUCT_BY_HANDLE, { handle: id });
                const prod = data.product;

                // Default to first variant
                const firstVariant = prod.variants.edges[0]?.node;
                setSelectedVariant(firstVariant);
                setProduct(prod);
                setLoading(false);

                // Prefetch all images asynchronously after initial render
                const urls: string[] = [];
                if (prod.featuredImage?.url) urls.push(prod.featuredImage.url);
                prod.variants.edges.forEach((v: any) => {
                    if (v.node.image?.url) urls.push(v.node.image.url);
                });
                prefetchImages(urls);
            } catch (err) {
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading || !product) {
        return (
            <View className="flex-1">
                <Image
                    source={require("../../assets/images/bg_img.png")}
                    className="absolute w-full h-full"
                    resizeMode="cover"
                />
                <SafeAreaView className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#888" />
                    <Text className="mt-2 text-gray-500">Loading product...</Text>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <Image
                source={require("../../assets/images/bg_img.png")}
                className="absolute w-full h-full z-[-1]"
                resizeMode="cover"
            />
            <SafeAreaView className="flex-1">
                {/* Back button */}
                <View className="relative flex-row items-center py-[30px] mt-[10px] justify-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute right-4 top-[10px] p-2 rounded-full bg-gray-100"
                    >
                        <Ionicons name="close" size={22} color="#2c2f6a" />
                    </TouchableOpacity>
                </View>
                <ScrollView className="p-4 flex-1">
                    {/* Product Image */}
                    <Image
                        source={{ uri: selectedVariant?.image?.url || product.featuredImage?.url }}
                        className="w-full h-[300px] mb-4"
                        resizeMode="contain"
                    />

                    {/* Product info */}
                    <Text className="text-3xl font-bold mb-2 color-primary">{product.title}</Text>
                    <Text className="text-primary mb-4">
                        ₱{parseFloat(selectedVariant?.priceV2?.amount || product.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                        {selectedVariant?.priceV2?.currencyCode || product.priceRange.minVariantPrice.currencyCode}
                    </Text>
                    <ProductDescriptionAccordion htmlDescription={product.descriptionHtml} />
                    {/*<Text className="text-black mb-4">{product.descriptionHtml}</Text>*/}

                    {/* Variant Selector */}
                    <View className="mb-4 flex-col gap-[5px]">
                        {product.variants.edges.filter(({ node }: any) => node.title !== "Default Title")
                            .map(({ node }: any) => (
                                <Pressable
                                    key={node.id}
                                    onPress={() => setSelectedVariant(node)}
                                    className={`px-3 py-1 mr-2 rounded-full border ${
                                        selectedVariant?.id === node.id
                                            ? "border-transparent bg-[#34b9fd]"
                                            : "bg-gray-100 border-transparent"
                                    }`}
                                >
                                    <Text className="text-sm color-inherit">{node.title}</Text>
                                </Pressable>
                        ))}
                    </View>

                    {/* Add to Cart Button */}
                    <View className="flex-row items-center mb-6 w-full">
                        <TouchableOpacity
                            onPress={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                            className="px-4 py-2 bg-primary rounded-l"
                        >
                            <Text className="text-lg font-bold text-center color-white">-</Text>
                        </TouchableOpacity>

                        <View className="px-6 py-2 bg-gray-100 flex-1">
                            <Text className="text-lg font-bold text-center ">{quantity}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setQuantity(prev => prev + 1)}
                            className="px-4 py-2 bg-primary rounded-r"
                        >
                            <Text className="text-lg font-bold text-center color-white">+</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        className="bg-primary py-4 rounded-lg mb-10 items-center"
                        onPress={handleAddToCart}
                    >
                        <Text className="text-white font-bold text-[16px]">Add to Cart</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default ProductDetails;
