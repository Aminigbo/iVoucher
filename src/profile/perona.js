import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text, Box, VStack, HStack, Divider, Avatar, ScrollView, Image } from "native-base";
import { Copy, Medal, ChevronRight, Camera, CheckCheck, CheckCheckIcon, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";
import { DpUrl, ImagePicker } from "../utilities";
import { Color } from "../global-components/colors";
import { appState } from "../state";
import { Loader } from "../global-components/loader";
const Colors = Color()
const Persona = ({ navigation }) => {
    const [PickedImage, setPickedImage] = React.useState({ status: false })

    const { updateProfilePhoto, User, Loading } = appState()

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA", padding: 16 }}>
                {/* {console.log(User.gender)} */}
                <HStack alignItems="center" justifyContent="flex-start" space={5} mb={10} >
                    <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={Styles.headerText}>Personal Information</Text>
                </HStack>

                <ScrollView>
                    {/* Profile Card */}
                    <Box bg={Colors.accent} borderRadius="md" p={4} shadow={1}>

                        <VStack space={3} alignItems="center">
                            <TouchableOpacity onPress={() => ImagePicker({ setPickedImage, prop: "profile" })}>
                                {User.dp ?
                                    <Avatar
                                        bg="gray.200" size="xl"
                                        source={{ uri: `${DpUrl}${User.dp}` }}
                                    // source={PickedImage.status ? PickedImage.source : `${DpUrl}${User.dp}`}
                                    >
                                        <Avatar.Badge bg="green.500" />
                                    </Avatar>
                                    :
                                    <Avatar
                                        style={{ padding: PickedImage.status ? 10 : 0 }}
                                        source={PickedImage.status ? PickedImage.source : null}
                                        bg="gray.200" size="xl">
                                        <Camera size={24} color="gray" />
                                    </Avatar>
                                }

                            </TouchableOpacity>
                            {PickedImage.status ?
                                <HStack space={30} justifyContent="space-between" w="40%" my={5} >
                                    <TouchableOpacity onPress={() => {
                                        setPickedImage({ status: false })
                                    }}>
                                        <X size={20} color={Colors.danger} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        updateProfilePhoto(PickedImage, setPickedImage)
                                    }}>
                                        <CheckCheckIcon size={20} color={Colors.success} />
                                    </TouchableOpacity>
                                </HStack>
                                :
                                <Text fontSize="lg" bold>{User.firstName}</Text>
                            }

                            {/* Account Info */}
                            <HStack justifyContent="space-between" alignItems="center" w="100%" mt={5} >
                                <Text fontSize="md" color="gray.500">Pocket Voucher</Text>
                                <HStack alignItems="center">
                                    <Text fontSize="md" bold>{User.phone}</Text>
                                    <TouchableOpacity>
                                        <Copy size={18} color="gray" style={{ marginLeft: 8 }} />
                                    </TouchableOpacity>
                                </HStack>
                            </HStack>

                            <HStack justifyContent="space-between" alignItems="center" w="100%" mt={5} >
                                <Text fontSize="md" color="gray.500">Account Type</Text>
                                <HStack alignItems="center">
                                    <Medal size={18} color="orange" />
                                    <Text fontSize="md" bold color="orange.500" style={{ marginLeft: 4 }}> User Account</Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Personal Details */}
                    <Box bg={Colors.accent} borderRadius="md" p={4} mt={4} shadow={1}>
                        <VStack space={3}>
                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Full Name</Text>
                                <Text bold color="gray.500">{`${User.firstName} ${User.lastName}`}</Text>
                            </HStack>
                            <Divider style={Styles.divider} />

                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Mobile Number</Text>
                                <Text bold color="gray.500">+234{User.phone}</Text>
                            </HStack>
                            <Divider style={Styles.divider} />

                            {/* <TouchableOpacity>
                                <HStack justifyContent="space-between">
                                    <Text color="gray.500">Nickname</Text>
                                    <Text bold color="gray.500">Enter Nickname</Text>
                                </HStack>
                            </TouchableOpacity>
                            <Divider style={Styles.divider} /> */}

                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Gender</Text>
                                <Text bold color="gray.500">{User.gender}</Text>
                            </HStack>
                            <Divider style={Styles.divider} />

                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Date of Birth</Text>
                                <Text bold color="gray.500">{User.dob ? `${User.dob.slice(0, 10)}` : "N/A"}</Text>
                            </HStack>
                            <Divider style={Styles.divider} />

                            <HStack justifyContent="space-between">
                                <Text color="gray.500">Email</Text>
                                <Text bold color="gray.500">{User.email}</Text>
                            </HStack>
                            <Divider style={Styles.divider} />

                            <TouchableOpacity onPress={() => navigation.navigate("Address")}>
                                <HStack justifyContent="space-between">
                                    <Text color="gray.500">Address</Text>
                                    <ChevronRight size={18} color="gray" />
                                </HStack>
                            </TouchableOpacity>

                            <Divider style={Styles.divider} />

                            <TouchableOpacity onPress={() => navigation.navigate("MerchantQr")}>
                                <HStack justifyContent="space-between">
                                    <Text color="gray.500">Merchant page</Text>
                                    <ChevronRight size={18} color="gray" />
                                </HStack>
                            </TouchableOpacity>
                        </VStack>
                    </Box>
                </ScrollView>
            </SafeAreaView>
            <Loader loading={Loading} />

        </>
    );
};

export default Persona;

const Styles = StyleSheet.create({
    divider: {
        height: 0.4,
        marginVertical: 10,
        backgroundColor: "lightgrey"
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
});
