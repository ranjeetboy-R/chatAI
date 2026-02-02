import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loadingUser, setLoadingUser] = useState(true)

    // Fetching user 
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/getUser', { headers: { Authorization: token } })
            if (data.success) {
                setUser(data.user)
            }
        }
        catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            setLoadingUser(false)
        }
    }

    // Create new chat
    const createNewChat = async () => {
        try {
            if (!user) return toast.error("Login to create a new chat")
            navigate('/')
            await axios.post('/api/chat/create', {}, { headers: { Authorization: token } })
            await fetchUserChat()
        }
        catch (error) {
            toast.error(error.response.data.message)
        }
    }

    // Fetching user chat 
    const fetchUserChat = async () => {
        try {
            const { data } = await axios.get('/api/chat/get', { headers: { Authorization: token } })
            if (data.success) {
                setChats(data.chats)

                if (data.chats.length === 0) {
                    await createNewChat()
                    return fetchUserChat()
                }
                else {
                    setSelectedChat(data.chats[0])
                }
            }
        }
        catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(() => {
        if (token) {
            fetchUser()
        }
        else {
            setUser(null)
            setLoadingUser(false)
        }
    }, [token])

    useEffect(() => {
        if (user) {
            fetchUserChat()
        }
        else {
            setChats([])
            setSelectedChat(null)
        }
    }, [user])

    // Theme 
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const value = {
        navigate,
        user, setUser,
        chats, setChats,
        selectedChat, setSelectedChat,
        theme, setTheme,
        createNewChat,
        fetchUserChat,
        loadingUser,
        token, setToken,
        axios
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);