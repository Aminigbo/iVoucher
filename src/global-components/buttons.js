import { Button } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler"; 
import { Pressable } from "react-native";
import { Color } from "./colors";
import { BoldText, BoldText1 } from "./texts";
let Colors = Color()
export function CustomButtons({
    width,
    primary,
    text,
    height,
    callBack,
    Loading,
    LoadingText,
    Style
}) {
    return <>

        <Button
            onPress={() => {
                callBack()
            }}
            isLoading={Loading} isLoadingText={LoadingText}
            style={[Style, {
                backgroundColor: primary ? Colors.dark : "lightgrey",
                padding: 10,
                width: width,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                height: height
            }]}>
            <BoldText1
                color={primary ? "white" : "grey"} text={text} />
        </Button>
    </>
}


export function LinkButtons({
    text,
    callBack,
    Style,
    Color
}) {
    return <>
        <TouchableOpacity
            onPress={() => {
                callBack()
            }}
            style={{
            }} >
            <BoldText color={Color ? Color : Colors.primary}
                style={[Style, { marginLeft: 8, fontWeight: 300, fontSize: 12, }]} text={text} />
        </TouchableOpacity>
    </>
}


