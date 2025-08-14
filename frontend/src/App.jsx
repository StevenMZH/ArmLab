import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import { Navigate } from "react-router-dom";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
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
