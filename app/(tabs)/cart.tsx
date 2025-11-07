import {View, Text, Animated, Image} from "react-native";
import ScrollView = Animated.ScrollView;
import {SafeAreaView} from "react-native-safe-area-context";


const profile = () => {

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../../assets/images/bg_img.png")} className="absolute w-full h-full object-contain" />
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <View style={{ flex: 1 }}>
                    <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        <Text className="text-[50px] color-primary text-center font-bold leading-[1]">Cart <Text className="color-white">Page</Text></Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default profile;
