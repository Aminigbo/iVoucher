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

const Voucher = ({ navigation }) => {
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
                    style={{ width: "100%", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 19 }} >
                    <HStack space={7} alignItems="center">
                        <BackIcon />
                        <Text fontSize="lg"  >Pocket Voucher</Text>
                    </HStack>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => { navigation.push("Resolve-token") }} >
                        <HStack space={2} alignItems="center">
                            <Text fontSize="lg" color={Colors.dark} fontWeight="bold">Resolve</Text>
                            <Download color={Colors.dark} size={18} />
                        </HStack>
                    </TouchableOpacity>
                </HStack>

                <FlatList
                    data={[0]}
                    renderItem={() => {
                        return <>

                            <VStack p={4} space={3}
                                style={[{
                                    width: "100%",
                                    alignSelf: "center",
                                    borderRadius: 10,
                                    // marginTop: 40
                                }]}>

                                {/* <BoldText text="Create Pocket Voucher" color="#000" style={{ marginTop: 15 }} /> */}

                                <View style={[{ padding: 15, width: "100%" }, styles.shadowBox]}>
                                    <BoldText text={`Amount`} color="#000" />
                                    <HStack space={3} style={{
                                        marginTop: 25,
                                        alignItems: "center",
                                    }} >
                                        <BoldText2 text="₦" color="#000" />
                                        <TextInput style={[styles.input, {
                                            fontSize: 20,
                                            fontWeight: 500,
                                            color: "#000",
                                            width: "95%",
                                            padding: 10
                                        }]}
                                            placeholderTextColor="grey"
                                            placeholder="500.00 - 100,000.00"
                                            onChangeText={setAmount} value={Amount} keyboardType='numeric' />
                                    </HStack>
                                    <Divider />
                                    <Text fontSize="sm" color="grey" fontWeight="light">Amount of token to create.</Text>
                                    {/* <HStack
                                        mt={4}
                                        justifyContent="space-around"
                                        paddingVertical={10}
                                        space={2} >
                                       
                                    </HStack> */}

                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                        style={{
                                            marginTop: 25,
                                        }} >
                                        <TouchableOpacity onPress={() => setAmount("500")} >
                                            <Text style={styles.pills} >₦500</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("1000")}>
                                            <Text style={styles.pills} >₦1,000</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("2000")}>
                                            <Text style={styles.pills} >₦2,000</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("5000")}>
                                            <Text style={styles.pills} >5,000</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("10000")}>
                                            <Text style={styles.pills} >₦10,000</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("20000")}>
                                            <Text style={styles.pills} >₦20,000</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setAmount("50000")}>
                                            <Text style={styles.pills} >₦50,000</Text>
                                        </TouchableOpacity>
                                    </ScrollView>

                                    {Amount > 0 && <TouchableOpacity onPress={() => setAmount("")} style={{ padding: 10 }} >
                                        <Text style={{ marginTop: 15, alignSelf: "flex-end", color: Colors.primary }} >Clear</Text>
                                    </TouchableOpacity>}

                                </View>


                                {Amount > 99 &&
                                    <>
                                        <View style={[{ padding: 15, width: "100%", marginTop: 10 }, styles.shadowBox]}>
                                            <Input
                                                Placeholder="What's the voucher for? (optional)"
                                                Label
                                                LabelText="Remark"
                                                onChange={setRemark}
                                            />
                                        </View>
                                        <CustomButtons
                                            callBack={() => {
                                                setbottomSheetAction("CREATE TOKEN");
                                                setconfirmCreation(true)
                                            }}
                                            primary={Amount > 99 && true}
                                            opacity={Amount < 100 ? 0.2 : 1}
                                            text="Create Voucher"
                                        />
                                    </>
                                }


                                {Vouchers && Vouchers.length > 0 &&
                                    <Stack
                                        style={[{ marginTop: 30, padding: 15, width: "100%" }, styles.shadowBox]}
                                    //  style={{ marginTop: 30, marginBottom: 90, backgroundColor: "#fff" }}
                                    >
                                        <HStack style={{
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 10
                                        }} >

                                            {Vouchers && Vouchers.length > 0 && <BoldText text="Active Vouchers" color="#000" />}

                                            {Vouchers && Vouchers.length > 4 &&
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate("Notifications")
                                                }} >
                                                    <HStack justifyContent="flex-end" alignItems="center" space={4} >
                                                        <Text fontWeight={500} color={Colors.primary} >See All</Text>
                                                        <ArrowForward color={Colors.primary} />
                                                    </HStack>
                                                </TouchableOpacity>
                                            }
                                        </HStack>


                                        {Vouchers.slice(0, 4).map(items => {
                                            // console.log(items)
                                            return <HStack style={{
                                                marginVertical: 10
                                            }} alignItems="center" space={3} justifyContent="space-between" >
                                                <TouchableOpacity onPress={() => {
                                                    setconfirmCreation(true);
                                                    setbottomSheetAction("REVERSE TOKEN")
                                                    setSingleToken(items)
                                                }}  >
                                                    <HStack space={3} >
                                                        <TicketCheckIcon color={items.resolved == false ? "mediumseagreen" : "crimson"} />
                                                        <VStack >
                                                            <HStack>
                                                                <Text fontWeight="medium" color={Colors.primary} >{items.token} </Text>
                                                            </HStack>
                                                            <Text fontWeight="light" >₦{NumberWithCommas(items.amount)} {items.remark && items.remark.slice(0, 15)}{items.remark.length > 15 && "..."}</Text>
                                                            <Text fontWeight="light" >{timeAgo(items.created_at)}</Text>
                                                        </VStack>
                                                    </HStack>
                                                </TouchableOpacity>

                                                <HStack >
                                                    <TouchableOpacity style={{ padding: 15 }} onPress={() => {
                                                        onShareToken(items.token)
                                                    }} >
                                                        <ShareIcon />
                                                    </TouchableOpacity>
                                                </HStack>

                                            </HStack>
                                        })}
                                    </Stack>

                                }

                            </VStack>
                        </>

                    }}

                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={() => {
                            handleFetchVoucher(setVouchers)
                        }} />
                    }

                />

            </SafeAreaView >

            <Actionsheet isOpen={confirmCreation} onClose={() => {
                setconfirmCreation(!confirmCreation)

            }}>
                {/* {console.log(AccountHolder)} */}
                <Actionsheet.Content>

                    {bottomSheetAction == "REVERSE TOKEN" && <>
                        {/* {console.log(SingleToken)} */}

                        <Stack mt={5} mb={10} style={{
                            width: "100%",
                            padding: 15
                        }} >

                            {/* <Center mb={10} >
                                <QRCode
                                    value={SingleToken.token}
                                    logo={{ uri: base64Logo }}
                                    logoSize={30}
                                    logoBackgroundColor='transparent'
                                    size={200}
                                />
                            </Center> */}


                            <TouchableOpacity onPress={() => {
                                // Clipboard.setString(SingleToken.token) 
                            }} >
                                <HStack space={3} mb={5} >
                                    <CopyCheck color={Colors.primary} />
                                    <VStack >
                                        <HStack justifyContent="space-between" width="95%">
                                            <Text fontWeight="medium" fontSize={18} color={Colors.primary} >{SingleToken.token} </Text>
                                            <Text fontWeight="bold" fontSize={18} >₦{NumberWithCommas(SingleToken.amount)}</Text>
                                        </HStack>

                                    </VStack>
                                </HStack>
                            </TouchableOpacity>

                            {SingleToken.remark && <Text fontWeight="light" style={{ margin: 10 }} >{SingleToken.remark}</Text>}


                            <Text fontWeight="light" style={{ margin: 10 }} >{timeAgo(SingleToken.created_at)}</Text>

                            <TouchableOpacity onPress={() => {
                                setconfirmCreation(false)
                                handleDeactivateToken(SingleToken.token, setVouchers)
                            }}  >
                                <HStack alignItems="center" justifyContent="space-between" backgroundColor={Colors.dark} style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    marginTop: 30
                                }} >
                                    <HStack space={4}>
                                        <DeleteIcon />
                                        <VStack>
                                            <BoldText1 text="Deactivate Token" color={Colors.white} />
                                            <BoldText
                                                style={{ marginTop: 5 }}
                                                text={`${NumberWithCommas(SingleToken.amount)} will be reversed to your wallet`} color="grey" />
                                        </VStack>
                                    </HStack>
                                    <ArrowForwardIcon />
                                </HStack>
                            </TouchableOpacity>
                        </Stack>
                    </>}

                    {bottomSheetAction == "CREATE TOKEN" && <>
                        <BoldText text="Confirm voucher creation" color="grey" style={{ padding: 10, marginBottom: 20, }} />

                        <HStack mb={15} alignItems="center" space={5} justifyContent="flex-start" mt={2}
                            style={{ width: "95%", backgroundColor: "#E6E6E6", padding: 15, borderRadius: 10 }} >
                            <Center style={{
                                borderRadius: 50,
                                borderColor: Colors.dark,
                                borderWidth: 0.3,
                                width: 35,
                                height: 35
                            }} >
                                <Icon as={<TicketCheckIcon size={17} />} color={Colors.primary} />
                            </Center>

                            <VStack>
                                <BoldText1 text={`₦${NumberWithCommas(Amount)}`} color="#000" size={16} />
                                <Text color="gray.500">{Remark ? Remark : "You did not add a reason"}</Text>
                            </VStack>
                        </HStack>

                        <Stack space={3} style={{ width: "95%", marginTop: 20 }} >
                            <Text fontSize="xs" fontWeight="medium">When should your voucher expire?</Text>

                            {/* <TextInput
                                style={[styles.input,
                                {
                                    fontSize: 15,
                                    fontWeight: 300,
                                    color: "#000",
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: "lightgrey",
                                    paddingVertical: 5,
                                    marginTop: 10
                                }]}
                                placeholder="Number of hours"
                                keyboardType="numeric"
                                onChangeText={setduration} value={duration} /> */}
                            <Input
                                Placeholder="Number of hours"
                                onChange={setduration}
                                type="numeric"
                            />


                            <Text fontSize="xs" fontWeight="thin">Leaving empty means your voucher will not expire</Text>


                        </Stack>

                        <CustomButtons
                            width="90%"
                            primary
                            callBack={() => {
                                handleCreateVoucher({ amount: Amount, duration, isExpiry: duration ? true : false, Remark }, setVouchers)
                                setconfirmCreation(false)
                                setRemark("")
                                setAmount("")
                            }}
                            text="Proceed to create"
                        />
                    </>
                    }


                </Actionsheet.Content>
            </Actionsheet>

            <Loader loading={Loading} />
        </>
    );
};

export default Voucher;

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
