import { Outlet, Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "@/components/AuthContext"
import { ActiveLinkButton, Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import archivedIcon from "@/assets/archived.svg"
import composeIcon from "@/assets/compose.svg"
import inboxIcon from "@/assets/inbox.svg"
import sentIcon from "@/assets/sent.svg"
import logoutIcon from "@/assets/log-out.svg"
import loginIcon from "@/assets/login.svg"
import registerIcon from "@/assets/register.svg"
import axios from "axios"

export const RootLayout = () => {
  const { user, initialLoading, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const logoutUser = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="flex justify-between items-center border-b gap-2 py-4">
        <h1 className="text-2xl hidden md:inline-block">
          <Link to="/c/inbox">📮 Mail</Link>
        </h1>
        {initialLoading ? (
          <div className="flex w-full md:w-auto justify-evenly gap-4 md:ml-auto">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ) : user ? (
          <>
            <ul className="flex gap-2">
              <li>
                <ActiveLinkButton variant="outline" to="c/inbox">
                  <span className="hidden md:inline-block">Inbox</span>
                  <img className="md:hidden" src={inboxIcon} alt="" />
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton variant="outline" to="c/sent">
                  <span className="hidden md:inline-block">Sent</span>
                  <img className="md:hidden" src={sentIcon} alt="" />
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton variant="outline" to="c/archived">
                  <span className="hidden md:inline-block">Archived</span>
                  <img className="md:hidden" src={archivedIcon} alt="" />
                </ActiveLinkButton>
              </li>
              <li>
                <ActiveLinkButton variant="outline" to="compose">
                  <span className="hidden md:inline-block">Compose</span>
                  <img className="md:hidden" src={composeIcon} alt="" />
                </ActiveLinkButton>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold hidden md:block">
                {user.email}
              </h1>
              <Button variant="outline" onClick={logoutUser}>
                <span className="hidden md:inline-block">Log out</span>
                <img className="md:hidden" src={logoutIcon} alt="" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <ActiveLinkButton variant="outline" to="login">
              <span className="hidden md:inline-block">Login</span>
              <img className="md:hidden" src={loginIcon} alt="" />
            </ActiveLinkButton>
            <ActiveLinkButton variant="outline" to="register">
              <span className="hidden md:inline-block">Register</span>
              <img className="md:hidden" src={registerIcon} alt="" />
            </ActiveLinkButton>
          </div>
        )}
      </header>
      <main className="my-8">
        <Outlet />
      </main>
    </div>
  )
}
