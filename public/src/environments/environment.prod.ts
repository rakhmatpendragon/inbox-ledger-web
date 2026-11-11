export const environment = {
  production: true,
  /**
   * Keep mock data on until the email-parsing backend is live,
   * then flip to false and set apiBaseUrl.
   */
  useMockData: true,
  apiBaseUrl: '/api',
  appUrl: 'app.rakhmatmibrahim.com',
  receiptsAddress: 'receipts@rakhmatmibrahim.com',
  googleClientId: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    appId: '',
  },
};

