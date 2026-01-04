Reperto AI - Frontend (Expo React Native + TypeScript)

Setup:
1. Install Node and Expo CLI.
2. cd reperto-frontend
3. npm install
4. npx expo start

Notes:
- Backend default baseURL in src/services/api.ts is http://10.0.2.2:8000 (Android emulator). Change to server IP if using a real device.
- The app stores access_token in AsyncStorage after login.
- UI uses white background and light purple accents per design.
