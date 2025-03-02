// src/context/UserContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create Context
export const UserContext = createContext();

// Initial State
const initialState = {
  users: [],
  loading: false,
  error: null,
};

// Reducer Function
const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

// Async Storage Keys
const STORAGE_KEY = 'users';

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch Users from API
  const fetchUsers = async () => {
    dispatch({ type: 'FETCH_USERS_START' });
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
    } catch (error) {
      dispatch({
        type: 'FETCH_USERS_ERROR',
        payload: error.response?.data || 'An error occurred',
      });
    }
  };

  // Load Users from AsyncStorage on App Start
  const loadUsersFromStorage = async () => {
    const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
      dispatch({ type: 'SET_USERS', payload: JSON.parse(storedUsers) });
    }
  };

  // Load persisted data on app start
  useEffect(() => {
    loadUsersFromStorage();
  }, []);

  return (
    <UserContext.Provider value={{ ...state, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};
