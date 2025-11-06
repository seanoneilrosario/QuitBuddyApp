import {Stack, useLocalSearchParams} from "expo-router";
import {View, Text} from "react-native";


const productDetails = () => {
    const {id} = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <Text>Product : {id}</Text>
        </View>
    )
}

export default productDetails;
