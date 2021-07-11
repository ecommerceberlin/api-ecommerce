

export function time(tz = "Europe/Warsaw"){
    return moment().tz(tz).format("HH:mm:ss");
  }
  
  export function getIP(req){
    return req.headers['x-forwarded-for'] || req.headers['Remote_Addr'] || '1'
  }