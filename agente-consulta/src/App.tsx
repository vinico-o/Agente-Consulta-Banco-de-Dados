import { useState } from 'react'
import './App.css'
import Menu from './Menu'
import ConnectionModal from './ConnectionModal'

function App() {

  //estado para identificar se o meu esta aberto ou fechado
  //setIsMenuOpen é a função do react para atualizar o isMenuOpern
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tables, setTables] = useState<string[]>([])
  const [dbName, setDbName] = useState<string>('')

  // inverte o valor atual do isMenuOpen
  const toggleMenu = () => {
    if (isMenuOpen === true) {
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(true)
    }
}

  return (
    <div className="chat-layout">
      {/* Exibe o Menu apenas se isMenuOpen for true */}
      <Menu isOpen={isMenuOpen} onAddDatabase={() => setIsModalOpen(true)} tables={tables} dbName={dbName} />
      {isModalOpen && (
      <ConnectionModal 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(novasTabelas, nomeDoBanco) => {
          setTables(novasTabelas)
          setDbName(nomeDoBanco)
        }}
      />
    )}
      
      <div className="menu-button-container">
        <button id="menu-button" type="button" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
        </button>
      </div>
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

