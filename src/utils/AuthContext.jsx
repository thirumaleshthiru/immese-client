import { useContext,createContext,useState } from "react";
import Cookies from 'js-cookie'
const AuthContext = createContext(null);

function AuthProvider({children}){
    const [token,setToken] = useState(Cookies.get("token") || "");
    const [id,setId] = useState(Cookies.get("id") || null);
    const [role,setRole] = useState(Cookies.get("role") || null);

    const login = (newToken, newRole, newId)=>{
        Cookies.set('role',newRole,{expires:1/24})
        Cookies.set('token',newToken,{expires:1/24})
        Cookies.set("id",newId,{expires:1/24})
        setToken(newToken)
        setRole(newRole)
        setId(newId)
    }

    const logout = ()=>{
        Cookies.remove('role')
        Cookies.remove('token')
        Cookies.remove("id")
        setToken("")
        setRole(null)
        setId(null)
    }

    return (
        <AuthContext.Provider value={{token,id,role,logout,login}}>
                {children}
        </AuthContext.Provider>
    )
}


function useAuth(){
    return useContext(AuthContext);
}

export {useAuth, AuthProvider}