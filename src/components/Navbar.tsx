import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useAuth } from '../hooks/useAuth'
import styles from './Navbar.module.css'

export const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link to="/">⚔️ Arc Raiders Companion</Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/database">Database</Link>
        </li>
        <li>
          <Link to="/lookup">Item Lookup</Link>
        </li>
        <li>
          <Link to="/meta">Meta</Link>
        </li>
        {user && (
          <>
            <li>
              <Link to="/my-stash">My Stash</Link>
            </li>
            <li>
              <Link to="/planner">Planner</Link>
            </li>
            <li>
              <Link to="/triage">Triage</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/loadouts">Loadouts</Link>
        </li>
      </ul>

      <div className={styles.userSection}>
        {user ? (
          <>
            <span className={styles.username}>{user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  )
}
