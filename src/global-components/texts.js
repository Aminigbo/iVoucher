import { Divider, HStack, Text, VStack } from "native-base" 
import { TouchableOpacity } from "react-native-gesture-handler"
import { Color } from "./colors"
const Colors = Color()


export const BoldText = ({
    text,
    style,
    color,
    size
}) => {
    return <>
        <Text
            style={[style, {
                fontSize: size ? size : 15,
                color: color ? color : Colors.primary,
                // fontWeight: 400
            }]}
        >
            {text}
        </Text>
    </>
}

export const BoldText1 = ({
    text,
    style,
    color,
    size
}) => {
    return <>
        <Text
            style={[style, {
                fontSize: size,
                color: color ? color : Colors.primary,
                fontWeight: 700
            }]}
        >
            {text}
        </Text>
    </>
}

export const BoldText2 = ({
    text,
    style,
    color,
    size
}) => {
    return <>
        <Text
            style={[style, {
                fontSize: size ? size : 23,
                color: color ? color : Colors.primary,
                fontWeight: 700
            }]}
        >
            {text}
        </Text>
    </>
}

export const UnderlinedBoldText = ({
    text,
    style,
    color,
    size, active,
    callBack,
    
}) => {
    return <>
        <TouchableOpacity onPress={() => {
            callBack()
        }}>
            <VStack 
                style={{
                    alignItems: "center"
                }} >
                <Text
                    style={[style, {
                        fontSize: size,
                        color: color ? color : Colors.primary,
                        fontWeight: 700,
                    }]}
                >
                    {text}
                </Text>
                {active &&  <Divider  mt={1} h={1}  />}
                
            </VStack>
        </TouchableOpacity>
    </>
}
