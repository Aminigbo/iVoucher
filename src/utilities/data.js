export let Merchant = [
    {
        name: "Jumia",
        id: 1,
        img: "https://play-lh.googleusercontent.com/K02ShY9ODJ9xGxXVqYKbDUOXczHHdKUnE9YRyurDdPkXe_THCWy-Fpo417seGIsMchA",
        address: "0x4F3A12085C69D94B1A1C66A886EC43F4B3C998F2C"
    },
    {
        name: "Konga",
        id: 2,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1RVwGtJLuNmq_eY_SBb6mGnDN3GQY0aPz3g&s",
        address: "0x95C2E5B47B799697C05A5D84C70F544D1D2F0B2A"
    },
    {
        name: "Market Square",
        id: 3,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrPvD6lazDt-_j2tBOw0eVSwAIseSH5xSZqw&s",
        address: "0x1A2C634F54D49E4C9C6B67A211F5F4229B7E0D1C"
    },
    {
        name: "Total Fuel Station",
        id: 4,
        img: "https://i0.wp.com/media.premiumtimesng.com/wp-content/files/2012/11/total_logo.jpg?resize=450%2C307&ssl=1",
        address: "0x8A5E7F63C41D4956B8C5F44D9E4C21B4D3F0C5B"
    },
    {
        name: "Hypercity",
        id: 5,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw8CzfUIUSHXAQZD1R7T2A_u_33RthKyzThQ&s",
        address: "0x4C9A1F63D4E9C5B67A2F54D49E4C21B4D3F0C5B"
    },
    {
        name: "Genesis Resturant",
        id: 6,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdic5ulCf53ay4v52xeuIhXCMVBlnDvTg-_A&s",
        address: "0x9C5F44D9E4C21B4D3F0C5B67A2F54D49E4C"
    },
    {
        name: "Presidential hotel",
        id: 7,
        img: "https://images.ctfassets.net/6pezt69ih962/5lo6tDx1Zu1ohlVFGLdLvn/2aebaf68fdb1612fcfd06655965f0605/President-644.jpg?h=540&f=faces&fit=fill&fm=webp&q=90",
        address: "0x1F5F4229B7E0D1C9C6B67A211F5F4229B7E0D1C"
    },
    {
        name: "NNPC Fuel Station",
        id: 8,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqc-jWMft5g2GMR7s3ZZnp86WVpgqIF00FOw&s",
        address: "0x5C9A1F63D4E9C5B67A2F54D49E4C21B4D3F0C5B"
    },
    {
        name: "Bolt Drive",
        id: 9,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdrcUWyDinS5NXDowl0t4POQkDhe9yHzLSc5eyzgfMnAgs6uXtbFI0E63h_Qz-EJ2w0nc&usqp=CAU",
        address: "0x4F3A12085C69D94B1A1C66A886EC43F4B3C998F2C"
    },
    {
        name: "Bet9ja",
        id: 10,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNKCRQfT6yRkTPZf_-e5EbT6uP_7LVadvZ9g&s",
        address: "0x95C2E5B47B799697C05A5D84C70F544D1D2F0B2A"
    }
]

