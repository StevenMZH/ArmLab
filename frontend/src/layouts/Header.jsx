import { ThemeSwitch } from "../components/ThemeSwitch";

export function Header() {
    return (
        <>
            <div className="full-w row-left gap5">
                <img src="duck.png" alt="Logo" className="logo"/>
                <h1>Quackternion</h1>            
            </div>
            <div className="full-w row-right gap10">
                <ThemeSwitch />
                <button className="download-button hl2">Download</button>
            </div>
        </>
    );
}
export default Header;
