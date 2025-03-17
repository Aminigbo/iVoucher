import { Alert } from "react-native"
import { CreateTokenService, DeactivateTokenService, FetchAllUserActiveTokenService, ResolveTokenService } from "./voucher-models"

// Generate voucher
export function createVoucherController(setLoading, login, User, { amount, duration, isExpiry, Remark }, handleFetchVoucher, setVouchers) {
    setLoading(true)
    CreateTokenService({
        user: User.id,
        amount,
        expiry: isExpiry,
        Remark,
        duration
    })
        .then(response => {
            setLoading(false)
            if (response.success == false) {
                return Alert.alert("Error", response.message)
            }
            login({
                ...User,
                ...response.data
            })
            handleFetchVoucher(setVouchers)
            Alert.alert("Success", response.message)

        })
        .catch(error => {
            setLoading(false)
        })
}

// Fetch all vouchers
export function fetchVoucherController(setLoading, Vouchers, User) {
    // setLoading(true)
    FetchAllUserActiveTokenService(User.id)
        .then(response => {
            setLoading(false)
            if (response.success == false) {
                return Alert.alert("Error", response.message)
            }
            Vouchers(response.data)

        })
        .catch(error => {
            setLoading(false)
        })
}

// delete token
export function deleteVoucherController(setLoading, voucher, handleFetchVoucher, setVouchers) {
    setLoading(true)
    DeactivateTokenService(voucher)
        .then(response => {
            setLoading(false)
            if (response.success == false) {
                return Alert.alert("Error", response.message)
            }

            handleFetchVoucher(setVouchers)
            Alert.alert("Success", response.message)

        })
        .catch(error => {
            setLoading(false)
        })
}

// resolve token
export function resolveVoucherController(setLoading, voucher, user, setVouchers, handleFetchVoucher) {
    setLoading(true)
    ResolveTokenService(voucher, user)
        .then(response => {
            setLoading(false)
            if (response.success == false) {
                return Alert.alert("Error", response.message)
            }

            Alert.alert("Success", response.message)
            handleFetchVoucher(setVouchers)

        })
        .catch(error => {
            setLoading(false)
        })
}