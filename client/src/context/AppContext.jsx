import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

export const AppProvider = ({children}) =>{

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    });

    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [searchedCities, setSearchedCities] = useState([])
    const [rooms, setRooms] = useState([])

    const getToken = async() => token;

    const saveAuth = ({token: nextToken, user: nextUser})=>{
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    }

    const logout = ()=>{
        setToken("");
        setUser(null);
        setIsOwner(false);
        setShowHotelReg(false);
        setSearchedCities([]);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        navigate('/');
    }

    const login = async({email, password})=>{
        const { data } = await axios.post('/api/auth/login', {email, password});
        if(data.success){
            saveAuth({token: data.token, user: data.user});
            setIsOwner(data.user.role === "hotelOwner");
            return {success: true};
        }
        return {success: false, message: data.message || "Login failed"};
    }

    const register = async({username, email, password})=>{
        const { data } = await axios.post('/api/auth/register', {username, email, password});
        if(data.success){
            saveAuth({token: data.token, user: data.user});
            setIsOwner(data.user.role === "hotelOwner");
            return {success: true};
        }
        return {success: false, message: data.message || "Registration failed"};
    }

    const fetchRooms = async()=>{
        try {
            const { data } = await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async()=>{
        try {
            if(!token) return;

            // validate token and refresh cached user if needed
            if(!user){
                const meRes = await axios.get('/api/auth/me', {headers: {Authorization: `Bearer ${token}`}})
                if(meRes.data?.success){
                    setUser(meRes.data.user);
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(meRes.data.user));
                }
            }

            const {data} = await axios.get('/api/user', {headers: {Authorization: `Bearer ${token}`}})
            if(data.success){
                setIsOwner(data.role === "hotelOwner");
                setSearchedCities(data.recentSearchedCities || [])
            }else{
                logout();
            }
        } catch (error) {
            // Token expired/invalid -> force logout
            logout();
        }
    }

    useEffect(()=>{
        if(token){
            fetchUser();
        }else{
            setIsOwner(false);
            setSearchedCities([]);
        }
    },[token])

    useEffect(()=>{
        fetchRooms()
    },[])
    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner,
        setIsOwner,
        axios,
        showHotelReg,
        setShowHotelReg,
        searchedCities,
        setSearchedCities,
        rooms,
        setRooms,
        login,
        register,
        logout,
        toast,
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);
