import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {fetchCollectionsByHandles} from "@/fetchScripts/fetchCollections";

type Props = {
    cols: string[];
};

const { width } = Dimensions.get("window");

export default function CollectionsScreen({ cols }: Props) {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const result = await fetchCollectionsByHandles(cols);
            setCollections(result);
            setLoading(false);
        };
        load();
    }, [cols]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loading}>Loading collections...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                showPagination
                data={collections}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.image && (
                            <Image
                                source={{ uri: item.image.src }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        )}
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.handle}>/{item.handle}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loading: { fontSize: 18 },
    card: {
        width: width,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width * 0.85,
        height: 200,
        borderRadius: 10,
        marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: "bold" },
    handle: { fontSize: 14, color: "#777" },
});
