import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux'
import storage from 'redux-persist/lib/storage'
// Redux Toolkit 默认已包含 thunk middleware，无需手动导入
import global from './modules/global'
import menu from './modules/menu'
import auth from './modules/auth'
import breadcrumb from './modules/breadcrumb'

// create reducer
const reducer = combineReducers({
  global,
  menu,
  auth,
  breadcrumb
})

// redux persist
const persistConfig = {
  key: 'redux-state',
  storage: storage
}
const persistReducerConfig = persistReducer(persistConfig, reducer)

// store
export const store = configureStore({
  reducer: persistReducerConfig,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: true
})

// create persist store
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useDispatch = () => useReduxDispatch<AppDispatch>()
