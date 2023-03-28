import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("TheOnlineMenu");

       const restaurants = await db
           .collection("Restaurants")
           .find({})
           .sort({ })
           .limit(10)
           .toArray();
           
       res.json(restaurants);
   } catch (e) {
       console.error(e);
   }
};