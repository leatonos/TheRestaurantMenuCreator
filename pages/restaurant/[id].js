import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '../../lib/mongodb'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../styles/Restaurant.module.css'
import { ObjectId } from 'mongodb'


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

  function RestaurantHeader(){

    function selectCategory(category){
      //console.log(category)
      setSelectedCategory(category)
    }

    return(
      <header className={styles.restaurantHeader}>
        <div className={styles.restaurantLogoContainer}>
          <img src={restaurantLogoURL} className={styles.restaurantLogo} />
        </div>
         {/* Categories Section */}
        <div className={styles.restaurantHeaderCategoriesContainer}>
          {restaurantCategories.map((category,index)=>
            <p key={index} onClick={()=>selectCategory(category)} className={styles.restaurantHeaderCategory}>{category.categoryName}</p>
          )}
        </div>
        {/* Subcategories Section */}
        <div className={styles.restaurantHeaderSubcategoryContainer}>
          {selectedCategory.subCategories.map((subCategory, index)=>
            <p key={index} className={styles.restaurantHeaderSubcategory}>{subCategory.subCategoryName}</p>
          )}
        </div>
      </header>
    )
  }



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

    console.log()

  },[])

  const RestaurantMenu = () =>{

    const RestaurantCategory = (props) =>{

      const RestaurantSubCategory = (props) =>{
  
        const RestaurantItem = (props) =>{

          const itemName = props.item.itemName
          const itemImage = props.item.itemImage
          const itemPrice = props.item.itemPrice
          const itemAvailability = props.item.itemAvailability
          const itemDescription = props.item.itemDescription
          

          if(!itemAvailability){
            return null
          }
  
          return(
            <div className={styles.itemContainer}>
              <div className={styles.itemDescriptionContainer}>
                <p>{itemName}</p>
                <p>{itemDescription}</p>
                <p>{itemPrice}</p>
              </div>
              <div className={styles.itemImageContainer}>
                <img src={itemImage} className={styles.itemImage} />
              </div>
            </div>
          )
  
        }
  
        return(
          <div>
            <h3>{props.subCategory.subCategoryName}</h3>
            {props.subCategory.subCategoryItens.map((item,index)=>
              <RestaurantItem key={index} item={item}/>
            )}
          </div>
          
        )
  
      }
  
      return(
        <div className={styles.restaurantCategoryContainer}>
          <h2>{props.category.categoryName}</h2>
          {props.category.subCategories.map((subCategory)=>
              <RestaurantSubCategory subCategory={subCategory}/>
            )
          }
        </div>
      )
    }
    
    return(
        restaurantCategories.map((category,index)=>
        <RestaurantCategory key={index} category={category}/>
      )
    )

  } 

  
 
   return (
     <>
       <Head>
         <title>{restaurantName} Menu</title>
         <meta name="description" content={restaurantName + ' Menu'} />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="icon" href="/favicon.ico" />
       </Head>

       <main className={styles.main}>
        <RestaurantHeader />
        <div className={styles.restaurantMenuContainer}>
          <h1>{restaurantName}</h1>
          <RestaurantMenu/>
        </div>
       </main>
     </>
   )

}