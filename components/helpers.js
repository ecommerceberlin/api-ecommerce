import Cors from 'cors'
import moment from 'moment-timezone'
import Redis from 'ioredis'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

import Fingerprint from  'express-fingerprint'


export class RedisHelper {

  connection = null
  key = "item"
  listkey = "itemlist"
  debug = true;

  constructor(namespace) {
    const url = this.fixConnectionUrl(process.env.REDIS_URL);
    this.connection = new Redis(url);
    this.key  = namespace
    this.listkey = `${namespace}_list`;
  }

  fixConnectionUrl(url) {
    if (!url) {
      return ''
    }
    if (url.startsWith('redis://') && !url.startsWith('redis://:')) {
      return url.replace('redis://', 'redis://:')
    }
    if (url.startsWith('rediss://') && !url.startsWith('rediss://:')) {
      return url.replace('rediss://', 'rediss://:')
    }
    return url
  }

  genKey(id){
    return `${this.key}:${id}`
  }

  async setItem(id, data){
    return await this.connection.hmset( this.genKey(id), data )
  }

  async getItem(id){
    await this.connection.hgetall( this.genKey(id) )
  } 

  async addToList(arr, index="id"){
    
    //const keys = await this.connection.lrange(this.listkey, 0, -1) // 0, -1 => all items

    if(!isArray(arr) || isEmpty(arr)){
      return
    }

    this.connection.del(this.listkey)
    const keys = arr.map(item => this.genKey(item[index]))

    const p = this.connection.pipeline()
  
    // if you store plain (1-level) objects you can use hset...
    /**
     *  arr.forEach(item => p.hset( this.genKey(item[index]), item ))
    */

    try {
      arr.forEach(item => p.set( this.genKey(item[index]), JSON.stringify( item ) ))
    } catch (error) {
      
    }
    await p.exec();
    await this.connection.lpush(this.listkey, keys)

  }
  
  async getList(){
    const keys = await this.connection.lrange(this.listkey, 0, -1) // 0, -1 => all items

    //if you stored not nested objects with hset you can use hgetall...
    
    /**
     * const p = this.connection.pipeline()
     * keys.forEach(key => p.hgetall(key))
     * const res = await p.exec();
     * return res.map(res => res[1])
    */
   if(!isEmpty(keys)){
    const res = await this.connection.mget(keys)
    return res.map(item => JSON.parse(item))
   }
  
   return [];

  }

  quit(){
    this.connection.quit();
  }

}
  

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}




const fingerprint = Fingerprint({
	parameters:[
		// Defaults
		Fingerprint.useragent,
		Fingerprint.acceptHeaders,
		Fingerprint.geoip,

		// Additional parameters
		function(next) {
			// ...do something...
			next(null,{
			'param1':'value1'
			})
		},
		function(next) {
			// ...do something...
			next(null,{
			'param2':'value2'
			})
		},
	]
})


export async function addFingerprint(){
  return await runMiddleware(req, res, fingerprint)
}

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: "*",
  credentials: true,
})



export async function addCors(req, res){
  return await runMiddleware(req, res, cors)
}


export function time(tz = "Europe/Warsaw"){
  return moment().tz(tz).format("HH:mm:ss");
}






export function getIP(req){
  return req.headers['x-forwarded-for'] || req.headers['Remote_Addr'] || '1'
}