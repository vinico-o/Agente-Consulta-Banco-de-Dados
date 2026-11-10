import React, { useState } from 'react'
import './ConnectionModal.css'

interface ConnectionModalProps {
  onClose: () => void
  onSuccess: (tables: string[]) => void
}



function ConnectionModal({ onClose, onSuccess }: ConnectionModalProps) {
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')
    const [database, setDatabase] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const fazerConexao = async (e: React.FormEvent) => {
      e.preventDefault() // Impede a página de recarregar

  try {
    const response = await fetch('http://localhost:3001/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, database, user, password })
      })

      const data = await response.json()

      if(data.success) {
        alert("Conexão com o Banco foi concluída!")
        onSuccess(data.tables) //passa as tabelas para o App.tsx
        onClose()
      } else {
        alert(data.message)
      }
  } catch(e) {
    alert("Erro ao comunicar com o servidor Backend.")
  }
}

    return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Conectar ao Banco de Dados</h3>
        
        <form onSubmit={fazerConexao}>
          <label>IP</label>
          <input
            placeholder="ex: localhost"
            value={host}
            onChange={e => setHost(e.target.value)}
            required
          />
          <label>Porta</label>
          <input
            placeholder="ex: 5432"
            value={port}
            onChange={e => setPort(e.target.value)}
            required
          />
          <label>Nome do BD</label>
          <input
            placeholder="ex: meu_banco"
            value={database}
            onChange={e => setDatabase(e.target.value)}
            required
          />
          <label>Usuário</label>
          <input
            placeholder="ex: root"
            value={user}
            onChange={e => setUser(e.target.value)}
            required
          />
          <label>Senha</label>
          <input
            type="password"
            placeholder="ex: root"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="modal-buttons">
            <button 
              type="button"
              className="btn-cancel"
              onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-connect">
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConnectionModal

