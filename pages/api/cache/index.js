
import {addCors, cache} from '../../../components'
import fetch from 'node-fetch'

async function handler(req, res) {
  // Run the middleware
  await addCors(req, res)

  const {query: {url}} = req

  const _url = decodeURIComponent(url);

  //we cache only known sources....
  if(_url.indexOf("https://api.eventjuicer.com/") === -1 && _url.indexOf("https://localise.biz") === -1){
    res.status(500);
    res.end("Bad request")
    return
  }

  try{  
    const data = await fetch(_url).then(res => res.json());
    res.setHeader("cache-control", "s-maxage=10, stale-while-revalidate")
    res.json(data)
  }catch{
    res.status(500);
    res.end("Bad request")
  }
  
}

export default handler


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}


