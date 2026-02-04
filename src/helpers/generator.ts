import { randomBytes, createHash, createPublicKey } from 'crypto'

export const generateOTP = (size: number = 6): string => {
    return Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(size, '0')
}

export const genRandomDigest = (size: number = 32): string => {
    const randomData = randomBytes(size)
    const hash = createHash('sha256')
    hash.update(randomData)
    return hash.digest('hex')
}

export const convertJwkToPem = (jwk: { [key: string]: string }) => {
    const keyObject = createPublicKey({
        key: {
            kty: jwk.kty,
            n: jwk.n,
            e: jwk.e,
        },
        format: 'jwk',
    })
    return keyObject.export({ type: 'spki', format: 'pem' }).toString()
}
