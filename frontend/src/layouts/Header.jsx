import { ThemeSwitch } from "../components/ThemeSwitch";
import { useDownloadDoc } from "../hooks/useDownloadDoc";

export function Header() {
    const { downloadDoc, loading, error } = useDownloadDoc();

    const handleDownload = () => {
        downloadDoc("pdf"); // el hook se encarga de obtener los objetos
    };

    return (
        <>
            <div className="full-w row-left gap5">
                <img src="duck.png" alt="Logo" className="logo"/>
                <h1>Quackternion</h1>            
            </div>
            <div className="full-w row-right gap10">
                <ThemeSwitch />
                <button className="download-button hl2" onClick={handleDownload} disabled={loading}>
                    {loading ? "Downloading..." : "Download"}
                </button>
            </div>
            {/* {error && <p className="error-text">Error: {error.message}</p>} */}
        </>
    );
}

export default Header;
