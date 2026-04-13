import faviconUrl from '../assets/favicon.png';

export default function Header() {
    return (
        <header>
            <a className="home" href="#">
                <img className="logo" src={faviconUrl} alt="" />
                CineVault
            </a>
        </header>
    );
}