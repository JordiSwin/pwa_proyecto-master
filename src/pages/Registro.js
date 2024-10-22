import React from 'react';
import Navbar from '../components/Navbar';
import Formulario from '../components/registro/Form';
import Footer from '../components/Footer';
import '../styles/Home.css';

function Registro() {
  return (
    <div className="registro">
      <Navbar />
      <Formulario />
      <Footer />
    </div>
  );
}

export default Registro;
