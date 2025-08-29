import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAU7LyWJka5DgcshhK7W23uIUjNJtHlDYM",
    authDomain: "medicard-b03ff.firebaseapp.com",
    projectId: "medicard-b03ff",
    storageBucket: "medicard-b03ff.firebasestorage.app",
    messagingSenderId: "127332228766",
    appId: "1:127332228766:web:cc14f10bc11ed40d62258f",
    measurementId: "G-J9ZHVFJ704"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };