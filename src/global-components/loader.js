import { Center } from "native-base";
import { ActivityIndicator } from "react-native";
import { Color } from "./colors";

const Colors = Color()

export function Loader({ loading }) {
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
        <ActivityIndicator color={Colors.primary} />
    </Center> : ""
}