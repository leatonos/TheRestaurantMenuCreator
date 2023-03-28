import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        //Connection settings
        const client = await clientPromise;
        const db = client.db("TheOnlineMenu");
        const collection = db.collection("Restaurants");

        //The data to be sent to the database
        const doc = req.body
        
        //Once the data is sent we get a result with the id of the restaurant menu
        const result = await collection.insertOne(doc);
        res.json(`A document was inserted with the _id: ${result.insertedId}`);
        
    } catch (e) {
        console.error(e);
        res.json(e);
    }
 };