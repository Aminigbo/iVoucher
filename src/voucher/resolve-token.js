import React, { useState } from "react";
import { Box, VStack, Text, Button, HStack, Image, Pressable, ScrollView, Divider, Select, CheckIcon, Center, Icon, Actionsheet, Stack, AddIcon, Checkbox, ShareIcon, ArrowForwardIcon } from "native-base";
import { FlatList, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, CheckSquare, CircleCheck, CopyCheck, Download, Hexagon, Landmark, Tags, TicketCheckIcon, Wifi } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowForward, BackIcon, CloseIcon, DeleteIcon, InIcon, OutIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { BoldText, BoldText1, BoldText2 } from "../global-components/texts";
import { Loader } from "../global-components/loader";
import { formatDate, NumberWithCommas, onShareToken, timeAgo } from "../utilities";
import { CustomButtons } from "../global-components/buttons";
import { Input } from "../global-components/input";

const Colors = Color()

const ResolveToken = ({ navigation }) => {
    const { User, handleFetchVoucher, Loading, handleCreateVoucher, handleDeactivateToken, handleResolveToken } = appState()

    const [Amount, setAmount] = useState(0);
    const [confirmCreation, setconfirmCreation] = useState(false)
    const [Remark, setRemark] = useState("")
    const [duration, setduration] = useState(null)
    const [Vouchers, setVouchers] = useState([])
    const [bottomSheetAction, setbottomSheetAction] = useState("")
    const [SingleToken, setSingleToken] = React.useState(null)
    const [token, settoken] = React.useState("")

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {

            handleFetchVoucher(setVouchers)
        });

        return unsubscribe;

    }, [navigation]);

    return (
        <>
            {/* {console.log(Vouchers.length)} */}

            <SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: Colors.white }} >

                <HStack space={7} bg="#fff" alignItems="center"
                    style={{ width: "100%", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 19 }}>
                    <HStack space={7} alignItems="center">
                        <BackIcon />
                        <Text fontSize="lg" fontWeight="bold">Resolve Voucher</Text>
                    </HStack>

                </HStack>

                <ScrollView>

                    {/* Input Fields */}
                    <VStack p={4} space={3}
                        style={[{
                            width: "100%",
                            alignSelf: "center",
                            borderRadius: 10,
                            marginTop: 20
                        }]}>

                        {/* <Text fontSize="sm" fontWeight="thin">Resolve Voucher</Text> */}

                        <View style={[{ padding: 15, width: "100%" }, styles.shadowBox]}>
                            <HStack space={3} style={{
                                marginTop: 25,
                                alignItems: "center",
                            }} >
                                <Tags color="#000" />
                                 <TextInput style={[styles.input, {
                                    fontSize: 15,
                                    color: "#000",
                                    width: "95%",
                                    padding: 10
                                }]}
                                    placeholder="Enter voucher token"
                                    placeholderTextColor="grey"
                                    onChangeText={(text) => settoken(text.toUpperCase())} value={token} />  

                            </HStack>
                            <Divider />

                            <Text fontSize="sm" fontWeight="thin" style={{ marginVertical: 20, color:"grey" }} >
                                The amount would be resolved to your account.
                            </Text>

                        </View>

                    </VStack>
                </ScrollView>

                <CustomButtons
                    width="90%"
                    callBack={() => {
                        handleResolveToken(token, setVouchers)
                        setconfirmCreation(false)
                        settoken("")
                    }}
                    primary={token.length > 5 && true}
                    opacity={token.length < 5 ? 0.3 : 1}
                    text="Resolve voucher"
                />

            </SafeAreaView >

            <Actionsheet isOpen={confirmCreation} onClose={() => {
                setconfirmCreation(!confirmCreation)

            }}>
                <Actionsheet.Content>
                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default ResolveToken;

const styles = StyleSheet.create({

    shadowBox: {
        backgroundColor: '#fff',

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.2 },
        shadowOpacity: 0.3,
        shadowRadius: 0.5,
        borderRadius: 6,

        // Shadow for Android
        elevation: 0.4,
    },
    pills: {
        borderColor: "#E6E6E6",
        textAlign: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 0.5
    }
});
