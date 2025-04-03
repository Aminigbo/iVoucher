import { Button } from "native-base";
import { ActivityIndicator, Keyboard, Pressable, TouchableOpacity } from "react-native";
import { Color } from "./colors";
import { BoldText, BoldText1 } from "./texts";
let Colors = Color()
export function CustomButtons({
    width,
    primary,
    opacity,
    text,
    height,
    callBack,
    Loading,
    LoadingText,
    Style
}) {
    return <>
        <TouchableOpacity
            onPress={() => {
                Keyboard.dismiss()
                callBack()
            }}
            style={[Style, {
                backgroundColor: primary ? Colors.dark : null,
                padding: 17,
                borderRadius: 10,
                alignItems: "center",
                width: width ? width : "100%",
                marginVertical: 40,
                alignSelf: "center",
                opacity: opacity,

            }]}>
            {Loading ? <ActivityIndicator color={Colors.white} /> : <BoldText text={text} color={primary ? "white" : "grey"} />}
            {/* <BoldText text={text} color={primary ? "white" : "grey"} /> */}
        </TouchableOpacity>


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


