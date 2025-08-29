import { doc, getDoc } from "firebase/firestore";
import { BaseURL } from "../../utilities";
import { getFirestore } from "firebase/firestore";
import App from "../../../App";
const db = getFirestore(App);

export async function VerifyKYCService(id, address, dob, gender, country, state, city, email, phone, name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uid": id,
        "address": address,
        "dob": dob,
        "gender": gender,
        "country": country,
        "state": state,
        "city": city,
        "email": email,
        "phone": phone,
        "name": name
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/verify-kyc`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function RegisterService({ email, phone, name, pwd1, fcmToken }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": name,
        "email": email, 
        "phone": phone,
        "password": pwd1,
        "fcmToken": fcmToken
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/signup`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function VerifyAccountService(signedOtp, OTP, uid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "signedOtp": signedOtp,
        "OTP": OTP,
        "uid": uid
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/verify-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function RequestOtpService(email, uid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "uid": uid
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/request-otp`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function ResetPwdService(password, user) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "password": password,
        "uuid": user
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/reset-password`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function FetchUserInfoService(user) {
    try {
        // Correctly fetch user document from Firestore
        const userDocRef = doc(db, "users", user);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) return userDocSnap.data()

        throw new Error("User not found")
    } catch (error) {
        console.error("Error fetching user document:", error);
        throw error;
    }
}

// get all users
export async function FetchAllUsersService() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    // console.log("Getting user")

    try {
        const response = await fetch(`${BaseURL}auth/get-all-users`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function DeleteAccountService(uuid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uuid": uuid
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/delete-account`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function ChangePasswordAlt(newPassword, uuid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({  
        "newPassword": newPassword,
        "uid": uuid
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/change-password`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}




// update NIN Model
export async function UpdateNINModel(user, nin, yy, mm, dd, email, phone, Img, base64) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "nin": nin,
        "yy": yy,
        "mm": mm,
        "dd": dd,
        "email": email,
        "phone": phone,
        "user": user,
        "Img": Img,
        "base64": base64
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/card/cardholders`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function FetchTransactionModel(user, account_number) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/retrieve-all-virtual-account-transactions/${user}/${account_number}`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function FetchBanksModel() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/payout/bank-codes`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function ResolveBankModel(bank, account) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "bank": bank,
        "account": account,
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/payout/verify-bank-account`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function InitiatePayout({ payoutType, amount, naration, bankCode, account, name, email, id, accountName, receiver, bank_name, bankLogo }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "payoutType": payoutType,
        "amount": amount,
        "naration": naration,

        "bank": bankCode,
        "account": account,
        "name": name,

        "email": email,
        "name": name,
        "id": id,
        "receiver": receiver,
        "bank_name": bank_name,
        "bankLogo": bankLogo,
        "accountName": accountName
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/transactions/disburse`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function FetchTransactionHistoryModel(type, ref) {
    // console.log(type)
    // console.log(ref)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/transactions/status/${type}/${ref}`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// get conversion rate
export async function ConversionRateService(amount, type) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "amount": amount,
        "type": type
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/conversions/rate`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function CreateCardService(card_holder_reference, user, amount) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "card_holder_reference": card_holder_reference,
        "user": user,
        "amount": amount
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/card/create`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// get card details
export async function GetCardDetailsHistoryModel(reference) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/card/${reference}`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// fund card
export async function FundCardService(amount, card_number, uid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "amount": amount,
        "card_number": card_number,
        "uid": uid
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}medicard/fund-medicard`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// withdraw from card
export async function CardWithdrawalService(amount, user, card_ref, destination) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "amount": amount,
        "card_ref": card_ref,
        "destination": destination
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/card/withdraw`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}