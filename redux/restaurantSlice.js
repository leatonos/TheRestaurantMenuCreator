import { createSlice, configureStore } from '@reduxjs/toolkit'

const restaurantSlice = createSlice({
  name: 'RestaurantMenu',
  initialState: {
    categories: [],
    restaurantName:''
  },
  reducers: {
    //Category Reducers
    updateCategories: (state,action) => {
      state.categories = action.payload
    },
    addSubCategory: (state,action) =>{    
      state.categories[action.payload].subCategories.push(
          {
            subCategoryName:'Subcategory Name',
            subCategoryItens:[],
            visible:true
          }
          ) 
    },
    changeCategoryPosition: (state,action)=>{ 
      const data = action.payload
      //Removes the Item from current position
      state.categories.splice(data.currentPos,1)
      //Moves to the new postition
      state.categories.splice(data.newPos,0,data.categoryObj)
    },
    deleteCategory:(state,action)=>{
      const data = action.payload
      //Removes the Item from current position
      state.categories.splice(data,1)
    },
    updateCategoryName:(state,action)=>{
      const position = action.payload.position
      const newName = action.payload.newName
      state.categories[position].categoryName = newName
    },
    toggleCategoryVisibility:(state,action)=>{
      const position = action.payload
      //inverts the visibility of a category
      state.categories[position].visible = !state.categories[position].visible
    },
    //SubCategory Reducers
    updateSubcategoryName:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryName = data.name
    },
    addItem:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens.push(
              {
                  itemName:'Item Name',
                  itemImage:'https://placehold.jp/80x80.png',
                  itemPrice:0.0,
                  visible:true,
                  itemDescription:'item description'
              }
          )
    },
    changeSubCategoryPosition:(state,action)=>{
      
      const data = action.payload

      if(data.newPos < 0 ){return}

      //Removes the Item from current position
      state.categories[data.categoryIndex].subCategories.splice(data.currentPos,1)
      //Moves to the new postition
      state.categories[data.categoryIndex].subCategories.splice(data.newPos,0,data.subcategoryObj)

    },
    deleteSubCategory:(state,action)=>{
      const data = action.payload
       //Removes the Item from current position
       state.categories[data.categoryIndex].subCategories.splice(data.position,1)
    },
    changeSubCategoryVisibility:(state,action)=>{

      const data = action.payload
      //inverts the visibility of this subcategory
      state.categories[data.categoryIndex].subCategories[data.position].visible = !state.categories[data.categoryIndex].subCategories[data.position].visible

    },
    //Items Reducers
    updateItemName:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].itemName = data.name
    },
    updateItemDescription:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].itemDescription = data.description
    },
    updateItemPrice:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].itemPrice = data.price
    },
    changeItemVisibility:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].visible =
      !state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].visible
      
    },
    changeItemPosition:(state,action)=>{
      const data = action.payload

      if(data.newPos < 0 ){return}

      //Removes the Item from current position
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens.splice(data.currentPos,1)
      //Moves to the new postition
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens.splice(data.newPos,0,data.itemObj)

    },
    deleteItem:(state,action)=>{
      const data = action.payload
      if(data.newPos < 0 ){return}
      //Removes the Item from current position
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens.splice(data.currentPos,1)

    },
    changeItemImage:(state,action)=>{
      const data = action.payload
      state.categories[data.categoryIndex].subCategories[data.subCategoryIndex].subCategoryItens[data.itemIndex].itemImage = data.imageLink
    }
  }
})

export const { 
  updateCategories,addSubCategory,changeCategoryPosition,deleteCategory,updateCategoryName,toggleCategoryVisibility,
  updateSubcategoryName,addItem,changeSubCategoryPosition,deleteSubCategory,changeSubCategoryVisibility,
  updateItemName,updateItemDescription,updateItemPrice,changeItemVisibility,changeItemPosition,changeItemImage,deleteItem

 } = restaurantSlice.actions

export default restaurantSlice.reducer