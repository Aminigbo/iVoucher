import React, { useContext, useEffect, useRef, useMemo, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { 
  ConversionRateController, 
  CreateCardController, 
  FetcAllBanksController, 
  FetchAllTransactions, 
  FetchTransactionHistorycController, 
  FundCardController, 
  GetCardDetailsController, 
  InitiatePayoutController, 
  ResolveBankController, 
  UpdateKycController, 
  UpdateNINController, 
  WithdrawCardController 
} from '../auth/controllers';
import { FetcAllhUsers } from '../helpers/user';
import { 
  createVoucherController, 
  deleteVoucherController, 
  fetchVoucherController, 
  resolveVoucherController 
} from '../services/voucher/voucher-controllers';
import { UpdateProfilePhoto } from '../services/user/controllers';

// Initialize MMKV instance
const storage = new MMKV();

// Initialize contexts with default values
const AppStateContext = React.createContext({
  User: null,
  Initialized: null,
  Transactions: [],
  AllBanks: [],
  isBiometric: false,
  Loading: false,
  loadingText: "",
  SelectedBank: null,
  AllUsers: []
});

const AppActionsContext = React.createContext({
  login: () => console.warn('No provider found'),
  logout: () => console.warn('No provider found'),
  Initialize: () => console.warn('No provider found'),
  BiometricAuth: () => console.warn('No provider found'),
  SaveTrxn: () => console.warn('No provider found'),
  SaveBanks: () => console.warn('No provider found'),
  SelectBank: () => console.warn('No provider found'),
  GetAllBanks: () => console.warn('No provider found'),
  GetAllUsers: () => console.warn('No provider found'),
  GetAllTransactions: () => console.warn('No provider found'),
  GetAllVirtualAccountTransactions: () => console.warn('No provider found'),
  VerifyKYC: () => console.warn('No provider found'),
  VerifyNIN: () => console.warn('No provider found'),
  ResolveBank: () => console.warn('No provider found'),
  InitiatePayout: () => console.warn('No provider found'),
  CreateCard: () => console.warn('No provider found'),
  ConversionRate: () => console.warn('No provider found'),
  GetCardDetails: () => console.warn('No provider found'),
  FundCard: () => console.warn('No provider found'),
  CardWithdrawal: () => console.warn('No provider found'),
  handleCreateVoucher: () => console.warn('No provider found'),
  handleFetchVoucher: () => console.warn('No provider found'),
  handleDeactivateToken: () => console.warn('No provider found'),
  handleResolveToken: () => console.warn('No provider found'),
  updateProfilePhoto: () => console.warn('No provider found')
});

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppActionsContext);
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // State that needs to trigger re-renders
  const [User, setUser] = useState(null);
  const [Initialized, setInitialized] = useState(null);
  const [Transactions, setTransactions] = useState([]);
  const [AllBanks, setAllBanks] = useState([]);
  const [isBiometric, setisBiometric] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [SelectedBank, setSelectedBank] = useState(null);
  const [AllUsers, setAllUsers] = useState([]);

  // Refs for values that don't need to trigger re-renders
  const loadingRef = useRef(Loading);
  const userRef = useRef(User);
  const initializedRef = useRef(Initialized);
  const transactionsRef = useRef(Transactions);
  const allBanksRef = useRef(AllBanks);
  const isBiometricRef = useRef(isBiometric);
  const loadingTextRef = useRef(loadingText);
  const selectedBankRef = useRef(SelectedBank);
  const allUsersRef = useRef(AllUsers);

  // Sync refs with state
  useEffect(() => {
    loadingRef.current = Loading;
    userRef.current = User;
    initializedRef.current = Initialized;
    transactionsRef.current = Transactions;
    allBanksRef.current = AllBanks;
    isBiometricRef.current = isBiometric;
    loadingTextRef.current = loadingText;
    selectedBankRef.current = SelectedBank;
    allUsersRef.current = AllUsers;
  }, [Loading, User, Initialized, Transactions, AllBanks, isBiometric, loadingText, SelectedBank, AllUsers]);

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
          setisBiometric(storedisBiometric === 'true');
        }
        if (storedisBanks) {
          setAllBanks(JSON.parse(storedisBanks));
        }
        if (storedSelectedBank) {
          setSelectedBank(JSON.parse(storedSelectedBank));
        }
      } catch (error) {
        console.error('Failed to load profile from storage:', error);
      }
    };

    loadProfile();
    actions.GetAllBanks();
    actions.GetAllUsers();
  }, []);

  // Memoized actions
  const actions = useMemo(() => {
    const login = (newProfile) => {
      try {
        storage.set('userProfile', JSON.stringify(newProfile));
        setUser(newProfile);
      } catch (error) {
        console.error('Failed to save profile to storage:', error);
      }
    };

    const logout = () => {
      try {
        storage.delete('userProfile');
        setUser(null);
      } catch (error) {
        console.error('Failed to clear profile:', error);
      }
    };

    const Initialize = (uuid) => {
      try {
        storage.set('uuid', uuid);
        setInitialized(uuid);
      } catch (error) {
        console.error('Failed to save profile to storage:', error);
      }
    };

    const BiometricAuth = (state) => {
      try {
        storage.set('isBiometric', state.toString());
        setisBiometric(state);
      } catch (error) {
        console.error('Failed to save profile to storage:', error);
      }
    };

    const SaveTrxn = (data) => {
      try {
        storage.set('transactions', JSON.stringify(data));
        setTransactions(data);
      } catch (error) {
        console.error('Failed to save transactions:', error);
      }
    };

    const SaveBanks = (data) => {
      try {
        storage.set('Banks', JSON.stringify(data));
        setAllBanks(data);
      } catch (error) {
        console.error('Failed to save banks:', error);
      }
    };

    const SelectBank = (data) => {
      try {
        storage.set('SelectedBank', JSON.stringify(data));
        setSelectedBank(data);
      } catch (error) {
        console.error('Failed to save selected bank:', error);
      }
    };

    const GetAllBanks = () => {
      setLoading(true);
      FetcAllBanksController(
        (isLoading) => setLoading(isLoading),
        SaveBanks
      );
    };

    const GetAllUsers = () => {
      FetcAllhUsers(setAllUsers);
    };

    const GetAllTransactions = () => {
      setLoading(true);
      FetchAllTransactions(
        userRef.current?.id,
        SaveTrxn,
        (isLoading) => setLoading(isLoading)
      );
    };

    const GetAllVirtualAccountTransactions = (account_number) => {
      setLoading(true);
      FetchTransactionHistorycController(
        (isLoading) => setLoading(isLoading),
        login,
        userRef.current?.id,
        account_number
      );
    };

    const VerifyKYC = (data, setModalVisible) => {
      setLoading(true);
      let name = userRef.current?.firstName + " " + userRef.current?.lastName;
      UpdateKycController(
        (isLoading) => setLoading(isLoading),
        login,
        userRef.current?.id,
        data,
        userRef.current?.email,
        name,
        userRef.current?.phone,
        userRef.current,
        setModalVisible
      );
    };

    const VerifyNIN = (data, setclaimCard, navigation) => {
      setLoading(true);
      let name = userRef.current?.firstName + " " + userRef.current?.lastName;
      UpdateNINController(
        (isLoading) => setLoading(isLoading),
        login,
        userRef.current?.id,
        data,
        userRef.current?.email,
        name,
        userRef.current?.phone,
        userRef.current,
        setclaimCard,
        navigation
      );
    };

    const ResolveBank = (bank, account, setAccountHolder, setEnterAmountPop, SelectedBank, navigation) => {
      setLoading(true);
      ResolveBankController(
        (isLoading) => setLoading(isLoading),
        bank,
        account,
        setAccountHolder,
        setEnterAmountPop,
        SelectedBank,
        navigation
      );
    };

    const InitiatePayout = ({ payoutType, amount, naration, bankCode, account, accountName, receiver, bank_name, navigation, bankLogo }) => {
      setLoading(true);
      let name = userRef.current?.firstname + " " + userRef.current?.lastname;
      SelectBank(null);
      InitiatePayoutController({
        setLoading: (isLoading) => setLoading(isLoading),
        payoutType,
        amount,
        naration,
        bankCode,
        account,
        name,
        email: userRef.current?.email,
        id: userRef.current?.id,
        accountName,
        receiver,
        bank_name,
        navigation,
        GetAllTransactions,
        bankLogo
      });
    };

    const CreateCard = (amount, navigation) => {
      setLoading(true);
      CreateCardController(
        (isLoading) => setLoading(isLoading),
        userRef.current?.id,
        userRef.current?.accountHolderReference,
        login,
        userRef.current,
        amount,
        navigation
      );
    };

    const ConversionRate = (amount, setResponse, setclaimCard, setbottomSheetType, type) => {
      setLoading(true);
      ConversionRateController(
        (isLoading) => setLoading(isLoading),
        amount,
        setResponse,
        (text) => setloadingText(text),
        setclaimCard,
        setbottomSheetType,
        type
      );
    };

    const GetCardDetails = (setCardInfo, setclaimCard, setbottomSheetType) => {
      setLoading(true);
      GetCardDetailsController(
        (isLoading) => setLoading(isLoading),
        userRef.current?.card?.reference,
        setCardInfo,
        setclaimCard,
        setbottomSheetType
      );
    };

    const FundCard = (amount, chargeAmount, setCardInfo, fundingSource) => {
      setLoading(true);
      FundCardController(
        (isLoading) => setLoading(isLoading),
        amount,
        chargeAmount,
        userRef.current?.card?.reference,
        (text) => setloadingText(text),
        userRef.current?.id,
        setCardInfo,
        GetCardDetails,
        login,
        userRef.current,
        GetAllTransactions,
        fundingSource
      );
    };

    const CardWithdrawal = (amount, card_ref, setCardInfo, setclaimCard, setbottomSheetType) => {
      setLoading(true);
      WithdrawCardController(
        (isLoading) => setLoading(isLoading),
        (text) => setloadingText(text),
        login,
        userRef.current,
        amount,
        card_ref,
        GetCardDetails,
        setCardInfo,
        GetAllTransactions,
        setclaimCard,
        setbottomSheetType
      );
    };

    const handleCreateVoucher = (data, setVouchers) => {
      setLoading(true);
      createVoucherController(
        (isLoading) => setLoading(isLoading),
        login,
        userRef.current,
        data,
        handleFetchVoucher,
        setVouchers
      );
    };

    const handleFetchVoucher = (setVouchers) => {
      fetchVoucherController(
        (isLoading) => setLoading(isLoading),
        setVouchers,
        userRef.current
      );
    };

    const handleDeactivateToken = (voucher, setVouchers) => {
      setloadingText("Deactivating voucher");
      setLoading(true);
      deleteVoucherController(
        (isLoading) => setLoading(isLoading),
        voucher,
        handleFetchVoucher,
        setVouchers
      );
    };

    const handleResolveToken = (voucher, setVouchers) => {
      setLoading(true);
      resolveVoucherController(
        (isLoading) => setLoading(isLoading),
        voucher,
        userRef.current?.id,
        setVouchers,
        handleFetchVoucher
      );
    };

    const updateProfilePhoto = (data, setPickedImage, toast, navigation) => {
      UpdateProfilePhoto(data, userRef.current, (isLoading) => setLoading(isLoading), login, setPickedImage);
    };

    return {
      login,
      logout,
      Initialize,
      BiometricAuth,
      SaveTrxn,
      SaveBanks,
      SelectBank,
      GetAllBanks,
      GetAllUsers,
      GetAllTransactions,
      GetAllVirtualAccountTransactions,
      VerifyKYC,
      VerifyNIN,
      ResolveBank,
      InitiatePayout,
      CreateCard,
      ConversionRate,
      GetCardDetails,
      FundCard,
      CardWithdrawal,
      handleCreateVoucher,
      handleFetchVoucher,
      handleDeactivateToken,
      handleResolveToken,
      updateProfilePhoto
    };
  }, []);

  // Memoized state
  const state = useMemo(() => ({
    User,
    Initialized,
    Transactions,
    AllBanks,
    isBiometric,
    Loading,
    loadingText,
    SelectedBank,
    AllUsers
  }), [User, Initialized, Transactions, AllBanks, isBiometric, Loading, loadingText, SelectedBank, AllUsers]);

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  );
};