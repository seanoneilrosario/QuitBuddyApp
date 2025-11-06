import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Animated, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // 👈 for eye icon
import { customerRegister } from "@/fetchScripts/customerRegister";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (error) {
            Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() => {
                setTimeout(() => {
                    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
                }, 2500);
            });
        }
    }, [error]);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await customerRegister(email, password, firstName, lastName);

            Alert.alert("Success!", "Account created. Please login.", [
                { text: "OK", onPress: () => router.replace("/") }
            ]);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("../assets/images/bg_img.png")} style={{ flex: 1 }} resizeMode="cover">
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
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
                        Create <Text className="color-white">Account</Text>
                    </Text>

                    {error ? (
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                backgroundColor: "#ff4d4f",
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 15,
                                width: "100%"
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>{error}</Text>
                        </Animated.View>
                    ) : null}

                    {/* First Name */}
                    <TextInput
                        style={{
                            marginTop: 20,
                            marginBottom: 12,
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            width: "100%",
                            color: "#2c2f6a"
                        }}
                        placeholder="First Name"
                        placeholderTextColor="#555"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    {/* Last Name */}
                    <TextInput
                        style={{
                            marginBottom: 12,
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            width: "100%",
                            color: "#2c2f6a"
                        }}
                        placeholder="Last Name"
                        placeholderTextColor="#555"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    {/* Email */}
                    <TextInput
                        style={{
                            marginBottom: 12,
                            padding: 12,
                            borderWidth: 1,
                            borderRadius: 8,
                            backgroundColor: "rgba(255,255,255,0.8)",
                            width: "100%",
                            color: "#2c2f6a"
                        }}
                        placeholder="Email"
                        placeholderTextColor="#555"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    {/* Password */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginBottom: 12,
                        width: "100%"
                    }}>
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                color: "#2c2f6a"
                            }}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#555"
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        backgroundColor: "rgba(255,255,255,0.8)",
                        marginBottom: 12,
                        width: "100%"
                    }}>
                        <TextInput
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                color: "#2c2f6a"
                            }}
                            placeholder="Confirm Password"
                            secureTextEntry={!showConfirm}
                            placeholderTextColor="#555"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#2c2f6a" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={handleRegister}
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
                            {loading ? "Creating..." : "Create Account"}
                        </Text>
                    </TouchableOpacity>

                    <Text
                        onPress={() => router.replace("/")}
                        style={{ marginTop: 15, textAlign: "center", color: "#2c2f6a", fontWeight: "600" }}
                    >
                        Already have an account? Login
                    </Text>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}
