import { Center } from "native-base";
import { ActivityIndicator } from "react-native";
import { Color } from "./colors"; 
import { Text } from "react-native";

const Colors = Color()

export function Loader({ loading,text }) {
    return loading ? <Center
        style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            top: 0,
            left: 0,
            zIndex:100
        }}
    >
        <ActivityIndicator color={Colors.white} />
        <Text style={{ color: Colors.white }}>{text}</Text>
    </Center> : ""
}