export let Country = [
    { id: 1, name: "Benin", region: "West Africa" },
    { id: 2, name: "Burkina Faso", region: "West Africa" },
    { id: 3, name: "Cabo Verde", region: "West Africa" },
    { id: 4, name: "Gambia", region: "West Africa" },
    { id: 5, name: "Ghana", region: "West Africa" },
    { id: 6, name: "Guinea", region: "West Africa" },
    { id: 7, name: "Guinea-Bissau", region: "West Africa" },
    { id: 8, name: "Ivory Coast", region: "West Africa" },
    { id: 9, name: "Liberia", region: "West Africa" },
    { id: 10, name: "Mali", region: "West Africa" },
    { id: 11, name: "Mauritania", region: "West Africa" },
    { id: 12, name: "Niger", region: "West Africa" },
    {
        id: 13, name: "Nigeria", region: "West Africa",
        city: [
            { id: 1, name: "Abia", cities: ["Aba", "Umuahia", "Ohafia", "Arochukwu", "Bende"] },
            { id: 2, name: "Adamawa", cities: ["Yola", "Mubi", "Numan", "Jimeta", "Ganye"] },
            { id: 3, name: "Akwa Ibom", cities: ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak"] },
            { id: 4, name: "Anambra", cities: ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Obosi"] },
            { id: 5, name: "Bauchi", cities: ["Bauchi", "Azare", "Misau", "Jama'are", "Darazo"] },
            { id: 6, name: "Bayelsa", cities: ["Yenagoa", "Brass", "Ogbia", "Sagbama", "Ekeremor"] },
            { id: 7, name: "Benue", cities: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya"] },
            { id: 8, name: "Borno", cities: ["Maiduguri", "Biu", "Bama", "Gwoza", "Dikwa"] },
            { id: 9, name: "Cross River", cities: ["Calabar", "Ikom", "Ogoja", "Ugep", "Obudu"] },
            { id: 10, name: "Delta", cities: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"] },
            { id: 11, name: "Ebonyi", cities: ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Ikwo"] },
            { id: 12, name: "Edo", cities: ["Benin City", "Auchi", "Ekpoma", "Uromi", "Irrua"] },
            { id: 13, name: "Ekiti", cities: ["Ado Ekiti", "Ikere Ekiti", "Ilawe Ekiti", "Oye Ekiti", "Ikole Ekiti"] },
            { id: 14, name: "Enugu", cities: ["Enugu", "Nsukka", "Awgu", "Oji River", "Udi"] },
            { id: 15, name: "Gombe", cities: ["Gombe", "Kaltungo", "Dukku", "Billiri", "Bajoga"] },
            { id: 16, name: "Imo", cities: ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta"] },
            { id: 17, name: "Jigawa", cities: ["Dutse", "Hadejia", "Gumel", "Kazaure", "Birnin Kudu"] },
            { id: 18, name: "Kaduna", cities: ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Saminaka"] },
            { id: 19, name: "Kano", cities: ["Kano", "Wudil", "Gaya", "Rano", "Bichi"] },
            { id: 20, name: "Katsina", cities: ["Katsina", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma"] },
            { id: 21, name: "Kebbi", cities: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Jega"] },
            { id: 22, name: "Kogi", cities: ["Lokoja", "Okene", "Idah", "Kabba", "Ankpa"] },
            { id: 23, name: "Kwara", cities: ["Ilorin", "Offa", "Omu-Aran", "Jebba", "Lafiagi"] },
            { id: 24, name: "Lagos", cities: ["Ikeja", "Lagos Island", "Ikorodu", "Epe", "Badagry"] },
            { id: 25, name: "Nasarawa", cities: ["Lafia", "Keffi", "Akwanga", "Karu", "Nasarawa"] },
            { id: 26, name: "Niger", cities: ["Minna", "Suleja", "Bida", "Kontagora", "New Bussa"] },
            { id: 27, name: "Ogun", cities: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota", "Ilaro"] },
            { id: 28, name: "Ondo", cities: ["Akure", "Ondo", "Owo", "Ikare", "Okitipupa"] },
            { id: 29, name: "Osun", cities: ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Ikirun"] },
            { id: 30, name: "Oyo", cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"] },
            { id: 31, name: "Plateau", cities: ["Jos", "Bukuru", "Barkin Ladi", "Pankshin", "Shendam"] },
            { id: 32, name: "Rivers", cities: ["Port Harcourt", "Obio-Akpor", "Bonny", "Eleme", "Omoku"] },
            { id: 33, name: "Sokoto", cities: ["Sokoto", "Gwadabawa", "Wurno", "Tambuwal", "Goronyo"] },
            { id: 34, name: "Taraba", cities: ["Jalingo", "Wukari", "Jalingo", "Bali", "Gembu"] },
            { id: 35, name: "Yobe", cities: ["Damaturu", "Potiskum", "Nguru", "Gashua", "Gujba"] },
            { id: 36, name: "Zamfara", cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Gummi", "Bungudu"] },
            { id: 37, name: "Federal Capital Territory", cities: ["Abuja"] }
        ]
    },
    { id: 14, name: "Senegal", region: "West Africa" },
    { id: 15, name: "Sierra Leone", region: "West Africa" },
    { id: 16, name: "Togo", region: "West Africa" }
];



