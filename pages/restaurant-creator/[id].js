import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/RestaurantCreator.module.css'
import RestaurantPreview from '../../components/restaurantPreview'
import RestaurantMenuCreator from '../../components/restaurantMenuCreator'

//Redux
import { useDispatch, useSelector } from 'react-redux'
import { updateCategories } from '../../redux/restaurantSlice'


import { ObjectId } from 'mongodb'
import clientPromise from '../../lib/mongodb'


//Auth
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

//Images
import arrowUp from '../../public/img/arrow-up.svg'
import arrowDown from '../../public/img/arrow-down.svg'
import addButton from '../../public/img/add-plus-circle.svg'
import trashCan from '../../public/img/trash-full.svg'
import hide from '../../public/img/hide.svg'
import show from '../../public/img/show.svg'

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
      props: { restaurantResult: JSON.stringify(restaurant) },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function RestaurantCreator({restaurantResult}){
  
  const currentMenu = useSelector((state) => state.restaurantMenu.categories)
  const [restaurantName, setRestaurantName] = useState('')
  const dispatch = useDispatch()
  
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  const serverResponse = JSON.parse(restaurantResult)

  useEffect(()=>{
    if(isLoading){return}
    if(user.sub == serverResponse.ownerId){
      setRestaurantName(serverResponse.restaurantName)
      dispatch(updateCategories(serverResponse.categories))
    }else{   
      router.push('/')
    }
    if(!user){
      router.push('/')
     }
  },[user])

  async function updateMenu(){
  
    try {
      const response = await fetch("/api/updateMenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({restaurantName:restaurantName,categories:currentMenu,id:serverResponse._id}),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data) ;
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    

  }

  //RestaurantCreatorContainer
   return (
     <>
       <Head>
         <title>Restaurant Creator Menu</title>
         <meta name="description" content='Restaurant creator' />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="/favicon.ico" />
       </Head>

       <main className={styles.main}>

        <div className={styles.restaurantMenuContainer}>
          <div className={styles.menuCreatorContainer}>
          <h1>Restaurant Editor</h1>
          <label htmlFor='restaurantNameInput'>Restaurant Name</label>
          <input type='text' onChange={e=>setRestaurantName(e.target.value)} defaultValue={restaurantName} id='restaurantNameInput' />
          <br/>
            <RestaurantMenuCreator restaurantInfo={currentMenu}/>
            <button onClick={updateMenu} type='button'>Update Menu</button>
          </div>
          <div className={styles.previewContainer}>
            <RestaurantPreview restaurantInfo={currentMenu} restaurantName={restaurantName} />
          </div>
        </div>
       </main>
     </>
   )

}