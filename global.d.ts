// Global type declarations for Expo environment variables
declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        EXPO_PUBLIC_API_URL?: string;
        NODE_ENV: 'development' | 'production' | 'test';
      }
    }
  }
}

// Expo environment variables
declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

// React Native modules
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

// Expo modules type extensions
declare module 'expo-constants' {
  const Constants: any;
  export default Constants;
}

declare module 'expo-router' {
  export * from 'expo-router/types';
}