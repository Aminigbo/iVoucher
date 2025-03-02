import React, { useState, useContext, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { ConversionRateController, CreateCardController, FetcAllBanksController, FetchAllTransactions, FetchTransactionHistorycController, FundCardController, GetCardDetailsController, InitiatePayoutController, ResolveBankController, UpdateKycController, UpdateNINController, WithdrawCardController } from '../auth/controllers';
import { FetcAllhUsers } from '../helpers/user';

// Initialize MMKV instance
const storage = new MMKV();



const AppContext = React.createContext();

export const appState = () => useContext(AppContext);


export const AppProvider = ({ children }) => {

    const [User, setUser] = useState(null);
    const [Initialized, setInitialized] = useState(null);
    const [Transactions, setTransactions] = useState([]);
    const [AllBanks, setAllBanks] = useState([]);
    const [isBiometric, setisBiometric] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [loadingText, setloadingText] = useState("");
    const [SelectedBank, setSelectedBank] = useState(null);
    const [AllUsers, setAllUsers] = useState([]);

    // Load profile from MMKV on app start
    useEffect(() => {
        const loadProfile = () => {
            try {
                const storedProfile = storage.getString('userProfile');
                const storedUUID = storage.getString('uuid');
                const storedisBiometric = storage.getString('isBiometric');
                const storedisBanks = storage.getString('Banks');
                const storedSelectedBank = storage.getString('SelectedBank');

                if (storedProfile) {
                    setUser(JSON.parse(storedProfile));
                }
                if (storedUUID) {
                    setInitialized(storedUUID);
                }
                if (storedisBiometric) {
                    storedisBiometric(storedisBiometric);
                }

                if (storedisBanks) {
                    setAllBanks(storedisBanks);
                }
                if (storedSelectedBank) {
                    setSelectedBank(JSON.parse(storedSelectedBank));
                }
            } catch (error) {
                console.error('Failed to load profile from storage:', error);
            }
        };

        loadProfile();
        GetAllBanks();
        GetAllUsers()
    }, []);

    const VerifyKYC = (data, setModalVisible) => {
        setLoading(!Loading)
        let name = User.firstName + " " + User.lastName
        UpdateKycController(setLoading, login, User.id, data, User.email, name, User.phone, User, setModalVisible)
    }

    // Verify NIN
    const VerifyNIN = (data, setclaimCard) => {
        setLoading(!Loading)
        let name = User.firstName + " " + User.lastName
        UpdateNINController(setLoading, login, User.id, data, User.email, name, User.phone, User, setclaimCard)
    }

    // fetch transactions
    const GetAllVirtualAccountTransactions = (account_number) => {
        setLoading(!Loading)
        FetchTransactionHistorycController(setLoading, login, User.id, account_number)
    }

    // fetch all banks
    const GetAllBanks = () => {
        setLoading(!Loading)
        FetcAllBanksController(setLoading, SaveBanks)
    }

    // resolve bank account
    const ResolveBank = (bank, account, setAccountHolder, setEnterAmountPop, SelectedBank) => {
        setLoading(!Loading)
        ResolveBankController(setLoading, bank, account, setAccountHolder, setEnterAmountPop, SelectedBank)
    }

    // initiating payout
    const InitiatePayout = ({ payoutType, amount, naration, bankCode, account, accountName, receiver, bank_name, navigation, bankLogo }) => {
        setLoading(!Loading)
        let name = User.firstname + " " + User.lastname;
        SelectBank(null)
        InitiatePayoutController({ setLoading, payoutType, amount, naration, bankCode, account, name, email: User.email, id: User.id, accountName, receiver, bank_name, navigation, GetAllTransactions, bankLogo })
    }
    // create card
    const CreateCard = (amount) => {
        setLoading(!Loading)
        CreateCardController(setLoading, User.id, User.accountHolderReference, login, User, amount)
    }


    // conversion rate
    const ConversionRate = (amount, setResponse, setclaimCard, setbottomSheetType, type) => {
        setLoading(!Loading)
        ConversionRateController(setLoading, amount, setResponse, setloadingText, setclaimCard, setbottomSheetType, type)
    }

    // get card details
    const GetCardDetails = (setCardInfo, setclaimCard, setbottomSheetType) => {
        setLoading(!Loading)
        GetCardDetailsController(setLoading, User.card.reference, setCardInfo, setclaimCard, setbottomSheetType)
    }

    // fun card
    const FundCard = (amount, chargeAmount, setCardInfo) => {
        setLoading(!Loading)
        FundCardController(setLoading, amount, chargeAmount, User.card.reference, setloadingText, User.id, setCardInfo, GetCardDetails, login, User)
    }

    // withdraw from card
    const CardWithdrawal = (amount, card_ref, setCardInfo) => {
        setLoading(!Loading)
        WithdrawCardController(setLoading, setloadingText, login, User, amount, card_ref, GetCardDetails, setCardInfo)
    }

    // get users
    const GetAllUsers = () => {
        FetcAllhUsers(setAllUsers)
    }


    // fetch transactions
    function GetAllTransactions() {
        FetchAllTransactions(User.id, SaveTrxn)
    }

    //    =======================================

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

    const SaveBanks = (data) => {
        try {
            storage.set('Banks', JSON.stringify(data));
            setAllBanks(data);
        } catch (error) {
            console.error('Failed to clear profile:', error);
        }
    };

    const SelectBank = (data) => {
        try {
            storage.set('SelectedBank', JSON.stringify(data));
            setSelectedBank(data);
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
            AllBanks,
            BiometricAuth,
            isBiometric,
            GetAllBanks,
            VerifyKYC,
            VerifyNIN,
            GetAllVirtualAccountTransactions,
            Loading,
            SelectedBank,
            SelectBank,
            ResolveBank,
            InitiatePayout,
            AllUsers,
            GetAllUsers,
            CreateCard,
            ConversionRate,
            loadingText,
            GetCardDetails,
            FundCard,
            CardWithdrawal
        }}>
            {children}
        </AppContext.Provider>
    );
};