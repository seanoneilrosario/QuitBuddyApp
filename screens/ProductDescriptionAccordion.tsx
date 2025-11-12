import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    useWindowDimensions, Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { router } from "expo-router";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
    htmlDescription: string;
}

interface Section {
    title: string;
    content: string;
}

const decodeHtmlEntities = (text: string) => {
    return text.replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

const ProductDescriptionAccordion: React.FC<Props> = ({ htmlDescription }) => {
    const [sections, setSections] = useState<Section[]>([]);
    const [expandedIndex, setExpandedIndex] = useState(0); // first section open
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (!htmlDescription) return;

        // Remove <span> tags inside <h3>
        const cleanedHtml = htmlDescription.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1").replace(/<strong[^>]*>(.*?)<\/strong>/gi, "$1");

        // Split HTML by <h3> tags into sections
        const parts = cleanedHtml.split(/<h3[^>]*>/i).filter(Boolean);
        const parsedSections: Section[] = [];

        parts.forEach((part) => {
            const match = part.match(/<\/h3>([\s\S]*)/i);
            if (match) {
                const title = decodeHtmlEntities(part.split("</h3>")[0].trim());
                const content = match[1]?.trim() || "";
                parsedSections.push({ title, content });
            }
        });

        setSections(parsedSections);
    }, [htmlDescription]);

    const toggleSection = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? -1 : index);
    };

    return (
        <View className="mt-6">
            {sections.map((section, index) => (
                <View key={index} className="mb-[10px] border-b border-primary pb-[10px]">
                    {/* Accordion Header */}
                    <TouchableOpacity
                        onPress={() => toggleSection(index)}
                        className="flex-row justify-between items-center py-2"
                        activeOpacity={1}
                    >
                        <Text className="text-[20px] font-semibold" style={{ color: '#2c2f6a', fontWeight: expandedIndex === index ? '700' : '600' }}>
                            {section.title}
                        </Text>
                        <Ionicons
                            name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#2c2f6a"
                        />
                    </TouchableOpacity>

                    {/* Accordion Content */}
                    {expandedIndex === index && (
                        <View className="mt-[5px] mb-[10px]">
                            <RenderHTML
                                source={{ html: section.content }}
                                contentWidth={width}
                                ignoredDomTags={['meta']}
                                tagsStyles={{
                                    p: { color: "#2c2f6a", fontSize: 15, lineHeight: 22 },
                                    li: { color: "#2c2f6a", fontSize: 15, lineHeight: 22 },
                                    span: { fontSize: 15, color: "#2c2f6a" },
                                    a: { color: "#2c2f6a", fontSize: 15, textDecorationLine: "underline" },
                                    h3: { color: "#2c2f6a", fontSize: 17, fontWeight: "bold" },
                                    strong: { color: "#2c2f6a", fontSize: 17, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
                                }}
                                renderers={{
                                    a: ({ tnode } : any) => {
                                        const href: string = tnode.attributes?.href ?? "";
                                        const text: string = tnode.data || href;
                                        let newHref: any = href;

                                        if (href.includes("/collections")) {
                                            const match = href.match(/\/collections\/[^/?]+/);
                                            if (match) newHref = match[0];
                                        }

                                        return (
                                            <Text
                                                style={{ color: "#2c2f6a", textDecorationLine: "underline", fontSize: 15 }}
                                                onPress={() => router.push(newHref)}
                                            >
                                                {text}
                                            </Text>
                                        );
                                    },
                                }}
                            />
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default ProductDescriptionAccordion;
