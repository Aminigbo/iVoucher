import { HStack } from "native-base"
import { BackIcon } from "./icons"
import { Text, TouchableOpacity } from "react-native"
import { Download } from "lucide-react-native"
import { Color } from "./colors"

const Colors = Color()
export function Header({ navigation }) {
    return <>
        <HStack space={7} bg="#fff" alignItems="center"
            style={{ width: "100%", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 19 }} >
            <HStack space={7} alignItems="center">
                <BackIcon />
                <Text fontSize="lg"  >Voucher</Text>
            </HStack>
            <TouchableOpacity
                style={{}}
                onPress={() => { navigation.push("Resolve-token") }} >
                <HStack space={2} alignItems="center">
                    <Text fontSize="lg" color={Colors.primary} fontWeight="normal">Resolve</Text>
                    <Download color={Colors.primary} size={18} />
                </HStack>
            </TouchableOpacity>
        </HStack>
    </>
}