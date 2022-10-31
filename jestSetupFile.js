import mockAsyncStorage
  from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-keychain', () => ({
    SECURITY_LEVEL_ANY: "MOCK_SECURITY_LEVEL_ANY",
    SECURITY_LEVEL_SECURE_SOFTWARE: "MOCK_SECURITY_LEVEL_SECURE_SOFTWARE",
    SECURITY_LEVEL_SECURE_HARDWARE: "MOCK_SECURITY_LEVEL_SECURE_HARDWARE",
    ACCESS_CONTROL: {
        APPLICATION_PASSWORD: "MOCK_ACCESS_CONTROL.APPLICATION_PASSWORD"
    },
    setGenericPassword: jest.fn().mockResolvedValue(),
    getGenericPassword: jest.fn().mockResolvedValue(),
    resetGenericPassword: jest.fn().mockResolvedValue(),
    getInternetCredentialsForServer: jest.fn().mockResolvedValue(),
    getInternetCredentials: jest.fn().mockResolvedValue(),
}));