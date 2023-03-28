import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../../styles/RestaurantPreview.module.css'


export default function RestaurantPreview(props){

    const [restaurantLogoURL, setRestaurantLogo] = useState('')
    const [selectedCategory,setSelectedCategory] = useState({subCategories:[]})

    let categories = props.restaurantInfo

    useEffect(()=>{
      if(!categories){
        categories = []
      }
    },[])
  
    function RestaurantHeader(){
  
      function selectCategory(category){
        //console.log(category)
        setSelectedCategory(category)
      }

      function navigateToSubCategory(idOfSubCategory){

        const container = document.querySelector('#menuContainerPrev')

        const element = document.querySelector(idOfSubCategory)
        const qualquerCoisa = element.offsetTop

        container.scrollTo({
          top: qualquerCoisa,
          behavior: "smooth",
        });

        
        
      }
  
      return(
        <header className={styles.restaurantHeader}>
          <div className={styles.restaurantLogoContainer}>
            <img src={restaurantLogoURL} className={styles.restaurantLogo} />
          </div>
           {/* Categories Section */}
          <div className={styles.restaurantHeaderCategoriesContainer}>
            {props.restaurantInfo.map((category,index)=>
              <a key={index} className={styles.anchorLink} href={`#category${index}`}>
                <p onClick={()=>selectCategory(category)} className={styles.restaurantHeaderCategory}>
                  {category.categoryName}
                </p>
              </a>
            )}
          </div>
          {/* Subcategories Section */}
          <div className={styles.restaurantHeaderSubcategoryContainer}>
            {selectedCategory.subCategories.map((subCategory, index)=>
            <a key={index} onClick={()=>navigateToSubCategory(`#subCategory${index}`)} className={styles.anchorLink} >
              <p key={index} className={styles.restaurantHeaderSubcategory}>{subCategory.subCategoryName}</p>
            </a>
            )}
          </div>
        </header>
      )
    }
  
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
            <div id={`subCategory${props.subCategoryIndex}`}>
              <h3>{props.subCategory.subCategoryName}</h3>
              {props.subCategory.subCategoryItens.map((item,index)=>
                <RestaurantItem key={index} item={item}/>
              )}
            </div>
            
          )
    
        }
    
        return(
          <div className={styles.restaurantCategoryContainer} id={`category${props.categoryIndex}`}>
            <h2>{props.category.categoryName}</h2>
            {props.category.subCategories.map((subCategory,index)=>
                <RestaurantSubCategory key={index} subCategoryIndex={index} subCategory={subCategory}/>
              )
            }
          </div>
        )
      }
      
      return(
        props.restaurantInfo.map((category,index)=>
          <RestaurantCategory key={index} categoryIndex={index} category={category}/>
        )
      )
  
    } 
  
    
   
     return (
    
         <section className={styles.main} id='menuContainerPrev'>
          <RestaurantHeader />
          <div className={styles.restaurantMenuContainer}>
            <h1>{props.restaurantName}</h1>
            <RestaurantMenu/>
          </div>
         </section>
       
     )
  
  }