import React, { useEffect, useState } from 'react';
import './css.api/flexBox.css';
import './css.api/text.css';
import './css.api/toggleColor.css';
import './css.api/button.css'
import sound from './alert-sound/news-ting-6832.mp3';
import { MdAudiotrack } from "react-icons/md";
import som from './images/som.png'

const MeuComponente = () => {
  const [dados, setDados] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const formatarTempo = (milissegundos) => {
    const horas = Math.floor(milissegundos / 3600000);
    const minutos = Math.floor((milissegundos % 3600000) / 60000);
    const segundos = ((milissegundos % 60000) / 1000).toFixed(0);

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  
  const playAudio = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audio = new Audio(sound);
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);
    audio.play();
  };

  const playAudioIfNeeded = (novosDados) => {
    const reproduzirAudio = audioEnabled && novosDados.some((item) => item.callswaiting >= 1);

    if (reproduzirAudio) {
      // Toca o áudio
      playAudio();
    }
  };

   useEffect(() => {
    const socket = new WebSocket('wss://10.179.241.22:80/informixdb');

    socket.onmessage = (event) => {
      const novosDados = JSON.parse(event.data);
      setDados(novosDados);

      // Chama a função para verificar a condição e tocar o áudio
      playAudioIfNeeded(novosDados);
    };

    return () => {
      if (socket.readyState === 1) { // <-- This is important
          socket.close();
      }
  }
  }, [audioEnabled]);

      // Chama a função para verificar a condição e tocar o // audioEnabled agora é uma dependência do useEffect

  const dadosFiltrados = dados.filter((item, index) => index !== 1);

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className='body'>
      <div className='bt-box'>
      <button
      onClick={handleToggleAudio}
      className={`bt-hab ${audioEnabled ? 'audio-enabled' : ''}`}
       >
       {audioEnabled ? 'Desativar Áudio' : 'Ativar Áudio'}
</button>
      </div>
      {dadosFiltrados.map((item, index) => (
        <div key={index} className='boxContainer'>
          <p className='text'>{item.csqname.replace(/^csq_/i, '').replace(/csq/gi, '').replace(/_/g, '')}</p>

          <div className='image-som'>
            {item.callswaiting >= 1 && (
            <img src={som} alt='som' className='' width={50} />
             )}
          </div>

          <div className='labelValueContainer'>
            <div className='labelBox'>Total</div>
            <div className='valueBox'>{item.totalcalls}</div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'> Atendidas</div>
            <div className='valueBox'>{item.callshandled}</div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'> Abandonadas</div>
            <div className={`valueBox ${item.callsabandoned > 1 ? 'yellow-bg' : ''} ${item.callsabandoned > 10 ? 'red-bg' : ''}`}>
              {item.callsabandoned}
            </div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'>Ag Disponíveis</div>
            <div className='valueBox'>{item.availableagents}</ div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'>Em atendimento</div>
            <div className={`valueBox ${item.talkingagents >= 1 ? 'green-bg' : ''}`}>{item.talkingagents}</div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'>Fila de espera</div>
            <div className={`valueBox ${item.callswaiting > 3 ? 'yellow-bg' : ''} ${item.callswaiting >= 1 ? 'red-bg' : ''}`}>
              {item.callswaiting} 
            </div>
          </div>
          <div className='labelValueContainer'>
            <div className='labelBox'>Tempo de espera</div>
            <div
              className={`valueBox ${item.oldestcontact > 3000 ? 'yellow-bg' : ''}`}
            >
              {formatarTempo(item.oldestcontact)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeuComponente;
