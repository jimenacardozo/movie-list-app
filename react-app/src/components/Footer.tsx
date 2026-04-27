import greyFaviconUrl from '../assets/greyfavicon.png';
import './../styles.css';

export default function Footer() {
    return (
        <footer>
            <a className="home footer-title flex items-center" href="#">
                <img className="logo w-7.5 h-7.5 m-3" src={greyFaviconUrl} alt="CineVault Logo" />
                CineVault
            </a>
            <span>All movie data is fictional and for demonstration purposes only.</span>
        </footer>
    );
}
