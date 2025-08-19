import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useMediaQuery } from "react-responsive";
import { Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import MobileLayout from "./layouts/MobileLayout";


const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const Layout = isMobile ? MobileLayout : MainLayout;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={
            <Suspense fallback={<div></div>}>
              <Home />
            </Suspense>
          }
        />
        
        <Route path="/style" element={
            <Suspense fallback={<div></div>}>
              <Landing />
            </Suspense> 
        } 
        />
       <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
