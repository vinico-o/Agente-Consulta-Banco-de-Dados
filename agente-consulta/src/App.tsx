import { useState, type ChangeEvent } from 'react'
import './App.css'

function App() {
  return (
    <div className="chat-layout">
      <main className="chat-main">
        {/* Mensagem central */}
        <div className="hero-content">
          <h1 className="hero-title">Deseja realizar uma consulta?</h1>
        </div>

        {/* Parte inferior do site*/}
        <div className="bottom-container">
          {/* chat */}
          <div className="input-box">
            <input
              type="text"
              className="prompt-input"
              placeholder="Faça uma pergunta sobre o banco de dados..."
            />
          </div>

          {/* texto informativo sobre IA */}
          <p className="disclaimer-text">
            O agente de consulta pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App

