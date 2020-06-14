import React, { useState } from 'react';
import './App.css';

// JSX -> Sintaxe de XML dentro do JavaScript

import Header from './Header'

function App() {

  let [counter, setCounter] = useState(0) // [valor do estado, função para atualiazar o valor do estado]

  function handleButtonClick(){
    setCounter(counter++)
  }

  return (
    <div>
      <Header title="Hello World"/>
      
      <h1>Conteúdo da Aplicação</h1>
      <h2>{counter}</h2>
      <button type="button" onClick={handleButtonClick}>Aumentar</button>
    
    </div>
  );
}

export default App;
