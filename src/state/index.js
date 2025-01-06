import React, { useState, useContext, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV instance
const storage = new MMKV();



const AppContext = React.createContext();

export const appState = () => useContext(AppContext);


export const AppProvider = ({ children }) => {

    const [User, setUser] = useState(null);
    const [Initialized, setInitialized] = useState(null);
    const [Transactions, setTransactions] = useState([]);
    const [isBiometric, setisBiometric] = useState(false);

    // Load profile from MMKV on app start
    useEffect(() => {
        const loadProfile = () => {
            try {
                const storedProfile = storage.getString('userProfile');
                const storedUUID = storage.getString('uuid');
                const storedisBiometric = storage.getString('isBiometric');

                if (storedProfile) {
                    setUser(JSON.parse(storedProfile));
                }
                if (storedUUID) {
                    setInitialized(storedUUID);
                }
                if (storedisBiometric) {
                    storedisBiometric(storedisBiometric);
                }
            } catch (error) {
                console.error('Failed to load profile from storage:', error);
            }
        };

        loadProfile();
    }, []);


    // const login = (userData) => {
    //     setUser(userData);
    // };

    const BiometricAuth = (state) => {
        try {
            storage.set('isBiometric', state);
            setisBiometric(state)
        } catch (error) {
            console.error('Failed to save profile to storage:', error);
        }
    };

    const Initialize = (uuid) => {
        try {
            storage.set('uuid', uuid);
            setInitialized(uuid)
        } catch (error) {
            console.error('Failed to save profile to storage:', error);
        }
    }





    // Save profile to MMKV whenever it changes
    const login = (newProfile) => {
        try {
            storage.set('userProfile', JSON.stringify(newProfile));
            setUser(newProfile);
        } catch (error) {
            console.error('Failed to save profile to storage:', error);
        }
    };

    // Clear profile (for logout functionality)
    const logout = () => {
        try {
            storage.delete('userProfile');
            setUser(null);
        } catch (error) {
            console.error('Failed to clear profile:', error);
        }
    };


    // save transactions
    const SaveTrxn = (data) => {
        try {
            storage.set('transactions', JSON.stringify(data));
            setTransactions(data);
        } catch (error) {
            console.error('Failed to clear profile:', error);
        }
    };

    return (
        <AppContext.Provider value={{
            User,
            login,
            logout,
            Initialize,
            Initialized,
            SaveTrxn,
            Transactions,
            BiometricAuth,
            isBiometric
        }}>
            {children}
        </AppContext.Provider>
    );
};