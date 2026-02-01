import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Fetching user 
    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    useEffect(()=>{
        fetchUser()
    }, [])

    // Fetching user chat 
    const fetchUserChat = async () => {
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }
    
    useEffect(()=>{
        if(user){
            fetchUserChat()
        }
        else{
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    // Theme 
    useEffect(()=>{
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
        }
        else{
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const value = {navigate, user, setUser, chats, setChats, selectedChat, setSelectedChat, theme, setTheme}

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);