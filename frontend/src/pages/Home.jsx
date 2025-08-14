import Scene from "../components/Scene";
import PropsPanel from "../components/PropsPanel";

export function Home() {
  return (
    <div className="full-view flex row gap10">
        <Scene className="full-h"/>
        <PropsPanel/>
    </div>
  );
}


export default Home;


