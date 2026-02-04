export const authSchema = {
    register: {
        first_name: 'string',
        last_name: 'string',
        email: 'string',
        password: 'string',
        confirm_password: 'string',
    },
    login: {
        email: 'string',
        password: 'string',
        deviceId: 'string',
        platform: {
            type: 'string',
            enum: ['PHONE', 'WEB'],
        },
    },
    oauthLogin: {
        provider: {
            type: 'string',
            enum: ['GOOGLE', 'APPLE', 'MICROSOFT'],
        },
        deviceId: 'string',
        platform: {
            type: 'string',
            enum: ['PHONE', 'WEB'],
        },
        token: 'string',
    },

    refreshToken: {
        deviceId: 'string',
        platform: {
            type: 'string',
            enum: ['PHONE', 'WEB'],
        },
    },
    forgotPassword: {
        email: 'string',
    },
    changePassword: {
        token: 'string',
        otp_code: 'number',
        new_password: 'string',
    },
}
