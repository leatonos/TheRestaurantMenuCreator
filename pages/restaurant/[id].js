import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '../../lib/mongodb'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/Restaurant.module.css'
import { ObjectId } from 'mongodb'
import RestaurantPreview from '../../components/restaurantPreview'


//Redux
import { useDispatch, useSelector } from 'react-redux'
import { updateCategories } from '../../redux/restaurantSlice'

export async function getServerSideProps(context) {

    //Retrieves the restaurant Id from the link
    const restaurantId = context.query.id
    
  try {
    await clientPromise
   
    const client = await clientPromise
    const db = client.db("TheOnlineMenu")

    const restaurant = await db
            .collection("Restaurants")
            .findOne({_id:ObjectId(restaurantId)})
    return {
      props: { restaurant: JSON.stringify(restaurant) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Restaurant({restaurant}){

  const [restaurantLogoURL, setRestaurantLogo] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantCategories, setRestaurantCategories] = useState([])
  const [selectedCategory,setSelectedCategory] = useState({subCategories:[]})

  /* 
  
    Just a little schema

    categories
      >categoryName(String)
      >subCategories(Array)
        >subCategoryName(String)
        >subCategoryItens(Array)
          >itemName(String)
          >itemImage(String)
          >itemPrice(Double)
          >itemAvailability(Boolean)
          >itemDescription(String)

   */

  const dispatch = useDispatch()

  useEffect(()=>{
    //in case the restaurant Id is wrong or invalid this will happen
    if(!restaurant){
      console.error('Restaurant not found, restaurant Id may be wrong or invalid')
      return
    }
    const restaurantInfo = JSON.parse(restaurant)

    //Set restaurant Info into our State
    setRestaurantLogo(restaurantInfo.restaurantImage)
    setRestaurantName(restaurantInfo.restaurantName)
    setRestaurantCategories(restaurantInfo.categories)

    dispatch(updateCategories(restaurantInfo.categories))


    console.log()

  },[])
   return (
     <>
       <Head>
         <title>{restaurantName} Menu</title>
         <meta name="description" content={restaurantName + ' Menu'} />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="/favicon.ico" />
       </Head>

       
          <RestaurantPreview/>
       
     </>
   )

}