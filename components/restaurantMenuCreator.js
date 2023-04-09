import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from '../styles/RestaurantCreator.module.css'
import { useDispatch, useSelector } from 'react-redux'

//Images
import arrowUp from '../public/img/arrow-up.svg'
import arrowDown from '../public/img/arrow-down.svg'
import addButton from '../public/img/add-plus-circle.svg'
import trashCan from '../public/img/trash-full.svg'
import hide from '../public/img/hide.svg'
import show from '../public/img/show.svg'

//Redux Actions
import {
  updateCategories,addSubCategory,changeCategoryPosition,deleteCategory,updateCategoryName,toggleCategoryVisibility,
  updateSubcategoryName,addItem,changeSubCategoryPosition,deleteSubCategory,changeSubCategoryVisibility,
  updateItemName,updateItemDescription,updateItemPrice,changeItemVisibility,changeItemPosition,changeItemImage,deleteItem
} from '../redux/restaurantSlice'

export default function RestaurantMenuCreator(props){

    //Redux code
    const currentMenu = useSelector((state) => state.restaurantMenu.categories)
    const dispatch = useDispatch()

    useEffect(()=>{
      if(props.restaurantInfo){
        console.log('I am an existent menu')
        dispatch(updateCategories(props.restaurantInfo))
      }
    },[props.restaurantInfo])
   
    function addCategory(){
        let list = [...currentMenu];
        list.push({categoryName:'Category Name',subCategories:[],visible:true})
        dispatch(updateCategories(list))
       console.log(list)
    }
    const MenuCategory = (props) =>{

        function addSubcategory(){
         dispatch(addSubCategory(props.categoryIndex))
        }

        /**
         * Changes the position of a category on your Menu
         * 
         * @param  {} categoryObj - The category Object you are changing position
         * @param  number currentPos - The current position of your Category
         * @param  number newPos - The new position of your category
         * 
         */
        function changeCatPos(categoryObj,currentPos,newPos){
          dispatch(changeCategoryPosition({categoryObj,currentPos,newPos}))
        }

        function deleteCat(position){
          dispatch(deleteCategory(position))
        }

        function updateCatName(name){
          dispatch(updateCategoryName({position:props.categoryIndex,newName:name}))
        }
        function showHideCategory(){
          dispatch(toggleCategoryVisibility(props.categoryIndex))
        }
        function categoryVisibility(){
          let list = [...currentMenu];
          if(list[props.categoryIndex].visible){
            return show
          }else{
            return hide
          }  
        }
           
      //Category
      return(
        <div className={styles.restaurantCategoryContainer} id={`category${props.categoryIndex}`}>
          <div className={styles.categoryNameContainer}>
            <div className={styles.nameEditor}>
              <input type='text' defaultValue={props.category.categoryName} onBlur={e => updateCatName(e.target.value)} className='categoryNameEditor'/>
              <Image src={categoryVisibility()} onClick={showHideCategory} className={styles.eye} alt='Change the visibility of this Item'/>
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={() => changeCatPos(props.category,props.categoryIndex,props.categoryIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this category up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.categoryIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={() => changeCatPos(props.category,props.categoryIndex,props.categoryIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this category down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>deleteCat(props.categoryIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
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

      function updateSubcatName(name){
        const infoObj={
          categoryIndex:props.categoryIndex,
          subCategoryIndex:props.subCategoryIndex,
          name:name
        }
        dispatch(updateSubcategoryName(infoObj))
      }
      
      function cataddItem(){
          const data={
            categoryIndex:props.categoryIndex,
            subCategoryIndex:props.subCategoryIndex
          }
        dispatch(addItem(data))   
      }
      /**
       * Changes the position of a subcategory in your Category
       * 
       * @param  {} subcategoryObj - The subCategory Object you are changing position
       * @param  number currentPos - The current position of your SubCategory
       * @param  number newPos - The new position of your subcategory
       * 
      */
      function changeSubCatPos(subcategoryObj,currentPos,newPos){
        const data = {
          categoryIndex:props.categoryIndex,
          currentPos:currentPos,
          newPos:newPos,
          subcategoryObj:subcategoryObj
        }

        dispatch(changeSubCategoryPosition(data))

      }     
      /**
       * Deletes a subcategory in your Category
       * 
       * @param position - The position of your subcategory in the array
       * 
      */
      function delSubCat(position){
        const data = {
          categoryIndex:props.categoryIndex,
          position:position,
        }
         dispatch(deleteSubCategory(data))
      }
      function showHideSubCategory(){
        const data = {
          categoryIndex:props.categoryIndex,
          position:props.subCategoryIndex
        }
        dispatch(changeSubCategoryVisibility(data))
      }
      function subcategoryVisibility(){
        const position = props.subCategoryIndex
        let list = [...currentMenu];
        if(list[props.categoryIndex].subCategories[position].visible){
          return show
        }else{
          return hide
        }  
      }


      //SubCategory
      return(
      <div className={styles.subCategoryContainer}>
          
          <div className={styles.subcategoryNameContainer}>
            <div className={styles.subcategoryNameEditor}>
              <input type='text' defaultValue={props.subCategory.subCategoryName} onBlur={e => updateSubcatName(e.target.value)} className={styles.categoryNameEditor}/>
              <Image src={subcategoryVisibility()} onClick={showHideSubCategory} className={styles.eye} alt='Change the visibility of this Item'/>
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeSubCatPos(props.subCategory,props.subCategoryIndex,props.subCategoryIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this subcategory up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.subCategoryIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeSubCatPos(props.subCategory,props.subCategoryIndex,props.subCategoryIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this subcategory down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>delSubCat(props.subCategoryIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
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
          <button className={styles.addButton} onClick={cataddItem}>
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
    
      function updateItName(name){
       const data={
        categoryIndex:props.categoryIndex,
        subCategoryIndex:props.subCategoryIndex,
        itemIndex:props.itemIndex,
        name:name
       }
       dispatch(updateItemName(data))
      }
      function updateItDescription(description){
        const data={
          categoryIndex:props.categoryIndex,
          subCategoryIndex:props.subCategoryIndex,
          itemIndex:props.itemIndex,
          description:description
         }
         dispatch(updateItemDescription(data))
      }
      function updateItPrice(price){
        const data={
          categoryIndex:props.categoryIndex,
          subCategoryIndex:props.subCategoryIndex,
          itemIndex:props.itemIndex,
          price:price
         }
         dispatch(updateItemPrice(data))
      }

      function changeItVisibility(){
        const data={
          categoryIndex:props.categoryIndex,
          subCategoryIndex:props.subCategoryIndex,
          itemIndex:props.itemIndex
         }
         dispatch(changeItemVisibility(data))
      }

      function itemVisibility(){

        let currentMenuArr = [...currentMenu]
        const itemVisible = currentMenuArr[props.categoryIndex].subCategories[props.subCategoryIndex].subCategoryItens[props.itemIndex].visible

        if(itemVisible){
          return show
        }else{
          return hide
        }
      }
  
    /**
     * Changes the position of an item in your subcategory
     * 
     * @param  {} itemObj - The item Object you are changing position
     * @param  number currentPos - The current position of your item
     * @param  number newPos - The new position of your item
     * 
    */
    function changeItemPos(itemObj,currentPos,newPos){

      const data={
        categoryIndex:props.categoryIndex,
        subCategoryIndex:props.subCategoryIndex,
        currentPos:currentPos,
        newPos:newPos,
        itemObj:itemObj
       }

      dispatch(changeItemPosition(data))
  
    }
  
    function delIt(position){
      const data={
        categoryIndex:props.categoryIndex,
        subCategoryIndex:props.subCategoryIndex,
        currentPos:position
       }

      dispatch(deleteItem(data))
  
    }

    async function changeImage(image){

      //Checks image size
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
      //Get errors
      .catch(err=>{
        console.log(err)
      })
      
      //Retrieve the image link
      const imageLink = url.split('?')[0]
      //console.log(imageLink)
     
      //Now we update the state of the menu to show the image 
      const data={
        categoryIndex:props.categoryIndex,
        subCategoryIndex:props.subCategoryIndex,
        itemIndex:props.itemIndex,
        imageLink:imageLink,
       }


      dispatch(changeItemImage(data))
      

    }
  
      //Item
      return(
          <div className={styles.itemContainer}>
            <div className={styles.itemDescriptionContainer}>
                <input type='text' defaultValue={props.item.itemName} onBlur={e=>updateItName(e.target.value)} />
                <input type='text' defaultValue={props.item.itemDescription} onBlur={e=>updateItDescription(e.target.value)} />
                <input type='number' defaultValue={props.item.itemPrice} onBlur={e=>updateItPrice(e.target.value)} />
                <input type="file" onChange={e=>changeImage(e.target.files[0])} name="sampleFile" accept="image/*" />
                <Image src={itemVisibility()} onClick={changeItVisibility} className={styles.eye} alt='Change the visibility of this Item'/>
            </div>
            <div className={styles.itemImageContainer}>
                <img src={props.item.itemImage} className={styles.itemImage} />
            </div>
            <div className={styles.positionEditor}>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeItemPos(props.item,props.itemIndex,props.itemIndex-1)} src={arrowUp} className={styles.arrow} alt='bring this item up'/>
              </div>
              <div className={styles.postionNumContainer}>
                <p className={styles.positionNum}>{props.itemIndex+1}</p>
              </div>
              <div className={styles.arrowContainer}>
                <Image onClick={()=>changeItemPos(props.item,props.itemIndex,props.itemIndex+1)} src={arrowDown} className={styles.arrow} alt='bring this item down'/>
              </div>
            </div>
            <div className={styles.trashContainer}>
              <Image onClick={()=>delIt(props.itemIndex)} src={trashCan} className={styles.trashIcon} alt='delete this item'/>
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
            <div className={styles.categoriesContainer}>
              {categoriesList}
            </div>
          </>
        
    )

  }