import faviconUrl from '../assets/favicon.png';
import "./../styles.css";

export default function Header() {
    return (
        <header>
            <a className="home flex items-center" href="#">
                <img className="w-7.5 h-7.5 m-3" src={faviconUrl} alt="" />
                CineVault
            </a>
        </header>
    );
}
