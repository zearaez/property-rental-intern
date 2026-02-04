import dotenv from 'dotenv'

dotenv.config()

const configData = {
    //NODE
    port: process.env.PORT,
    clientURL: process.env.CLIENT_URL,
    isProd: process.env.NODE_ENV === 'production',
    serverURL: process.env.SERVER_URL,
    secretAccess: process.env.JWT_ACCESS_SECRET,
    secretRefresh: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRE,
    refreshExpiry: process.env.JWT_REFRESH_EXPIRE,
    jwtIssuer: process.env.JWT_ISSUER || 'outcode-software',
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    allowedMethods: process.env.ALLOWED_METHODS,
    otpExpirationTime: 3, //in minutes
    forgotpasswordAttempt: 3,
    forgotpasswordWaitingTime: 1, //in minutes

    //GOOGLE
    googleClientId: process.env.GOOGLE_CLIENT_ID,

    //APPLE
    appleClientId: process.env.APPLE_CLIENT_ID,

    //DB
    dbURL: process.env.DATABASE_URL,

    //MULTER
    fileSize: process.env.MULTER_FILE_SIZE,

    //REDIS
    redis_url: process.env.REDIS_URL,

    //LOGGER
    logDir: 'logs',
    logLevel: 'info',
} as const

export const config = <T extends keyof typeof configData>(
    key: T
): (typeof configData)[T] | null => {
    try {
        const envVal = configData[key]
        if (!envVal) return null
        return envVal
    } catch (err) {
        throw new Error(err)
    }
}
