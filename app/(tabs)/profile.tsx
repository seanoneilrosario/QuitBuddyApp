import {View, Text, Animated, Image, TouchableOpacity, AppState, Pressable} from "react-native";
import ScrollView = Animated.ScrollView;
import { SafeAreaView } from "react-native-safe-area-context";
import React, {useContext, useEffect, useRef, useState} from "react";
import { AuthContext } from "../../AuthContext";
import {router, useFocusEffect} from "expo-router";

const Profile = () => {
    const { customer, logout, refreshCustomer } = useContext(AuthContext);
    const orders = customer?.orders?.edges.map(e => e.node) ?? [];
    useFocusEffect(
        React.useCallback(() => {
            refreshCustomer();
        }, [])
    );

    const hasIntakeSuccess = customer?.metafields?.some(
        (mf) =>
            mf?.key === "intake_success" && mf?.value === "true"
    );
    const hasScriptActiveTag = customer?.tags?.includes("ScriptACTIVE");


    return (
        <View style={{ flex: 1 }}>
            <Image
                source={require("../../assets/images/bg_img.png")}
                className="absolute w-full h-full object-contain"
            />

            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <View style={{ flex: 1 }}>
                    <ScrollView
                        className="flex-1 p-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <Text className="text-[50px] color-primary text-center font-bold leading-[1]">
                            Profile <Text className="color-white">Page</Text>
                        </Text>

                        <View className="bg-white flex-row p-[10px] rounded-[100px] items-center mt-[30px]">
                            <Image source={require("../../assets/images/qhicon.png")} className="w-[60px] h-[60px] object-fill rounded-[100px]" />
                            <View className="ml-[10px]">
                                <Text className="color-primary block font-bold text-[18px]">
                                    {customer?.firstName} {customer?.lastName}
                                </Text>
                                {customer?.metafields
                                    ?.filter((mf) => mf != null)
                                    .filter((mf) => mf.key === "script_id")
                                    .map((mf) => (
                                    <Text key={mf.key} className="color-primary block mt-[2px]">
                                        <Text className="font-[600]">ID: </Text>
                                        <Text>{mf.value}</Text>
                                    </Text>
                                ))}
                                <Text className="color-primary block mt-[2px]">{customer?.email}</Text>
                            </View>
                        </View>


                        {!hasIntakeSuccess && !hasScriptActiveTag && (
                            <View className="flex-row mt-[30px] items-center gap-[10px] w-full">
                                <View className="bg-white p-[10px] rounded-[10px] flex-1 flex-row items-center">
                                    <View className="ml-[10px] flex-col items-start">
                                        <Text className="color-primary block font-bold text-[17px]">
                                            Start Your Consultation
                                        </Text>
                                        <Text className="color-primary block mt-[10px]">
                                            Follow 3 easy steps: complete the intake form, wait for the doctor's approval, and visit the pharmacy.
                                        </Text>
                                        <Pressable onPress={() => router.push("https://www.quithero.com.au/pages/intake-form")}>
                                            <Text className="bg-primary text-white px-3 py-2 rounded-md mt-[10px]">
                                                Apply to access the pharmacy for free
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View className="flex-row mt-[15px] items-center gap-[10px] w-full">
                            <View className="bg-white p-[10px] rounded-[10px] w-1/2 flex-1 flex-row items-center">
                                <Image source={require("../../assets/images/scriptstatus.png")} className="w-[40px] h-[40px] object-fill" />
                                <View className="ml-[10px] flex-col flex flex-1">
                                    <Text className="color-primary font-bold text-[17px] flex-1">
                                        Script Status
                                    </Text>

                                    {customer?.tags?.includes('ScriptACTIVE') ? (
                                        <Text className="color-primary mt-[2px] flex-1">Script Active</Text>
                                    ) : customer?.tags?.includes('scriptEXPIRED') ? (
                                        <Text className="color-primary mt-[2px] flex-1">Script Expired</Text>
                                    ) : hasIntakeSuccess && !hasScriptActiveTag ? (
                                        <Text className="color-primary mt-[2px] flex-1">Awaiting Doctor</Text>
                                    ) : (
                                        <Text className="color-primary mt-[2px] flex-1">Start Consultation</Text>
                                    )}
                                </View>
                            </View>
                            <View className="bg-white p-[10px] rounded-[10px] w-1/2 flex-1 flex-row items-center">
                                <Image source={require("../../assets/images/scriptexpiry.png")} className="w-[40px] h-[40px] object-fill" />
                                <View className="ml-[10px]">
                                    <Text className="color-primary block font-bold text-[17px]">
                                        Script Expiry
                                    </Text>
                                    <Text className="color-primary block mt-[2px]">
                                        {customer?.metafields
                                        ?.filter((mf) => mf != null)
                                        .filter((mf) => mf.key === "script_expiry")
                                        .map((mf) => (
                                            <Text key={mf.key}>{mf.value}</Text>
                                        ))}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex-row mt-[15px] items-center gap-[10px] w-full">
                            <View className="bg-white p-[10px] rounded-[10px] w-1/2 flex-1">
                                <View className="ml-[10px]">
                                    <View className="flex-row items-start w-full justify-between">
                                        <Text className="color-primary font-bold text-[17px]">
                                            Order History
                                        </Text>
                                        <Image source={require("../../assets/images/orders.png")} className="w-[40px] h-[40px] object-fill" />
                                    </View>
                                    <Text className="color-primary mt-[5px]">
                                        {orders.map(order => (
                                            <View key={order.id} className="pb-[15px] block">
                                                <Text className="color-primary font-bold">{order.name}</Text>
                                                <View className="pl-[10px]">
                                                    <Text className="color-primary">
                                                        <Text className="font-[600]">Date:</Text> {new Date(order.processedAt).toDateString()}
                                                    </Text>
                                                    <Text className="color-primary">
                                                        <Text className="font-[600]">Total:</Text> {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                                    </Text>
                                                    <Text className="color-primary">
                                                        <Text className="font-[600]">Status:</Text> {order.fulfillmentStatus}
                                                    </Text>
                                                    <Text className="color-primary font-[600]">Items:</Text>
                                                    {order.lineItems.edges.map((item) => (
                                                        <Text className="color-primary pl-[10px]" key={item.node.title}>
                                                            {item.node.quantity} × {item.node.title}
                                                        </Text>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={logout}
                            className="mt-10 bg-primary py-4 px-6 rounded-[100px]"
                        >
                            <Text className="text-center text-white font-semibold text-lg">
                                Logout
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Profile;
