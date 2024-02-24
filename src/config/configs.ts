import dotenv from 'dotenv'

dotenv.config()

export const env = {
  database: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'unicampzero445544',
    DB_NAME: process.env.DB_NAME || 'zerobito',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '40b780965fc28ec715f0e322711ae24e',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
  keycloak: {
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    KEYCLOAK_AUTH_SERVER_URL: process.env.KEYCLOAK_AUTH_SERVER_URL,
    KEYCLOAK_RESOURCE: process.env.KEYCLOAK_RESOURCE,
  },
  restClient: {
    REST_CLIENT_BASE_URL: process.env.REST_CLIENT_BASE_URL || '',
    REST_CLIENT_API_KEY: process.env.REST_CLIENT_API_KEY || '',
    REST_CLIENT_URL_AUTH: process.env.REST_CLIENT_URL_AUTH || '',
    REST_CLIENT_LOGIN: process.env.REST_CLIENT_LOGIN || '',
    REST_CLIENT_PASSWORD: process.env.REST_CLIENT_PASSWORD || '',
  },
  firebase: {
    FIREBASE_CLOUD_MESSAGE_URL: process.env.FIREBASE_CLOUD_MESSAGE_URL || '',
    FIREBASE_AUTHORIZATION_KEY: process.env.FIREBASE_AUTHORIZATION_KEY,
  },
  ldap: {
    LDAP_URL: process.env.LDAP_URL || '',
  },
  general: {
    OBSERVATION_MAX_SIZE: Number(process.env.OBSERVATION_MAX_SIZE) || 500,
    LOW_RISK_THRESHOLD: Number(process.env.LOW_RISK_THRESHOLD),
    MEDIUM_RISK_THRESHOLD: Number(process.env.MEDIUM_RISK_THRESHOLD),
    HIGH_RISK_THRESHOLD: Number(process.env.HIGH_RISK_THRESHOLD),
    WEBAPP_URL: process.env.WEBAPP_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'nosecret',
    TIMEZONE: process.env.TIMEZONE || 'America/Sao_Paulo',
  },
  backoffice: {
    API_KEY: process.env.API_KEY || 'local',
    DEFAULT_ADMIN: {
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@admin.com.br',
      nome: process.env.DEFAULT_ADMIN_NAME || 'Admin Admin',
      senha: process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword',
    },
  },
}
