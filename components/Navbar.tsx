import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../shared/context';
import { SignOutButton } from '../pages/enter';
export default function Navbar() {
   const { user, username } = useContext(UserContext);
   return (
      <nav className="navbar">
         <ul>
            <li>
               <Link href="/">
                  <button className="btn-logo">TeamUp</button>
               </Link>
            </li>
            {/* user is signed in and has a username */}
            {username && (
               <>
                  <li className="push-left">
                     <Link href="/admin">
                        <button className="btn-blue">Post</button>
                     </Link>
                  </li>
                  <li>
                     <SignOutButton></SignOutButton>
                  </li>
                  <li>
                     <Link href={`/${username}`}>
                        <img src={user?.photoURL}></img>
                     </Link>
                  </li>
               </>
            )}
            {/* user is NOT signed in OR has not yet created a username */}
            {!username && (
               <li>
                  <Link href="/enter">
                     <button className="btn-blue">Log in</button>
                  </Link>
               </li>
            )}
         </ul>
      </nav>
   );
}
