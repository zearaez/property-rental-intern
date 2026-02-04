import { config } from '@/config/config'
import { logger } from '@/helpers/logger'
import app from './app'

init()

async function init() {
    try {
        app.listen(config('port'), () => {
            logger.info(`Server running on port ${config('port')}`)
        })
    } catch (err) {
        logger.error(err)
    }
}
