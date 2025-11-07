import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { fetchCollectionsByHandles } from "@/fetchScripts/fetchCollections";
import { router } from "expo-router";

type Props = {
    cols: string[];
    title: string;
};

export default function CollectionsScreen({ cols, title }: Props) {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const result = await fetchCollectionsByHandles(cols);
            setCollections(result);
            setLoading(false);
        };
        load();
    }, [cols]);

    return (
        <View className="flex-1">
            {loading ? (
                <Text className="text-center mt-10 text-base">Loading collections...</Text>
            ) : (
                <View>
                    <Text className="text-primary mt-[35px] mb-5 text-[25px] text-center font-bold uppercase">
                        {title}
                    </Text>

                    <View className="flex-row flex-wrap gap-[10px] items-stretch justify-center">
                        {collections.map((col) => (
                            <View
                                key={col.id}
                                className="mb-[18px] bg-white p-3 rounded-lg shadow flex-[0.5] max-w-[48%] w-[48%] basis-[48%]"
                            >
                                <Pressable onPress={() => router.push(`../collections/${col.handle}`)}>
                                    {col.image && (
                                        <Image
                                            source={{ uri: col.image.src }}
                                            className="w-full h-[100px] rounded-lg mb-[10px]"
                                            resizeMode="contain"
                                        />
                                    )}
                                    <Text className="uppercase text-[18px] font-bold text-center color-primary">{col.title}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
}
