import React, { useContext } from "react"
import { useQuery } from "react-query"
import * as apiClient from "../api-client"

type AppContext={
    isLoggedIn:boolean,
    isLoading:boolean
}

const AppContext=React.createContext<AppContext | undefined>(undefined)

export const AppContextProvider=({children}:{children:React.ReactNode})=>{
    const {isError,isLoading}=useQuery("validateToken",apiClient.validateToken,{retry:false})

    return(
        <AppContext.Provider value={{
            isLoggedIn:!isError,
            isLoading
        }}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext=()=>{
    const context=useContext(AppContext)
    return context as AppContext
}