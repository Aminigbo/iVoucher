import { BaseURL } from "../../utilities";

export async function FetchTransactionsModel(user) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ 
        "user": user
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/fetch-transactions`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
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

 

export async function CreatePinController({ user, pin }) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "user": user,
        "pin": pin
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`${BaseURL}user/create-pin`, requestOptions);
        const result_1 = await response.text();
        // console.log(result_1)
        const data = JSON.parse(result_1)
        return data;
    } catch (error) {
        return error;
    }
}