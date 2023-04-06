import { configureStore } from '@reduxjs/toolkit'
import RestaurantMenuReducer from './restaurantSlice'

export default configureStore({
  reducer: {
    restaurantMenu: RestaurantMenuReducer
  }
})