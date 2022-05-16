interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string,
    readonly FIREBASE_API_KEY: string,
    readonly FIREBASE_AUTH_DOMAIN: string,
    readonly FIREBASE_DATABASE_URL: string,
    readonly FIREBASE_PROJECT_ID: string,
    readonly FIREBASE_STORAGE_BUCKET: string,
    readonly FIREBASE_MESSAGING_SENDER_ID: string,
    readonly FIREBASE_APP_ID: string,
    readonly FIREBASE_MEASUREMENT_ID: string,
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}