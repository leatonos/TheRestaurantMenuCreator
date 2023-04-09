import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../styles/RestaurantCreator.module.css'
import RestaurantPreview from '../../components/restaurantPreview'
import RestaurantMenuCreator from '../../components/restaurantMenuCreator'

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


export default function RestaurantCreator(){
  
  
  const [restaurantName, setRestaurantName] = useState('')

  const { user, error, isLoading } = useUser();
  const router = useRouter()
  const currentMenu = useSelector((state) => state.restaurantMenu.categories)

  useEffect(()=>{
    if(isLoading){return}
    if(!user){
      router.push('/')
    }
  },[user])

  async function saveMenu(){
    try {
      const response = await fetch("/api/createMenu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({restaurantName:restaurantName,categories:currentMenu,ownerId:user.sub}),
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
            <h1>Restaurant Creator</h1>
            <label htmlFor='restaurantNameInput'>Restaurant Name</label>
            <input type='text' onBlur={e=>setRestaurantName(e.target.value)} id='restaurantNameInput' />
            <br/>
            <RestaurantMenuCreator/>
            <button onClick={saveMenu} type='button'>Create Menu</button>
          </div>
          <div className={styles.previewContainer}>
            <h3>Preview</h3>
            <RestaurantPreview restaurantName={restaurantName} />
          </div>
        </div>
       </main>
     </>
   )

}