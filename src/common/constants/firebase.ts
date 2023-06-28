import { ConfigService } from '@nestjs/config'

export function getFirebaseConfig(configService: ConfigService) {
  return {
    type: 'service_account',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    project_id: configService.get('FIREBASE_PROJECT_ID'),
    private_key_id: configService.get('FIREBASE_PRIVATE_KEY_ID'),
    private_key: configService.get('FIREBASE_PRIVATE_KEY'),
    client_email: configService.get('FIREBASE_CLIENT_EMAIl'),
    client_id: configService.get('FIREBASE_CLIENT_ID'),
    client_x509_cert_url: configService.get('FIREBASE_CLIENT_X509_CERT_URL'),
  }
}
