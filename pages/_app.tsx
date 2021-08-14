import '../styles/globals.css';
import Navbar from 'components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from 'shared/context';
import { useUserData } from 'shared/hooks';

function MyApp({ Component, pageProps }) {
   // Hydrate all app with userData
   const userData = useUserData();

   return (
      <UserContext.Provider value={userData}>
         <Navbar />
         <Component {...pageProps} />
         {/* Provides Overlay when its triggered */}
         <Toaster />
      </UserContext.Provider>
   );
}

export default MyApp;
