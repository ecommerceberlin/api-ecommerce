import Cors from 'cors'
import moment from 'moment-timezone'
import Fingerprint from  'express-fingerprint'





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




export async function addFingerprint(req, res){
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
