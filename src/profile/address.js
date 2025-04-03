import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text, Box, VStack, Input, ScrollView, HStack } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../global-components/icons";
import { Color } from "../global-components/colors";
import { appState } from "../state";
const Colors = Color()
const Address = ({ navigation }) => {
    const { User } = appState()
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA", padding: 16 }}>
            {console.log(User)}
            <HStack alignItems="center" justifyContent="flex-start" space={5} mb={10} >
                <TouchableOpacity onPress={() => navigation.replace("Onboarding")}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={Styles.headerText}>Address Details</Text>
            </HStack>
            <ScrollView>
                <VStack space={4}>
                    {/* State */}
                    <Box style={Styles.box} >
                        <Text fontSize="lg" color="gray.500">Country</Text>
                        <TextInput style={Styles.input} aria-disabled bg="gray.100" value={User.country} />
                    </Box>
                    {/* LGA */}
                    <Box style={Styles.box}>
                        <Text fontSize="lg" color="gray.500">State</Text>
                        <TextInput style={Styles.input} isReadOnly bg="gray.100" value={User.state} />
                    </Box>

                    {/* Area */}
                    <Box style={Styles.box}>
                        <Text fontSize="lg" color="gray.500">City</Text>
                        <TextInput style={Styles.input} isReadOnly bg="gray.100" value={User.city} />
                    </Box>

                    {/* Landmark */}
                    <Box style={Styles.box}>
                        <Text fontSize="lg" color="gray.500">Postal Code</Text>
                        <TextInput style={Styles.input} isReadOnly bg="gray.100" value={User.zipCode} />
                    </Box>

                    {/* Address */}
                    <Box style={Styles.box}>
                        <Text fontSize="lg" color="gray.500">Address</Text>
                        <TextInput style={Styles.input} isReadOnly bg="gray.100" value={User.address} />
                    </Box>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Address;

const Styles = StyleSheet.create({
    box: {
        marginVertical: 8,
    },
    input: {
        backgroundColor: "gray.100",
        borderRadius: 6,
        padding: 13,
        fontSize: 18,
        color: "gray",
        borderWidth: 0.5,
        borderColor:"lightgray",
        backgroundColor: Colors.accent,
    },
    headerText: { fontSize: 20, fontWeight: 'bold' },
})