
import {addCors, time} from '../../../components'
import fetch from 'node-fetch'
import moment from 'moment';

const url = 'https://api.eventjuicer.com/proxy?url=https://api.eventjuicer.com/v1/public/hosts/virtual.ecommerceberlin.com/presenters';

async function handler(req, res) {

    await addCors(req, res)
    const {data} = await fetch(url).then(response => response.json());
    const _time = time();

    const filtered = data.filter(item => {

 //     if(!item.video || item.video.indexOf("http") ===-1) return false

      if(!item.presentation_day || item.presentation_day != "2021-05-27") return false

      if(!item.presentation_time || !item.video_length_minutes) return false

      if(`${item.presentation_time}:00` > _time) return false

      const presentation_end_time = moment(item.presentation_time, "HH:mm").add(item.video_length_minutes, "m").format("HH:mm:ss")

      if(presentation_end_time < _time) return false

      return true;

    } ).map(item => ({
      ...item, 
      curtime: _time, 
      seconds: moment.duration(
        moment(_time, "HH:mm:ss").diff(moment(item.presentation_time, "HH:mm:ss"))).asSeconds()}))

    //get current time!

    res.setHeader("cache-control", "s-maxage=10, stale-while-revalidate")

    res.json( filtered )
}

export default handler

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
}

  