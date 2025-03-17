import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ShareLib from 'react-native-share';

export const BaseURL = "http://192.168.1.121:9090/APP/"   //home
// export const BaseURL = "http://192.168.1.60:9090/APP/"  //office
// export const BaseURL = "http://192.168.39.218:9090/APP/"   //phone  
// export const BaseURL = "http://192.168.104.218:9090/APP/"   //Steawrt 


// export const BaseURL = "https://i-voucher-server.vercel.app//APP/" 


export const formatDate = (inputDate) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const year = date.getFullYear();

  // Define an array to get the month name in the desired format
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get the month in the desired format from the array
  const month = months[date.getMonth()];

  // Get the ordinal suffix for the day (e.g., 1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const ordinalDay = `${day}${getOrdinalSuffix(day)}`;

  // Construct the formatted date string
  const formattedDate = `${ordinalDay} ${month} ${year}`;
  // const formattedDate = `${ordinalDay} ${month}`;

  return formattedDate;
};




export const NumberWithCommas = (x) => {
  // return 4000;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generateRandomString() {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKQRSTUVWXYZ012345678945678934567';
  let result = 'Blake-';

  for (let i = 0; i < 4; i++) {
    result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }

  return result;
}


export const onShareToken = async (token) => {
  try {
    await ShareLib.open({
      message: token,
    });
  } catch (error) {
    console.log("Image deleted from cache");
  }
};

// export async function ImagePicker({
//   setPickedImage, prop
// }) { 

//   const options = {
//     storageOptions: {
//       path: "images",
//       mediaType: "photo"
//     },
//     includeBase64: true,
//     quality: 0.7
//   }
//   launchImageLibrary(options, response => { 

//     if (response.didCancel) {
//       console.log("Here")
//     } else if (response.error) {
//       console.log("Here")
//     } else if (response.customButton) {
//       console.log(response.customButton)
//     } else {
//       const source = {
//         uri: response.assets[0].uri
//       }


//       const fileExt = response.assets[0].uri.substring(response.assets[0].uri.lastIndexOf(".") + 1);
//       const fileName = `${Math.random()}.${fileExt}`;
//       var formData = new FormData();
//       formData.append("files", {
//         uri: response.assets[0].uri,
//         name: fileName,
//         type: `image/${fileExt}`
//       })

//       // console.log(formData)
//       setPickedImage({
//         source,
//         fileName,
//         formData,
//         height: response.assets[0].height,
//         width: response.assets[0].width,
//         status: true,
//         type: prop
//       })

//     }
//   })

// }

export async function ImagePicker({ setPickedImage, prop }) {
  const options = {
    storageOptions: {
      path: "images",
      mediaType: "photo",
    },
    includeBase64: true, // Ensures base64 data is included
    quality: 0.7,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
    } else {
      const asset = response.assets[0];

      if (!asset) return;

      const { uri, base64, height, width } = asset;
      const fileExt = uri.substring(uri.lastIndexOf(".") + 1);
      const fileName = `${Math.random()}.${fileExt}`;
      const base64Image = `data:image/${fileExt};base64,${base64}`;

      var formData = new FormData();
      formData.append("files", {
        uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      setPickedImage({
        source: { uri },
        fileName,
        formData,
        base64: base64Image, // This is the Base64 string you need
        height,
        width,
        status: true,
        type: prop,
      });
    }
  });
}


export const nigerianBanks = [
  {
    "name": "Access Bank Nigeria",
    "code": "044",
    "type": "Commercial Bank"
  },
  {
    "name": "Citibank Nigeria",
    "code": "023",
    "type": "Commercial Bank"
  },
  {
    "name": "Coronation Merchant Bank",
    "code": "559",
    "type": "Commercial Bank"
  },
  {
    "name": "Ecobank Nigeria",
    "code": "050",
    "type": "Commercial Bank"
  },
  {
    "name": "Fidelity Bank Nigeria",
    "code": "070",
    "type": "Commercial Bank"
  },
  {
    "name": "First Bank of Nigeria",
    "code": "011",
    "type": "Commercial Bank"
  },
  {
    "name": "First City Monument Bank (FCMB)",
    "code": "214",
    "type": "Commercial Bank"
  },
  {
    "name": "Globus Bank",
    "code": "001",
    "type": "Commercial Bank"
  },
  {
    "name": "Guaranty Trust Bank (GTBank)",
    "code": "058",
    "type": "Commercial Bank"
  },
  {
    "name": "Heritage Bank Plc",
    "code": "030",
    "type": "Commercial Bank"
  },
  {
    "name": "Keystone Bank Limited",
    "code": "082",
    "type": "Commercial Bank"
  },
  {
    "name": "Polaris Bank",
    "code": "076",
    "type": "Commercial Bank"
  },
  {
    "name": "Providus Bank",
    "code": "101",
    "type": "Commercial Bank"
  },
  {
    "name": "Stanbic IBTC Bank Nigeria",
    "code": "221",
    "type": "Commercial Bank"
  },
  {
    "name": "Standard Chartered Bank Nigeria",
    "code": "068",
    "type": "Commercial Bank"
  },
  {
    "name": "Sterling Bank Nigeria",
    "code": "232",
    "type": "Commercial Bank"
  },
  {
    "name": "SunTrust Bank Nigeria Limited",
    "code": "100",
    "type": "Commercial Bank"
  },
  {
    "name": "Titan Trust Bank Limited",
    "code": "022",
    "type": "Commercial Bank"
  },
  {
    "name": "Union Bank of Nigeria",
    "code": "032",
    "type": "Commercial Bank"
  },
  {
    "name": "United Bank for Africa (UBA)",
    "code": "033",
    "type": "Commercial Bank"
  },
  {
    "name": "Unity Bank Plc",
    "code": "215",
    "type": "Commercial Bank"
  },
  {
    "name": "Wema Bank Nigeria",
    "code": "035",
    "type": "Commercial Bank"
  },
  {
    "name": "Zenith Bank Nigeria",
    "code": "057",
    "type": "Commercial Bank"
  },
  {
    "name": "Jaiz Bank Plc",
    "code": "301",
    "type": "Non-Interest Bank"
  },
  {
    "name": "Bank of Industry (BOI)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Bank of Agriculture (BOA)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Nigeria Export-Import Bank (NEXIM)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Development Bank of Nigeria (DBN)",
    "code": "030",
    "type": "Development Finance Institution"
  },
  {
    "name": "Microfinance Banks",
    "code": "N/A",
    "type": "Microfinance Bank"
  }
];

export function timeAgo(dateString) {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInMs = now - pastDate;

  // Convert milliseconds to different units
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximate month length
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}wk ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}m ago`;
  } else {
    return `${diffInYears}yr ago`;
  }
}