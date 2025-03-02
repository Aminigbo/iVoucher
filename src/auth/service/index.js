import { BaseURL } from "../../utilities";


export async function LoginService(email, password, fcmToken) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "password": password,
        "fcmToken": fcmToken
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/login`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function RegisterService({ email, phone, name, pwd1, fcmToken, lastName }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "firstName": name,
        "lastName": lastName,
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
        const response = await fetch(`${BaseURL}auth/sign-up`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function VerifyAccountService(uuid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uuid": uuid,
        "data": {
            "isVerified": true
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/verify-otp`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function RequestOtpService(email) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "name": ""
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/requet-otp`, requestOptions);
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
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    // console.log("Getting user")

    try {
        const response = await fetch(`${BaseURL}auth/get-user-by-uuid/${user}`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
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

export async function ChangePasswordAlt(email, password, password3, uuid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "password": password,
        "password3": password3,
        "uuid": uuid
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/change-pwd-alt`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function UpdateKycModel(user, gender, address, bvn, email, name, phone, state, city, country, zipCode) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "name": name,
        "bvn": bvn,
        "user": user,
        "gender": gender,
        "address": address,
        "phone": phone,
        "state": state,
        "city": city,
        "country": country,
        "zipCode": zipCode
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}korapay/create-virtual-account`, requestOptions);
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
        "account": "1110029569",  // account,
        "name": name,

        "email": email,
        "name": name,
        "id": id,
        "receiver": receiver,
        "bank_name": bank_name,
        "bankLogo": bankLogo
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
export async function ConversionRateService(amount,type) {
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
export async function FundCardService(amount, chargeAmount, card_ref, user) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "card_ref": card_ref,
        "user": user,
        "amount": amount,
        "chargeAmount": chargeAmount
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw
    };

    try {
        const response = await fetch(`${BaseURL}korapay/card/fund`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// withdraw from card
export async function CardWithdrawalService(amount,user,card_ref) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ 
        "user": user,
        "amount": amount, 
        "card_ref": card_ref
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