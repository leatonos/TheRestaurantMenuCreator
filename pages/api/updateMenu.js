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
        
        //Once the data is sent we get a result with the id of the restaurant menu
        await collection.updateOne(
            //here we define what restaurant we are updating
            {_id: ObjectId(doc.id)},
                //here we define the changes
                {
                $set: { restaurantName: doc.restaurantName,categories:doc.categories },
                $currentDate: { lastModified: true }
              }     
            );
        res.json(`Document updated!`);
        
    } catch (e) {
        console.error(e);
        res.json(e);
    }
 };