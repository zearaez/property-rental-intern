import Bull from 'bull'
import { config } from '@/config/config'
import { BullAdapter } from '@bull-board/api/bullAdapter'

export const usersQueue = new Bull('USERS', {
    redis: config('redis_url'),
})

export const jobList = [
    ...[usersQueue].map((queue) => {
        return new BullAdapter(queue)
    }),
]
