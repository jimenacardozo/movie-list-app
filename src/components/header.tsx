import favicon from "../img/favicon.png";

export default function Header() {
    return <header>
        <a className="home" href="#">
            <img className="logo" src={favicon} alt="" />
            CineVault
        </a>
    </header>
}