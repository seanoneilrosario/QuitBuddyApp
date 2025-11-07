import {Stack, useSegments} from "expo-router";
import "./global.css";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../AuthContext";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "@/screens/loginScreen";

function AuthGate() {
    const { token, loading } = useContext(AuthContext);
    const segments = useSegments();
    const currentRoute = segments[segments.length - 1];

    // ✅ Allow access to these screens without token
    const publicRoutes = ["login", "forgot-password", "customer-register"];

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    // ✅ If NOT logged in AND route is NOT public → send to login
    if (!token && !publicRoutes.includes(currentRoute)) {
        return <LoginScreen />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Main Tab Layout */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* These pages will appear *over* the tabs */}
            <Stack.Screen name="products/[id]" options={{ presentation: "modal" }} />
            <Stack.Screen name="collections/[id]" options={{ presentation: "modal" }} />

            {/* Public routes */}
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="customer-register" options={{ headerShown: false }} />
        </Stack>
    );
}


export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}
