export const uploadFileService = async (
    body: any,
    files: { [key: string]: Express.Multer.File[] } | Express.Multer.File[],
    user_id: string
): Promise<unknown> => {
    // for (const [index, file] of Object.values(files).entries()) {

    // }
    return { body, files, user_id }
}
