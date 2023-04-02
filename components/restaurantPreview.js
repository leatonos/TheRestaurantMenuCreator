import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/RestaurantPreview.module.css'


export default function RestaurantPreview(props){

    const [restaurantLogoURL, setRestaurantLogo] = useState('')
    const [selectedCategory,setSelectedCategory] = useState({index:0,subCategories:[]})
    const [categories, setCategories] = useState([])

   useEffect(()=>{
      setCategories(props.restaurantInfo)
    },[props])
  
    function RestaurantHeader(){
  
      function selectCategory(category,index){
        console.log(category)
        setSelectedCategory({index:index,subCategories:category.subCategories})
      }

      function navigateToId(elementId){
        const container = document.querySelector('#menuContainerPrev')

        const element = document.querySelector(elementId)
        const scrollPosition = element.offsetTop-350
        console.log(scrollPosition)

        container.scrollTo({
          top: scrollPosition,
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
            {categories.map((category,index)=>
              <a key={index} className={styles.anchorLink} onClick={()=>navigateToId(`#category${index}`)}>
                <p onClick={()=>selectCategory(category,index)} className={styles.restaurantHeaderCategory}>
                  {category.categoryName}
                </p>
              </a>
            )}
          </div>
          {/* Subcategories Section */}
          <div className={styles.restaurantHeaderSubcategoryContainer}>
            {selectedCategory.subCategories.map((subCategory, index)=>
            <a key={index} onClick={()=>navigateToId(`#subCategory${selectedCategory.index}${index}`)} className={styles.anchorLink} >
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
            const itemAvailability = props.item.visible
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
    
          if(!props.subCategory.visible){
            return null
          }

          return(
            <div id={`subCategory${props.categoryIndex}${props.subCategoryIndex}`}>
              <h3>{props.subCategory.subCategoryName}</h3>
              {props.subCategory.subCategoryItens.map((item,index)=>
                <RestaurantItem key={index} item={item}/>
              )}
            </div>
            
          )
    
        }
        
        
        //Hides Category if visibility set to null
        if(!props.category.visible){
          return null
        }
        //Category HTML
        return(
          <div className={styles.restaurantCategoryContainer} id={`category${props.categoryIndex}`}>
            <h2 className={styles.catName}>{props.category.categoryName}</h2>
            {props.category.subCategories.map((subCategory,index)=>
                <RestaurantSubCategory key={index} categoryIndex={props.categoryIndex} subCategoryIndex={index} subCategory={subCategory}/>
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
    
         <section className={styles.main}>
          <RestaurantHeader />
          <div className={styles.restaurantMenuContainer} id='menuContainerPrev'>
            <h1>{props.restaurantName}</h1>
            <RestaurantMenu/>
          </div>
         </section>
       
     )
  
  }