import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, Box, VStack, HStack, Alert, Center, Divider, Stack } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { BackIcon } from '../global-components/icons';
import { BoldText } from '../global-components/texts';
import { Color } from '../global-components/colors';
import { appState } from '../state';
import { NumberWithCommas } from '../utilities';
import { Loader } from '../global-components/loader';
import { ArrowDownUp, DollarSign, CreditCard, CheckCircle } from 'lucide-react-native';

const Colors = Color();

const ClaimCard = ({ navigation }) => {
    const [conversionRate, setConversionRate] = useState(null);
    const { User, Loading, loadingText, ConversionRate, CreateCard, GetCardDetails } = appState();

    const fetchConversionRate = useCallback(() => {
        ConversionRate(5000, setConversionRate);
    }, [ConversionRate]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchConversionRate);
        return unsubscribe;
    }, [navigation, fetchConversionRate]);

    const handleProceed = useCallback(() => {
        CreateCard(conversionRate.rate * 5, navigation);
    }, [conversionRate, CreateCard, GetCardDetails, navigation]);

    const formattedAmount = useMemo(() =>
        conversionRate ? NumberWithCommas(conversionRate.rate * 5) : '...',
        [conversionRate]
    );

    if (!User) {
        navigation.replace("Login");
        return null;
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Stack>
                    <HStack style={styles.header} alignItems="center" space={10} >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Claim Card</Text>
                    </HStack>

                    {User.accountHolderReference && !User.card && (
                        <Center pt={10}>
                            <Alert maxW="400" status="info" colorScheme="info" style={styles.alert}>
                                <VStack space={2}>
                                    <HStack alignItems="center">
                                        <CheckCircle color={Colors.primary} />
                                        <Text fontSize="md" fontWeight="medium" color={Colors.dark}>
                                            You're all set to claim your card
                                        </Text>
                                    </HStack>
                                    <Box pl={6} color={Colors.dark}>
                                        There is a $2 fee to create a virtual USD card and a minimum of $3 is required to fund your card.
                                    </Box>
                                </VStack>
                            </Alert>
                        </Center>
                    )}

                    {conversionRate && (
                        <VStack space={2} py={5} style={{
                            marginTop: 50
                        }} >
                            <HStack space={5} alignItems="center">
                                <ArrowDownUp color={Colors.primary} />
                                <Text fontSize="md">$1 = {conversionRate.to_currency} {conversionRate.rate}</Text>
                            </HStack>
                            <HStack space={5} alignItems="center">
                                <DollarSign color={Colors.primary} />
                                <Text fontSize="md">Creation fee: $2</Text>
                            </HStack>
                            <HStack space={5} alignItems="center">
                                <CreditCard color={Colors.primary} />
                                <Text fontSize="md">Min. card top-up: $3</Text>
                            </HStack>
                            <Divider my={7} />
                            <Center>
                                <Text fontSize="md">You will be charged $5 ≈ ₦{formattedAmount}</Text>
                            </Center>
                        </VStack>
                    )}

                </Stack>

                <TouchableOpacity onPress={handleProceed} style={styles.proceedButton}>
                    <BoldText text="Proceed" color="#fff" />
                </TouchableOpacity>

            </SafeAreaView>
            <Loader loading={Loading} text={loadingText} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 15,
        justifyContent: "space-between"
    },
    header: {
        marginBottom: 30
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    alert: {
        backgroundColor: Colors.accent,
        width: "100%"
    },
    proceedButton: {
        width: "95%",
        alignSelf: "center",
        borderRadius: 10,
        paddingVertical: 17,
        alignItems: "center",
        backgroundColor: Colors.dark,
        marginVertical: 20
    }
});

export default ClaimCard;
