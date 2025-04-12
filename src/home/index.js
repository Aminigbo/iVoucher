import React, { useState, useCallback, useMemo } from 'react';
import { Text, Box, VStack, HStack, Icon, Stack, Divider, Center, FlatList, Actionsheet } from 'native-base';
import { Alert, PermissionsAndroid, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import { BoldText, BoldText1 } from '../global-components/texts';
import { ArrowForward } from '../global-components/icons';
import { VoucherComponent } from '../global-components/voucher-component';
import { Color } from '../global-components/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { FetchTransactionsModel, GetAppConfigService } from './service';
import { formatDate, NumberWithCommas, timeAgo } from '../utilities';
import ShareLib from 'react-native-share';
import { FetchUserInfoService } from '../auth/service';
import { appState } from '../state';
import { Loader } from '../global-components/loader';
import { LinkButtons } from '../global-components/buttons';
import { ArrowBigDown, ArrowBigUp, Bell, CopyCheck, Landmark, ScanQrCode, Share2Icon, Shuffle, Ticket, TicketCheck, TicketCheckIcon, Trash2, Wallet } from 'lucide-react-native';
import { CardIcon, ReferralCard } from '../assets/svgs';

const Colors = Color();

function Card({ navigation, disp_transactions }) {
    // State management
    const [seeBal, setSeeBal] = React.useState(true);
    const [appConfigs, setAppConfigs] = React.useState(null);
    const [loadAll, setLoadAll] = React.useState(false);
    const [bottomSheet, setBottomSheet] = React.useState(false);
    const [bottomSheetType, setBottomSheetType] = React.useState("");
    const [singleToken, setSingleToken] = React.useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = React.useState({
        transactions: false,
        pin: false,
        userData: false
    });

    const { User, Transactions, login, SaveTrxn, handleFetchVoucher, handleDeactivateToken, Loading, loadingText } = appState();

    // Memoized values
    const filteredTransactions = useMemo(() => {
        return Transactions?.filter(e => e.type === "BANK-PAYOUT" || e.type === "PV-PAYOUT") || [];
    }, [Transactions]);

    const displayVouchers = useMemo(() => {
        return vouchers.slice(0, 3);
    }, [vouchers]);

    // Callbacks for event handlers
    const handleFetchTransactions = useCallback(() => {
        setLoading(prev => ({ ...prev, transactions: true }));

        FetchTransactionsModel(User.id)
            .then(response => {
                setLoading(prev => ({ ...prev, transactions: false }));
                SaveTrxn(response.success ? response.data : []);
            })
            .catch(error => {
                disp_transactions([]);
                setLoading(prev => ({ ...prev, transactions: false }));
            });
    }, [User.id, SaveTrxn, disp_transactions]);

    const handleFetchAppConfig = useCallback(() => {
        GetAppConfigService()
            .then(response => setAppConfigs(response.success ? response.data : null))
            .catch(() => setAppConfigs(null));
    }, []);

    const fetchUserInfo = useCallback(() => {
        setLoading(prev => ({ ...prev, userData: true }));

        FetchUserInfoService(User.id)
            .then(response => {
                if (response.success) {
                    login({ ...User, ...response.data });
                } else {
                    Alert.alert("Error", response.message);
                }
                setLoading(prev => ({ ...prev, userData: false }));
            })
            .catch(error => {
                console.log(error);
                setLoading(prev => ({ ...prev, userData: false }));
            });
    }, [User, login]);

    const requestCameraPermission = useCallback(async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Pocket Voucher',
                        message: 'Pocket Voucher needs access to your camera',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    navigation.navigate("Scan", { user: User });
                } else {
                    Alert.alert("Permission Error", "You need to allow us access to your camera");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }, [navigation, User]);

    const onShareToken = useCallback(async (data) => {
        if (!appConfigs) {
            handleFetchAppConfig();
        } else {
            try {
                await ShareLib.open({
                    message: data,
                    url: data
                });
            } catch (error) {
                console.error("Share error:", error);
            }
        }
    }, [appConfigs, handleFetchAppConfig]);

    const handleRefresh = useCallback(() => {
        setLoadAll(true);
        handleFetchAppConfig();
        handleFetchTransactions();
        fetchUserInfo();
        setLoadAll(false);
    }, [handleFetchAppConfig, handleFetchTransactions, fetchUserInfo]);

    // Effects
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            handleFetchTransactions();
            handleFetchAppConfig();
            fetchUserInfo();
            handleFetchVoucher(setVouchers);
        });
        return unsubscribe;
    }, [navigation, handleFetchTransactions, handleFetchAppConfig, fetchUserInfo, handleFetchVoucher]);

    // Render functions
    const renderHeader = useMemo(() => (
        <HStack alignItems="center" justifyContent="space-between" paddingVertical={18} pt={6} pb={4} p={2}>
            <HStack space={3} style={{ marginRight: 15, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("Persona")}>
                    <VStack>
                        <Text fontSize="lg" fontWeight="normal">Welcome</Text>
                        <Text fontSize="lg" fontWeight="bold">{User && `${User.firstName} ${User.lastName}`}</Text>
                    </VStack>
                </TouchableOpacity>
            </HStack>

            <HStack space={12} style={{ marginRight: 15 }}>
                <TouchableOpacity onPress={requestCameraPermission}>
                    <ScanQrCode size={22} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                    <Bell size={22} color={Colors.primary} />
                </TouchableOpacity>
            </HStack>
        </HStack>
    ), [User, navigation, requestCameraPermission]);

    const renderQuickActions = useMemo(() => (
        <HStack bg="white" alignItems="center" p={4} justifyContent="space-around">
            {[
                { icon: Ticket, text: "Voucher", onPress: () => navigation.navigate("Voucher") },
                { icon: Wallet, text: "To Pocket", onPress: () => navigation.navigate("Send-to-pv") },
                { icon: Landmark, text: "To Bank", onPress: () => navigation.navigate("Send-to-bank") },
                // { icon: Shuffle, text: "Withdraw", onPress: () => navigation.navigate("Card-withdrawal") }
            ].map((action, index) => (
                <TouchableOpacity key={index} onPress={action.onPress}>
                    <VStack alignItems="center" space={2}>
                        <Center style={{
                            borderWidth: 0,
                            borderRadius: 50,
                            backgroundColor: Colors.accent,
                            width: 45,
                            height: 45
                        }}>
                            <Icon as={<action.icon size={22} strokeWidth={1.6} />} color={Colors.primary} />
                        </Center>
                        <Text fontSize="sm" light>{action.text}</Text>
                    </VStack>
                </TouchableOpacity>
            ))}
        </HStack>
    ), [navigation]);

    const renderReferralBanner = useMemo(() => (
        <HStack space={5} style={styles.banner}>
            <VStack space={3} style={{ flex: 2, justifyContent: "flex-start", alignItems: "flex-start" }}>
                <BoldText
                    color={Colors.dark}
                    size={14}
                    text="Refer a friend to Pocket Voucher and earn a 2% voucher token as a reward!"
                />
            </VStack>
            <Center flex={1} style={{ marginTop: 20 }}>
                <ReferralCard />
            </Center>
        </HStack>
    ), []);

    const renderCardPromo = useMemo(() => !User.card && (
        <HStack space={5} style={styles.banner}>
            <VStack space={3} style={{ flex: 2, justifyContent: "flex-start", alignItems: "flex-start" }}>
                <BoldText
                    color={Colors.dark}
                    size={14}
                    text="Claim your first Pocket Voucher virtual USD card"
                />
                <LinkButtons
                    Style={styles.cardButton}
                    Color={Colors.white}
                    callBack={() => navigation.navigate("Cards")}
                    text="Create"
                />
            </VStack>
            <Center flex={1} style={{ marginTop: 20 }}>
                <CardIcon size={70} strokeWidth={1} color={Colors.primary} />
            </Center>
        </HStack>
    ), [User.card, navigation]);

    const renderVoucherList = useMemo(() => vouchers.length > 0 && (
        <>
            <HStack justifyContent="space-between" alignItems="center" p={2} mb={-2} style={{ paddingLeft: 20, marginTop: 20 }}>
                <BoldText text="Active vouchers" color="#000" />
                {vouchers.length > 3 && (
                    <TouchableOpacity onPress={() => navigation.navigate("Voucher")}>
                        <HStack justifyContent="flex-end" alignItems="center" space={4}>
                            <Text fontWeight={500} color={Colors.primary}>See All</Text>
                            <ArrowForward color={Colors.primary} />
                        </HStack>
                    </TouchableOpacity>
                )}
            </HStack>

            <Stack p={2} mx={4} shadow={0.5}>
                <Box mb={11}>
                    {displayVouchers.map((item, index) => (
                        <HStack key={index} alignItems="center" mt={6} space={2}>
                            <TouchableOpacity
                                style={styles.voucherItem}
                                onPress={() => {
                                    setBottomSheetType("REVERSE TOKEN");
                                    setSingleToken(item);
                                    setBottomSheet(true);
                                }}
                            >
                                <HStack space={3}>
                                    <Center style={styles.voucherIcon(item.resolved)}>
                                        <TicketCheckIcon size={20} color={item.resolved ? "crimson" : Colors.primary} />
                                    </Center>
                                    <VStack>
                                        <HStack>
                                            <Text fontWeight="medium" color={Colors.dark}>{item.token}</Text>
                                        </HStack>
                                        <Text fontWeight="light" color={Colors.primary}>
                                            ₦{NumberWithCommas(item.amount)} {item.remark?.slice(0, 15)}{item.remark?.length > 15 && "..."}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Text fontWeight="light">{timeAgo(item.created_at)}</Text>
                            </TouchableOpacity>
                        </HStack>
                    ))}
                </Box>
            </Stack>
        </>
    ), [vouchers, displayVouchers, navigation]);

    const renderTransactionList = useMemo(() => filteredTransactions.length > 0 && (
        <>
            <Divider style={{ opacity: 0.4, marginVertical: 20 }} />
            <Stack p={5}>
                <HStack style={styles.transactionHeader}>
                    <BoldText text="Recent activities" color="#000" />
                    {filteredTransactions.length > 2 && (
                        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                            <HStack justifyContent="flex-end" alignItems="center" space={4}>
                                <Text fontWeight={500} color={Colors.primary}>See All</Text>
                                <ArrowForward color={Colors.primary} />
                            </HStack>
                        </TouchableOpacity>
                    )}
                </HStack>

                {filteredTransactions.slice(0, 4).map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate("view-transaction", { data: item })}
                    >
                        <HStack mt={5} alignItems="center" space={3}>
                            <Center style={styles.transactionIcon(item.type, item.user !== User.id)}>
                                <Icon as={item.user !== User.id ? <ArrowBigDown size={19} /> : <ArrowBigUp size={19} />}
                                    color={item.user !== User.id ? Colors.primary : Colors.danger}
                                />
                            </Center>

                            <HStack style={styles.transactionDetails}>
                                <VStack>
                                    <Text>
                                        {NumberWithCommas(item.amount)} {item.user === User.id ? "to " : "from "}
                                        {item.user === User.id
                                            ? item.data.receiver.accountName?.slice(0, 17) + (item.data.receiver.accountName?.length > 17 ? "..." : "")
                                            : item.data.sender.senderFullname?.slice(0, 17) + (item.data.sender.senderFullname?.length > 17 ? "..." : "")
                                        }
                                    </Text>
                                    <Text fontWeight="light" fontSize="xs">{formatDate(item.created_at)}</Text>
                                </VStack>

                                <VStack>
                                    <Text style={styles.transactionStatus(item.status)}>{item.status}</Text>
                                </VStack>
                            </HStack>
                        </HStack>
                    </TouchableOpacity>
                ))}
            </Stack>
        </>
    ), [filteredTransactions, User.id, navigation]);

    const renderBottomSheet = useMemo(() => bottomSheet && (
        <Actionsheet isOpen={bottomSheet} onClose={() => setBottomSheet(false)}>
            <Actionsheet.Content>
                {bottomSheetType === "REVERSE TOKEN" && singleToken && (
                    <Stack mt={5} mb={10} style={styles.bottomSheetContent}>
                        <TouchableOpacity onPress={() => Clipboard.setString(singleToken.token)}>
                            <HStack space={3} mb={5}>
                                <CopyCheck color={Colors.primary} />
                                <VStack>
                                    <HStack justifyContent="space-between" width="95%">
                                        <Text fontWeight="medium" fontSize={18} color={Colors.primary}>{singleToken.token}</Text>
                                        <Text fontWeight="bold" fontSize={18}>₦{NumberWithCommas(singleToken.amount)}</Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>

                        {singleToken.remark && <Text fontWeight="light" style={{ margin: 10 }}>{singleToken.remark}</Text>}
                        <Text fontWeight="light" style={{ margin: 10 }}>{timeAgo(singleToken.created_at)}</Text>
                        <Divider style={{ marginVertical: 10 }} />

                        <HStack style={styles.bottomSheetActions}>
                            <TouchableOpacity onPress={() => {
                                setBottomSheet(false);
                                onShareToken(singleToken.token);
                            }}>
                                <HStack space={4} style={styles.bottomSheetButton}>
                                    <Share2Icon color={Colors.primary} />
                                    <BoldText1 text="Share Token" color={Colors.dark} />
                                </HStack>
                            </TouchableOpacity>

                            <Divider orientation='vertical' style={{ height: 20 }} />

                            <TouchableOpacity onPress={() => {
                                setBottomSheet(false);
                                handleDeactivateToken(singleToken.token, setVouchers);
                            }}>
                                <HStack space={4} style={styles.bottomSheetButton}>
                                    <Trash2 color={Colors.danger} />
                                    <BoldText1 text="Deactivate Token" color={Colors.danger} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Stack>
                )}
            </Actionsheet.Content>
        </Actionsheet>
    ), [bottomSheet, bottomSheetType, singleToken, onShareToken, handleDeactivateToken, setVouchers]);

    if (!User) {
        navigation.replace("Login");
        return null;
    }

    return !User.pin ? navigation.navigate("Create-pin") : (
        // return (
        <>
            <SafeAreaView style={styles.container}>
                {renderHeader}
                <FlatList
                    data={[0]} // Using a single item list to avoid unnecessary re-renders
                    renderItem={() => (
                        <VStack space={4} mt={4}>
                            <VoucherComponent
                                User={User}
                                seeBal={seeBal}
                                setSeeBal={setSeeBal}
                                loading={loading.userData}
                            />

                            <VStack bg="white" shadow={0.1}>
                                {renderQuickActions}

                                <Swiper
                                    style={styles.swiper}
                                    loop={true}
                                    autoplay={true}
                                    bounces={true}
                                    bouncesZoom={true}
                                    autoplayTimeout={5}
                                >
                                    {renderReferralBanner}
                                </Swiper>

                                {renderCardPromo}
                                {renderVoucherList}
                                {renderTransactionList}
                            </VStack>
                        </VStack>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={loadAll} onRefresh={handleRefresh} />
                    }
                />
            </SafeAreaView>

            {renderBottomSheet}
            {Loading && <Loader loading={Loading} text={loadingText} />}
        </>
    );
}

