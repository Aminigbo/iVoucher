import { BaseURL } from "../../utilities";

export async function AddMerchantService(payload) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "payload": payload
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/add-merchant`, requestOptions);
        const result_1 = await response.text();
        console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function RemoveMerchantService(user, merchant, address) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "merchant": merchant,
        "address": address
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/remove-merchant`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function CreateTokenService({
    user, amount, merchant, walletAdress, expiry
}) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "amount": amount,
        "merchant": merchant,
        "walletAdress": walletAdress,
        "expiry": expiry, 
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/create-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function FetchActiveTokenService({
    user, walletAdress
}) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "walletAdress": walletAdress,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/fetch-active-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function FetchAllUserActiveTokenService({
    user
}) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user, 
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/fetch-All-user-active-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function DeactivateTokenService(token) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "token": token,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/reverse-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function ResolveTokenService(token, user) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "token": token,
        "user": user,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/resolve-token`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

// get scanned data
export async function GetScannedDataService(scannedToken) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "scannedToken": scannedToken,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/get-scanned-data`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


// proceed to scan-to-pay
export async function ScanToPayService({ payer, receiver, amount, merchant }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "payer": payer,
        "receiver": receiver,
        "amount": amount,
        "merchant": merchant,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    console.log("Reached here")

    try {
        const response = await fetch(`${BaseURL}user/scan-to-pay`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function TopUpService({
    amount, user, data, merchant
}) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "amount": amount,
        "user": user,
        "merchant": merchant,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/topup-merchant`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}
