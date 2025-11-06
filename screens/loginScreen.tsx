import React, { useState, useContext } from "react";
import {
    View,
    TextInput,
    Button,
    Text,
    Animated,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView, Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../AuthContext";
import {login} from "@/fetchScripts/customerLogin";
import {router} from "expo-router";
import RegisterScreen from "@/screens/RegisterScreen";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Ionicons} from "@expo/vector-icons";


export default function LoginScreen() {
    const { setToken, setCustomer } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const fadeAnim = new Animated.Value(0);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {

        if (!email.trim()) {
            setError("Email is required");
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
            return;
        }
        if (!password.trim()) {
            setError("Password is required");
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
            return;
        }

        try {
            const result = await login(email, password);

            setToken(result.token);
            setCustomer(result.customer); // ✅ save customer data (tags)

        } catch (err: any) {
            setError(err.message || "Email or password is incorrect");
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    };

    return (
            <ImageBackground
                source={require("../assets/images/bg_img.png")}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <SafeAreaView style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}>
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
                        <Text className="text-[50px] color-primary text-center font-bold leading-[1]">Be Your Own <Text className="color-white">Quit Hero</Text></Text>
                        <Text className="text-[25px] color-primary text-center font-bold">Smoke-Free Starts Here Today!</Text>

                        {error ? (
                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    backgroundColor: "#ff4d4f",
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 15,
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold" }}>{error}</Text>
                            </Animated.View>
                        ) : null}

                        <TextInput
                            style={{
                                width: "100%",
                                marginBottom: 12,
                                padding: 12,
                                borderWidth: 1,
                                borderRadius: 8,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                marginTop: 50,
                                color: "#2c2f6a"
                            }}
                            placeholderTextColor="gray"
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError("");
                            }}
                            autoCapitalize="none"
                        />

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
                                placeholderTextColor="gray"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError("");
                                }}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#2c2f6a" />
                            </TouchableOpacity>
                        </View>

                        {/*<Button color="red" title="Login" onPress={handleLogin} />*/}
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={{
                                backgroundColor: "#2c2f6a",
                                paddingVertical: 12,
                                paddingHorizontal: 25,
                                borderRadius: 10,
                                alignItems: "center",
                                width: 230,
                                marginTop: 10,
                                marginBottom: 10,
                                elevation: 5, // Android shadow
                                marginLeft: "auto",
                                marginRight: "auto"
                            }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <Text
                            onPress={() => router.push("/forgot-password")}
                            style={{ marginTop: 15, textAlign: "center", color: "#2c2f6a", fontWeight: "600" }}
                        >
                            Forgot Password?
                        </Text>
                        <Text
                            onPress={() => router.push("/customer-register")}
                            style={{ marginTop: 15, textAlign: "center", color: "#2c2f6a", fontWeight: "600" }}
                        >
                            Register
                        </Text>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </ImageBackground>

    );
}
