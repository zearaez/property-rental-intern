import { IUser } from '@/utils/query'

export type IPersonalMessagePayload = {
    message: string
    media: string[]
    room_id: string
    sender_id: IUser['id']
}

export type ICommunicationMessagePayload = {
    protocolId: string
    sender_id: IUser['id']
    message: string
}

export type IThreadMessagePayload = {
    message: string
    protocol_thread_id: string
    sender_id: IUser['id']
}
