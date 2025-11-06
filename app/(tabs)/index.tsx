import {Animated, AppState, FlatList, Image, Text, View} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;
import CollectionsScreen from "@/screens/CollectionsScreen";
import {useContext, useEffect, useRef} from "react";
import {AuthContext} from "@/AuthContext";

export default function Index() {
    const { customer } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
        <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <Text className="text-[50px] color-primary text-center font-bold leading-[1]">Be Your Own <Text className="color-white">Quit Hero</Text></Text>
                    <Text className="text-[25px] color-primary text-center font-bold">Smoke-Free Starts Here Today!</Text>
                    {customer?.tags?.includes('ScriptACTIVE') ? (
                        <CollectionsScreen cols={["uwell", "nicopod"]} />
                    ) : (
                        <Text>Oops! Looks like you don’t have access to collections right now.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    </View>
  );
}
