// pages/_app.js
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Check for routes where you don't want the Navbar to appear
  const authRoutes = ['/login', '/register'];
  const isAuthPage = authRoutes.some((route) => router.pathname.startsWith(route));

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
