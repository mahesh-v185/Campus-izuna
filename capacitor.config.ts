import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.campuskizuna.app',
  appName: 'CampusKizuna',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
