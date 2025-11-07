import {Animated, AppState, FlatList, Image, Pressable, Text, View} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;
import CollectionsScreen from "@/screens/CollectionsScreen";
import React, {useContext, useEffect, useRef} from "react";
import {AuthContext} from "@/AuthContext";
import {router} from "expo-router";

export default function Index() {
    const { customer } = useContext(AuthContext);
    const hasIntakeSuccess = customer?.metafields?.some(
        (mf) =>
            mf?.key === "intake_success" && mf?.value === "true"
    );
    const hasScriptActiveTag = customer?.tags?.includes("ScriptACTIVE");

  return (
    <View style={{ flex: 1 }}>
        <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full" />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={true}>
                <Text className="text-[50px] color-primary text-center font-bold leading-[1]">Be Your Own <Text className="color-white">Quit Hero</Text></Text>
                <Text className="text-[25px] color-primary text-center font-bold">Smoke-Free Starts Here Today!</Text>
                {customer?.tags?.includes('ScriptACTIVE') ? (
                    <CollectionsScreen title={"Shop by Collection"} cols={["vape-devices", "coils-pods", "e-liquids", "nicotine-pg-only", "accessories", "nicotine-replacement-therapy", "starter-packs", "new-arrivals"]}  />
                ) :  hasIntakeSuccess && !hasScriptActiveTag ? (
                    <View className="flex-col items-start justify-center">
                        <Text className="color-primary block mt-[40px] text-[20px] text-center">
                            Oops! Looks like you don’t have access to collections right now.
                        </Text>
                        <Text className="color-primary bg-white rounded-[5px] py-[5px] px-[10px] block mt-[10px] text-[20px] text-center mx-auto">
                            Under review by doctor
                        </Text>
                    </View>
                ) : (
                    <View className="flex-col items-start justify-center">
                        <Text className="color-primary block mt-[40px] text-[20px] text-center">
                            Oops! Looks like you don’t have access to collections right now.
                        </Text>
                        <Pressable className="mx-auto" onPress={() => router.push("/profile")}>
                            <Text className="color-primary bg-white rounded-[5px] py-[5px] px-[10px] block mt-[10px] text-[20px] text-center mx-auto">
                                Start Consultation
                            </Text>
                        </Pressable>
                    </View>
                )}

                {customer?.tags?.includes('ScriptACTIVE') && (
                        <CollectionsScreen title={"Shop by Brands"} cols={["nicopod", "nicopodxuwell", "4steps", "airscream", "alt", "big-5-juice-co", "britannia", "chosen", "geekvape", "hohmtech", "lula", "mixology", "phix", "rebel-x-bogan", "relx", "rift", "simply", "uwell", "vapo", "vapure", "ve-premium", "wild-by-instinct", "yeti"]}  />
                    )
                }
            </ScrollView>
        </SafeAreaView>
    </View>
  );
}
