
import {addCors, addFingerprint, RedisHelper} from '../../components'
import fetch from 'node-fetch'


/**
 



 */

async function handler(req, res) {

    await addCors(req, res)
    await addFingerprint(req, res)

    //project name or transaction widget id?

    const redis = new RedisHelper(`locks`)
 
  
    await redis.addToList([{id: req.fingerprint.hash, sth: 123}])
 
    const data = await redis.getList()

    const {body: {order}} = req
    
    //validate order...


    redis.quit()

    res.json( {fingerprint: req.fingerprint.hash, body: order, data})
}

export default handler
