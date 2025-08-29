import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Color } from '../global-components/colors';
import { appState } from '../state';
import { BackIcon } from '../global-components/icons';
import { HStack } from 'native-base';

const Colors = Color();

function CardLimit({ navigation }) {
    // State for transactions and loading
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    // Get user context
    const { User, Transactions } = appState();

    // Calculate transaction volumes
    const transactionVolumes = useMemo(() => {
        if (!Transactions || Transactions.length === 0) return { inward: 0, outward: 0 };

        const inwardTransactions = Transactions.filter(t =>
            t.type === 'BANK-PAYOUT' || t.type === 'INWARD'
        );
        const outwardTransactions = Transactions.filter(t =>
            t.type === 'PV-PAYOUT' || t.type === 'OUTWARD'
        );

        const totalInward = inwardTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalOutward = outwardTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
            inward: totalInward.toLocaleString(),
            outward: totalOutward.toLocaleString()
        };
    }, [Transactions]);

    // Card transaction limit (mock data, replace with actual backend data)
    const cardLimit = {
        daily: '50,000',
        monthly: '500,000'
    };

    return (
        <SafeAreaView style={styles.container}>
            <HStack style={styles.header} alignItems="center" space={10} >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.dark }}>Card Limits</Text>
            </HStack>

            <ScrollView> 

                <View style={styles.section}>
                    {/* <Text style={styles.sectionTitle}>Card Transaction Limits</Text> */}
                    <View style={styles.limitContainer}>
                        <View style={styles.limitItem}>
                            <Text style={styles.limitLabel}>Daily Limit</Text>
                            <Text style={styles.limitValue}>₦{cardLimit.daily}</Text>
                        </View>
                        <View style={styles.limitItem}>
                            <Text style={styles.limitLabel}>Monthly Limit</Text>
                            <Text style={styles.limitValue}>₦{cardLimit.monthly}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 15,
    },
    section: {
        backgroundColor: Colors.white,
        margin: 15,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark,
        marginBottom: 15,
    },
    volumeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    volumeItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    volumeLabel: {
        color: Colors.dark,
        fontSize: 14,
        marginBottom: 5,
    },
    volumeValue: {
        color: Colors.primaryLight,
        fontSize: 16,
        fontWeight: 'bold',
    },
    limitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    limitItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.accent,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    limitLabel: {
        color: Colors.dark,
        fontSize: 14,
        marginBottom: 5,
    },
    limitValue: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        marginBottom: 30
    },
});

export default React.memo(CardLimit);
