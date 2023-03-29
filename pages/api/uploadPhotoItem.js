import {generateUploadURL} from './s3.js'

export default async (req, res) => {
    try {
        
      const url = await generateUploadURL()
      res.json(url)
        
    } catch (e) {
        res.json(e)
    }
 };