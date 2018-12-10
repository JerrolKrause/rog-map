// Common env settings that don't change between dev and prod
export const common = {
  properties: {
    /** Name of application */
    appName: 'zONE',
  },
  settings: {
    /** Is an authentication endpoint available? If so make sure to update the endpoints in this file */
    enableAuth: false,
    /** Enable service worker functionality */
    enableServiceWorker: false,
    /** Is this app going to communicate with other domains or instances of itself for multiscreen usage?
     * If so, whitelist domains in the domains.listenTo property */
    enableAppComms: true,
    /** Should lazy loaded routes be preloaded on app instantiation? If false will be loaded on demand */
    preloadRoutes: false,
    /** Should data that is written to localstorage (such as app settings and store state) be obfuscated? */
    obfuscate: true,
  },
  domains: {
    /** If App Comms is enabled, whitelist domains to accept messages from here */
    listenTo: <string[]>['http://localhost:4200'],
  },
  endpoints: {
    /** Location to get environment and config settings */
    envConfig: 'assets/mock-data/env-settings.json',
    /** Location of API if not getting that from envConfig */
    apiUrl: './',
    /** Login endpoint */
    authLogin: '/authentication/login',
    /** Refresh token endpoint */
    authTokenRefresh: '/authentication/token',
  },
  state: {
    /** Which UI store properties to not write to localstorage. IE do not persist confidential/personal information */
    uiStoreBlacklist: <string[]>[],
  },
  licenses: {
    agGrid: 'qwerty',
  },
};
