import { BaseURL, HealthstackKey } from "../../utilities";
// const HealthStackURL = "https://healthstack-server-five.vercel.app/api/v1";
const HealthStackURL = "http://192.168.1.121:3000/api/v1";


export async function FetchTransactionsModel(user) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}medicard/get-notifications/${user}`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        console.log("error", error)
        return error;
    }
}

export async function GetAppConfigService() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/app-configs`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}


export async function SubmitSupportModel(user, message) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "message": message
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/submit-support`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

//  ===========

export async function CreateMedicardController(uid, card_holder, card_type, health_id, card_pin) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uid": uid,
        "card_holder": card_holder,
        "card_type": card_type,
        "health_id": health_id,
        "card_pin": card_pin
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}medicard/create-medicard`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function CreatePinController({ user, pin }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "uid": user,
        "pin": pin
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}auth/create-pin`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function FetchMedicardController(card_number, uid) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch(`${BaseURL}medicard/get-medicard/${card_number}/${uid}`, requestOptions);
        const result_1 = await response.text();
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}

export async function FetchMedicardTransactions(card_number) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${HealthstackKey}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    return fetch(`${HealthStackURL}/medicard/transactions/${card_number}`, requestOptions).then(res => res.json());
}

export async function FetchMedicalRecordsController(health_id, consent_token) {
    // console.log("Here")
    const myHeaders = new Headers();
    myHeaders.append("x-consent-token", consent_token);
    myHeaders.append("Authorization", `Bearer ${HealthstackKey}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    return fetch(`${HealthStackURL}/records/multiple/${health_id}`, requestOptions).then(res => res.json())
}

export async function DeactivateMedicardController(card_number, reason) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${HealthstackKey}`);

    const raw = JSON.stringify({
        "card_number": card_number,
        "reason": reason
    });

    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(`${HealthStackURL}/medicard/deactivate`, requestOptions).then(res => res.json())
}

export async function RequestConsentTokenController(health_id) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${HealthstackKey}`);

    const raw = JSON.stringify({
        "health_id": health_id
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(`${HealthStackURL}/patients/seek-consent`, requestOptions).then(res => res.json())
}

export async function VerifyConsentTokenController(otp, health_id) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${HealthstackKey}`);

    const raw = JSON.stringify({
        "health_id": health_id,
        "otp": otp
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(`${HealthStackURL}/patients/consent`, requestOptions).then(res => res.json())
}