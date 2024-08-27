import { useMutation, useQueryClient } from "react-query"
import * as apiClient from "../api-client"

const SignOutButton=()=>{
    const queryClient=useQueryClient();

    const mutation=useMutation(apiClient.signOut,{
        onSuccess:async()=>{
            await queryClient.invalidateQueries("validateToken")
        },
        onError:(error:Error)=>{
           throw new Error(error.message)
        }

    })

    const handleClick=()=>{
        mutation.mutate()
    }

    return(
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold
         bg-white hover:bg-gray-100">Sign Out</button>
    )
}
export default SignOutButton