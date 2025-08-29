import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Card,
    CardHeader,
    Flex,
    Badge,
    Divider,
    HStack,
    Center,
    Stack
} from 'native-base';
import { FlatList, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { BackIcon, CloseIcon } from '../global-components/icons';
import { BoldText } from '../global-components/texts';
import { LinkButtons } from '../global-components/buttons';
import { CardIcon } from '../assets/svgs';
import { Color } from '../global-components/colors';
import { CircleCheck, File } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { appState } from '../state';
import { FetchMedicalRecordsController, RequestConsentTokenController, VerifyConsentTokenController } from './service';
import { FileUrl, formatDate } from '../utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../global-components/loader';

const Colors = Color()
const ViewRecordUI = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [otpInput, setotpInput] = useState(false);
    const [loadingText, setloadingText] = useState("")
    const inputs = useRef([]);
    const [previewImage, setPreviewImage] = useState(null);

    // Sample medical records data (replace with actual data source)
    const [record, setRecord] = useState(route.params.record);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {

        });
        return unsubscribe;
    }, [navigation]);

    const handleImagePreview = (image) => {
        setPreviewImage(image);
    };

    const closeImagePreview = () => {
        setPreviewImage(null);
    };

    return (
        <>
            <SafeAreaView style={{
                backgroundColor: "#fff", display: "flex", flex: 1,
                // justifyContent: "space-between"
            }} >
                {console.log(record)}
                <HStack style={styles.header} alignItems="center" space={10} >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>Medical Record</Text>

                </HStack>

                <VStack space={3} style={{ justifyContent: "flex-start", alignItems: "flex-start", marginHorizontal: 15, marginVertical: 10 }}>

                    <HStack space={2} style={{ alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.primary }}>{record.type}</Text>
                        {/* <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.primary }}>{record.recordId}</Text> */}
                    </HStack>
                    <BoldText
                        color={Colors.dark}
                        size={14}
                        text={record.data.note}
                    />
                    <HStack space={2} style={{ alignItems: "center" }}>
                        <Text>{formatDate(record.created_at)}</Text>
                        <Text>|</Text>
                        <Text>{record.data.diagnosedBy}</Text>
                    </HStack>
                </VStack>

                <FlatList
                    data={record.data.files}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    width: '45%',
                                    margin: 10,
                                    aspectRatio: 1,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    backgroundColor: "lightgrey",
                                }}
                                onPress={() => handleImagePreview(item)}
                            >
                                <Image
                                    source={{ uri: `${FileUrl}${item}` }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'cover',
                                        // opacity: 0.2
                                    }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginHorizontal: 10
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                        return loading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text style={{ textAlign: "center", marginTop: 20 }} >No medical records found</Text>
                    }}

                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={async () => {
                            const check_consent_token = await AsyncStorage.getItem("consent_token")
                            if (check_consent_token == null) {
                                RequestConsentTokenHandler()
                            } else {
                                handleFetchMedicalRecords(check_consent_token)
                            }
                        }} />
                    }
                />




            </SafeAreaView>
            {/* Image Preview Modal */}
            <Modal
                visible={!!previewImage}
                transparent={true}
                onRequestClose={closeImagePreview}
            >
                <View style={styles.imagePreviewOverlay}>
                    <TouchableOpacity
                        style={styles.closePreviewButton}
                        onPress={closeImagePreview}
                    >
                        <CloseIcon size={30} color={Colors.white} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: `${FileUrl}${previewImage}` }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
            <Loader loading={loading} text={loadingText} />
        </>
    );
};

export default ViewRecordUI;

const styles = StyleSheet.create({
    header: {
        marginBottom: 30,
        marginHorizontal: 15,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    banner: {
        height: 120,
        backgroundColor: Colors.accent,
        marginHorizontal: 15,
        marginVertical: 10,
        position: "relative",
        borderRadius: 10,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    cardButton: {
        // backgroundColor: Colors.dark,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    // ================================
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: "95%",
        // height: 300,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    otpInput: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 10,
    },

    imagePreviewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closePreviewButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
});
