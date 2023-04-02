import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        //Connection settings
        const client = await clientPromise;
        const db = client.db("TheOnlineMenu");
        const collection = db.collection("Restaurants");

        //The data to be sent to the database
        const doc = req.body
        
        console.log(req.body)
        if(req.body.userId != req.body.menuInfo.ownerId){
            res.json({error:'Not authorized'}); 
            return
        }
        //Once the data is sent we get a result with the id of the restaurant menu
        await collection.deleteOne({_id: ObjectId(doc.menuInfo._id)});
        res.json(doc);     
    } catch (e) {
        console.error(e);
        res.json(e);
    }
 };