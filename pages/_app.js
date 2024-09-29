// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/globals.css'


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Check if the current route is the login or register page
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  return (
    <SessionProvider session={session}>
      {!isAuthPage && <Navbar />} {/* Render Navbar only if not on login or register page */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
