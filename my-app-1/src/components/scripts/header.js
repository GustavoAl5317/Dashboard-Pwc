import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import style from '../css/images/images.css'
import bannerImage from '../Api/images/zyro-image.png'; // Importe a imagem desta forma

function Header() {
    return (
        <>
          <img src={bannerImage} className='img'></img>
        </>
      );
    }

export default Header;
