export const authSchema = {
    register: {
        username: 'string',
        name: 'string',
        email: 'string',
        phone: 'string',
        role: {
            type: 'string',
            enum: ['GUEST', 'HOST'],
        },
        password: 'string',
        confirm_password: 'string',
    },
    login: {
        username: 'string',
        password: 'string',
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
