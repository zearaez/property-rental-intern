import { socketWrapper } from '@/utils/socketWrapper'

export const userSocket = socketWrapper<{
    payload: {} //TYPE HERE
}>(async ({ socketParams: { io, socket }, params }) => {
    //TO HANDLE USER SOCKET
})
