import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from '../styles/RestaurantCreator.module.css'
import RestaurantPreview from '../components/restaurantPreview'

//Images
import arrowUp from '../public/img/arrow-up.svg'
import arrowDown from '../public/img/arrow-down.svg'
import addButton from '../public/img/add-plus-circle.svg'
import trashCan from '../public/img/trash-full.svg'

export default function RestaurantCreator(){

  const [currentMenu, setCurrentMenu] = useState([])
  const [restaurantName, setRestaurantName] = useState('')

  const RestaurantMenuCreator = () =>{
   
    function addCategory(){
        let list = [...currentMenu];
        list.push({categoryName:'Category Name',subCategories:[]})
        setCurrentMenu(list)
       console.log(list)
    }
    
    async function saveMenu(){
  
      
      try {
        const response = await fetch("/api/createMenu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({restaurantName:restaurantName,categories:currentMenu}),
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

    const MenuCategory = (props) =>{

        function addSubcategory(){
           
            //updating the data inside the category
            let currentMenuArr = [...currentMenu]
            currentMenuArr[props.categoryIndex].subCategories.push({subCategoryName:'Subcategory Name',subCategoryItens:[]})

            setCurrentMenu(currentMenuArr)
            

        }

        /**
         * Changes the position of a category on your Menu
         * 
         * @param  {} categoryObj - The category Object you are changing position
         * @param  number currentPos - The current position of your Category
         * @param  number newPos - The new position of your category
         * 
         */
        function changeCategoryPosition(categoryObj,currentPos,newPos){
          //Makes a copy of the current State
          let arr = [...currentMenu]
          
          if(newPos < 0 ){return}

          //Removes the Item from current position
          arr.splice(currentPos,1)
          //Moves to the new postition
          arr.splice(newPos,0,categoryObj)

          //Saves into state
          setCurrentMenu(arr)
        }

        function deleteCategory(position){

             //Makes a copy of the current State
             let arr = [...currentMenu]
             //Removes the Item from current position
             arr.splice(position,1)
             //Saves into state
             setCurrentMenu(arr)

        }

        function updateCategoryName(name){
          let list = [...currentMenu];
          list[props.categoryIndex].categoryName = name
          setCurrentMenu(list)
        }
           
      //Category
      return(
        <div className={styles.restaurantCategoryContainer} id={`category${props.categoryIndex}`}>
          <div className={styles.categoryNameContainer}>
            <div className={styles.nameEditor}>
              <input type='text' defaultValue={props.category.categoryName} onBlur={e => updateCategoryName(e.target.value)} className='categoryNameEditor'/>
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={() => changeCategoryPosition(props.category,props.categoryIndex,props.categoryIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this category up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.categoryIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={() => changeCategoryPosition(props.category,props.categoryIndex,props.categoryIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this category down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>deleteCategory(props.categoryIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
            </div>
          </div>
          <div className={styles.subCategoriesContainer}>
            {props.category.subCategories.map((subCategory,index)=>
                <MenuSubCategory 
                  key={index} 
                  categoryIndex={props.categoryIndex} 
                  subCategoryIndex={index} 
                  subCategory={subCategory}
                />
              )
            }
          </div>
        
         <button className={styles.addButton} onClick={addSubcategory}>
          <Image 
            src={addButton}
            className={styles.addButtonImage}
            alt='add subcategory Button'
           />
           Add subcategory
         </button>
        </div>
      )
    }

    const MenuSubCategory = (props) =>{

      function updateSubcategoryName(name){
        let currentMenuArr = [...currentMenu]
        currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryName = name
        setCurrentMenu(currentMenuArr)
      }
      
      function addItem(){
          let currentMenuArr = [...currentMenu]
          currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens.push(
              {
                  itemName:'Item Name',
                  itemImage:'https://placehold.jp/80x80.png',
                  itemPrice:0.0,
                  itemAvailability:true,
                  itemDescription:'item description'
              }
          )
          setCurrentMenu(currentMenuArr) 
          
      }

      /**
       * Changes the position of a subcategory in your Category
       * 
       * @param  {} subcategoryObj - The subCategory Object you are changing position
       * @param  number currentPos - The current position of your SubCategory
       * @param  number newPos - The new position of your subcategory
       * 
      */
      function changeSubCategoryPosition(subcategoryObj,currentPos,newPos){
        //Makes a copy of the current State
        let arr = [...currentMenu]
        
          if(newPos < 0 ){return}

          //Removes the Item from current position
          arr[props.categoryIndex].subCategories.splice(currentPos,1)
          //Moves to the new postition
          arr[props.categoryIndex].subCategories.splice(newPos,0,subcategoryObj)

          //Saves into state
          setCurrentMenu(arr) 

      }
      
      /**
       * Deletes a subcategory in your Category
       * 
       * @param position - The position of your subcategory in the array
       * 
      */
      function deleteSubCategory(position){
        //Makes a copy of the current State
        let arr = [...currentMenu]

          //Removes the Item from current position
          arr[props.categoryIndex].subCategories.splice(position,1)

          //Saves into state
          setCurrentMenu(arr) 
      }



      //SubCategory
      return(
      <div className={styles.subCategoryContainer}>
          
          <div className={styles.subcategoryNameContainer}>
            <div className={styles.subcategoryNameEditor}>
              <input type='text' defaultValue={props.subCategory.subCategoryName} onBlur={e => updateSubcategoryName(e.target.value)} className={styles.categoryNameEditor}/>
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeSubCategoryPosition(props.subCategory,props.subCategoryIndex,props.subCategoryIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this subcategory up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.subCategoryIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeSubCategoryPosition(props.subCategory,props.subCategoryIndex,props.subCategoryIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this subcategory down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>deleteSubCategory(props.subCategoryIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
            </div>
          </div>
          
          <div className={styles.itemsContainer}>
            {props.subCategory.subCategoryItens.map((item,index)=>
              <MenuItem 
                key={index} 
                item={item} 
                itemIndex={index} 
                categoryIndex={props.categoryIndex} 
                subCategoryIndex={props.subCategoryIndex} 
              />
            )}
          </div>
          <button className={styles.addButton} onClick={addItem}>
            <Image 
              src={addButton}
              className={styles.addButtonImage}
              alt='Add item icon'
            />
            Add Item
          </button>
      </div>
      
      )

  }

    const MenuItem = (props) =>{
    
      function updateItemName(name){
        let currentMenuArr = [...currentMenu]
        currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens[props.itemIndex].itemName = name
        setCurrentMenu(currentMenuArr)
      }
      function updateItemDescription(description){
        let currentMenuArr = [...currentMenu]
        currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens[props.itemIndex].itemDescription = description
        setCurrentMenu(currentMenu)
      }
      function updateItemPrice(price){
        let currentMenuArr = [...currentMenu]
        currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens[props.itemIndex].itemPrice = price
        
        setCurrentMenu(currentMenuArr)
      }
  
    /**
     * Changes the position of an item in your subcategory
     * 
     * @param  {} itemObj - The item Object you are changing position
     * @param  number currentPos - The current position of your item
     * @param  number newPos - The new position of your item
     * 
    */
    function changeItemPosition(itemObj,currentPos,newPos){
      //Makes a copy of the current State
      let arr = [...currentMenu]
      
        if(newPos < 0 ){return}
  
        //Removes the Item from current position
        arr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens.splice(currentPos,1)
        //Moves to the new postition
        arr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens.splice(newPos,0,itemObj)
  
        //Saves into state
        setCurrentMenu(arr) 
  
    }
  
    function deleteItem(position){
      let arr = [...currentMenu]
      
      //Removes the Item from current position
      arr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens.splice(position,1)
  
      //Saves into state
      setCurrentMenu(arr) 
  
    }

    async function changeImage(image){

      if(image.size > 250000){
        console.log('File is too big')
        return
      }

      //Get a secure URL to upload the image
      const url = await fetch("/api/uploadPhotoItem").then( res => res.json())
      //console.log(url)

     
      //Upload the image
      await fetch(url,{
        method:'PUT',
        headers:{
          'Content-Type': image.type
        },
        body: image
      })
      .catch(err=>{
        console.log(err)
      })
      
      //Retrieve the image link
      const imageLink = url.split('?')[0]
      //console.log(imageLink)
     
      //Now we update the state of the menu to show the image
      let currentMenuArr = [...currentMenu]
      currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens[props.itemIndex].itemImage = imageLink
      
      setCurrentMenu(currentMenuArr)
      

    }
  
      //Item
      return(
          <div className={styles.itemContainer}>
            <div className={styles.itemDescriptionContainer}>
                <input type='text' defaultValue={props.item.itemName} onBlur={e=>updateItemName(e.target.value)} />
                <input type='text' defaultValue={props.item.itemDescription} onBlur={e=>updateItemDescription(e.target.value)} />
                <input type='number' defaultValue={props.item.itemPrice} onBlur={e=>updateItemPrice(e.target.value)} />
                <input type="file" onChange={e=>changeImage(e.target.files[0])} name="sampleFile" accept="image/*" />
            </div>
            <div className={styles.itemImageContainer}>
                <img src={props.item.itemImage} className={styles.itemImage} />
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeItemPosition(props.item,props.itemIndex,props.itemIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this item up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.itemIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeItemPosition(props.item,props.itemIndex,props.itemIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this item down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>deleteItem(props.itemIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
            </div>
          </div>
      )
  
    }

    const categoriesList = currentMenu.map((category,index)=>
    <MenuCategory 
        key={index} 
        categoryIndex={index} 
        category={category}
    />
    )

    //Restaurant Menu Creator
    return(
          <>
            <button onClick={addCategory} type='submit'>Add Category</button> 
            {categoriesList}
            <button onClick={saveMenu} type='button'>Create Menu</button>
          </>
        
    )

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
          </div>
          <div className={styles.previewContainer}>
            <h3>Preview</h3>
            <RestaurantPreview restaurantInfo={currentMenu} restaurantName={restaurantName} />
          </div>
        </div>
       </main>
     </>
   )

}