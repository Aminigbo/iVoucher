import React, { useState } from "react";
import { Box, VStack, Text, Button, HStack, Image, Pressable, ScrollView, Divider, Select, CheckIcon, Center, Icon, Actionsheet, Stack, AddIcon, Checkbox, ShareIcon, ArrowForwardIcon } from "native-base";
import { FlatList, Keyboard, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, CheckSquare, CircleCheck, CopyCheck, Download, Hexagon, Landmark, TicketCheckIcon, Wifi } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowForward, BackIcon, CloseIcon, DeleteIcon, InIcon, OutIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { BoldText, BoldText1, BoldText2 } from "../global-components/texts";
import { Loader } from "../global-components/loader";
import { formatDate, NumberWithCommas, onShareToken, timeAgo } from "../utilities";
import { CustomButtons } from "../global-components/buttons";
import { Input } from "../global-components/input";
import QRCode from "react-native-qrcode-svg";

const Colors = Color()

const VoucherDetails = ({ navigation, route }) => {
    const { User, handleFetchVoucher, Loading, handleCreateVoucher, handleDeactivateToken, handleResolveToken } = appState()

    const [Amount, setAmount] = useState(0);
    const [confirmCreation, setconfirmCreation] = useState(false)
    const [Remark, setRemark] = useState("")
    const [duration, setduration] = useState(null)
    const [Vouchers, setVouchers] = useState([])
    const [bottomSheetAction, setbottomSheetAction] = useState("")
    const [SingleToken, setSingleToken] = React.useState(null)
    const [voucher, setvoucher] = React.useState(route.params.voucher)

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', async () => {
            handleFetchVoucher(setVouchers)
        });

        return unsubscribe;

    }, [navigation]);

    return (
        <>
            {/* {console.log(voucher)} */}

            <SafeAreaView style={{ display: "flex", flex: 1, backgroundColor: "#fff" }} >

                <HStack space={7} bg="#fff" alignItems="center"
                    style={{ width: "100%", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 19 }} >
                    <HStack space={7} alignItems="center">
                        <BackIcon />
                        <Text fontSize="lg"  >{voucher.token}</Text>
                    </HStack>
                </HStack>

                <HStack space={7} alignItems="center" flex={1}
                    style={{ width: "100%", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 19 }} >

                    <Center mt={45} mb={10} style={{
                        width: "100%",
                        padding: 15
                    }} >

                        <Text fontSize="sm" color="grey" style={{ marginVertical: 10 }} >Accept</Text>

                        <Text fontWeight="bold" fontSize="5xl" >₦{NumberWithCommas(voucher.amount)}</Text>

                        <HStack style={{ width: "100%" }} space={4} alignItems="center" justifyContent="space-between" >
                            <Text fontSize="sm" color="grey" style={{ marginVertical: 10 }} >From</Text>
                            <Text fontWeight="medium" fontSize="sm" >Aminigbo Paul</Text>
                        </HStack>

                        <HStack style={{ width: "100%" }} space={4} alignItems="center" justifyContent="space-between" >
                            <Text fontSize="sm" color="grey" style={{ marginVertical: 10 }} >For</Text>
                            <Text fontWeight="medium" fontSize="sm" >{voucher.remark}</Text>
                        </HStack>


                        <HStack style={{ width: "100%" }} space={4} alignItems="center" justifyContent="space-between" >
                            <Text fontSize="sm" color="grey" style={{ marginVertical: 10 }} >Created At</Text>
                            <Text fontWeight="light" style={{ margin: 10 }} >{timeAgo(voucher.created_at)}</Text>
                        </HStack>

                        <HStack style={{ width: "100%" }} space={4} alignItems="center" justifyContent="space-between" >
                            <Text fontSize="sm" color="grey" style={{ marginVertical: 10 }} >Created At</Text>
                            <Text fontWeight="light" style={{ margin: 10 }} >{new Date(new Date(voucher.created_at).getTime() + 5 * 60 * 60 * 1000).toLocaleDateString()}</Text>
                        </HStack>


                    </Center>

                </HStack>

                <CustomButtons callBack={() => {
                    handleDeactivateToken(voucher.token, setVouchers)
                }}
                    width="90%"
                    primary={true}
                    Loading={Loading}
                    LoadingText="Processing..."
                    text="Resolve Token"
                />

            </SafeAreaView >

            <Actionsheet isOpen={confirmCreation} onClose={() => {
                setconfirmCreation(!confirmCreation)

            }}>
                {/* {console.log(AccountHolder)} */}
                <Actionsheet.Content>




                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default VoucherDetails;

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
        borderWidth: 0.5,
        marginRight: 15,
        backgroundColor: "#E6E6E6"
    }
});
