import {View, Text} from "react-native";
import {Tabs} from "expo-router";


const _Layout = () => {

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}

export default _Layout;