const styles = {
    container: {
        backgroundColor: "#fff",
        display: "flex",
        flex: 1,
    },
    banner: {
        height: 120,
        backgroundColor: Colors.accent,
        margin: 15,
        position: "relative",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        marginTop: 20,
    },
    cardButton: {
        backgroundColor: Colors.dark,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    voucherItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignItems: "center"
    },
    voucherIcon: (resolved) => ({
        borderRadius: 30,
        backgroundColor: resolved ? "#FEF4EA" : "#EAFBF5",
        width: 35,
        height: 35
    }),
    transactionHeader: {
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    transactionIcon: (type, isIncoming) => ({
        borderRadius: 30,
        backgroundColor: type === "BANK-PAYOUT" ? "#FEF4EA" : "#EAFBF5",
        width: type === "BANK-PAYOUT" ? 35 : 30,
        height: type === "BANK-PAYOUT" ? 35 : 30,
    }),
    transactionDetails: {
        justifyContent: "space-between",
        flex: 1
    },
    transactionStatus: (status) => ({
        color: status === "processing" ? "#E0B77E" :
            status === "success" ? "#7EE0B9" : "#E07E80",
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 6,
        fontSize: 13,
    }),
    swiper: {
        height: 150,
    },
    bottomSheetContent: {
        width: "100%",
        padding: 15
    },
    bottomSheetActions: {
        marginVertical: 30,
        justifyContent: "space-between",
        alignItems: "center"
    },
    bottomSheetButton: {
        padding: 15
    }
};

export default React.memo(Card);