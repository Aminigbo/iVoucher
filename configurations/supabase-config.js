import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { setupURLPolyfill } from 'react-native-url-polyfill'

const supabaseUrl = "https://awkkradstjkklsyqbkhl.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a2tyYWRzdGpra2xzeXFia2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNDI4MDAsImV4cCI6MjA0NjkxODgwMH0.WT7pLZwwRnvQY9yrAO4kCPKPC1PnAUPa--PCsJpF4sY";
setupURLPolyfill()

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        detectSessionInUrl: false,
        storage: AsyncStorage,
      },
    }
  );