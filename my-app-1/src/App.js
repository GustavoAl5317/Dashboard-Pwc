import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Headers from './components/scripts/header.js';
import Main from './components/scripts/main.js';
import MeuComponente from './components/Api/Api.js';



function App() {
  return (
	<div>
     	 	<Headers />
      		<MeuComponente />
   	 </div>
  );
}

export default App;
