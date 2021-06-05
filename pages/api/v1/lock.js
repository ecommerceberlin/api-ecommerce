
import {addCors, addFingerprint, RedisHelper} from '../../../components'
import fetch from 'node-fetch'
import moment from 'moment';

/**
 
    const redis = new RedisHelper(`__channel${id}`)
    const data = await redis.getList(60)
    await redis.addToList(cleared)
    redis.quit()


 */

async function handler(req, res) {

    await addCors(req, res)
    await addFingerprint(req, res)

    res.json( {test: 1})
}

export default handler
