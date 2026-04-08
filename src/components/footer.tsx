import greyfavicon from '../img/greyfavicon.png';

export default function Footer() {
    return <footer>
        <a className="home footer-title" href="#">
            <img className="logo" src={greyfavicon} alt="" />
            CineVault
        </a>
        <span>All movie data is fictional and for demonstration purposes
            only.
        </span>
    </footer>
}