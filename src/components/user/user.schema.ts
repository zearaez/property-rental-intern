export const userSchema = {
    updateProfile: {
        first_name: 'string',
        last_name: 'string',
        phone: { type: 'string', optional: true },
        bio: { type: 'string', optional: true },
        profile_picture: {
            type: 'string',
            optional: true,
        },
    },
    changePasswordProfile: {
        currentPassword: { type: 'string', optional: true },
        newPassword: 'string',
    },
}
