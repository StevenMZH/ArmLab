import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout";

const Landing = lazy(() => import("./pages/Landing"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={
            <Suspense fallback={<div></div>}>
              <Landing />
            </Suspense> 
        } 
        />
        
        <Route path="/home" element={
            <Suspense fallback={<div></div>}>
              <Home />
            </Suspense>
          }
        />

        <Route path="*" element={
            <Suspense fallback={<div></div>}> 
            <NotFound />
            </Suspense>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;
