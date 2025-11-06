import React, { useState } from "react";
import {View, TextInput, Button, Text, Animated, ImageBackground, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {resetPassword} from "@/fetchScripts/customerResetPassword";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const fadeAnim = new Animated.Value(0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const showAlert = (msg: string, isError = false) => {
        if (isError) setError(msg);
        else setMessage(msg);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleReset = async () => {
        console.log("➡️ Reset button clicked");
        setError("");
        setMessage("");

        try {
            const result = await resetPassword(email);
            console.log("✅ Shopify returned:", result);

            showAlert("Password reset email sent ✅\nCheck your inbox.");
        } catch (err: any) {
            console.log("❌ Error from Shopify:", err);
            showAlert(err.message || "Something went wrong", true);
        }
    };

    return (
        <ImageBackground
            source={require("../assets/images/bg_img.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: "center" }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    extraScrollHeight={20}       // extra space above keyboard
                    enableAutomaticScroll={true} // smooth scroll
                >
                    <Text className="text-[25px] color-primary text-center font-bold leading-[1] block mb-5 pb-3">
                        Reset <Text className="color-white">Password</Text>
                    </Text>
                    {error ? (
                        <Animated.View style={{
                            opacity: fadeAnim,
                            backgroundColor: "#ff4d4f",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 15,
                        }}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>{error}</Text>
                        </Animated.View>
                    ) : null}

                    {message ? (
                        <Animated.View style={{
                            opacity: fadeAnim,
                            backgroundColor: "#4BB543",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 15,
                        }}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>{message}</Text>
                        </Animated.View>
                    ) : null}

                    <TextInput
                        style={{
                            marginBottom: 12, padding: 12, borderWidth: 1, marginTop: 20,
                            borderRadius: 8, backgroundColor: "rgba(255,255,255,0.8)", width: "100%"
                        }}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        onPress={() => handleReset()}
                        style={{
                            backgroundColor: "#2c2f6a",
                            paddingVertical: 12,
                            paddingHorizontal: 25,
                            borderRadius: 10,
                            alignItems: "center",
                            width: 230,
                            marginTop: 10,
                            elevation: 5
                        }}
                        disabled={loading}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                            {loading ? "Sending Request..." : "Reset Password"}
                        </Text>
                    </TouchableOpacity>

                    <Text
                        className="color-primary"
                        onPress={() => router.back()}
                        style={{ marginTop: 20, textAlign: "center", fontWeight: "bold" }}
                    >
                        ⬅ Back to Login
                    </Text>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}
