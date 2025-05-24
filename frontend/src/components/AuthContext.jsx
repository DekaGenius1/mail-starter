import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const AuthContext = createContext({
  user: null,
  setUser: null,
  initialLoading: true
})

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get("/users/status", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    };

    checkStatus();
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
