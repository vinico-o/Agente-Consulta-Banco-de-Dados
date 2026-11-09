import { useState } from 'react'
import './ConnectionModal.css'

interface ConnectionModalProps {
  onClose: () => void
}

function ConnectionModal({ onClose }: ConnectionModalProps) {
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')
    const [database, setDatabase] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Conectar ao Banco de Dados</h3>
        
        <form>
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

