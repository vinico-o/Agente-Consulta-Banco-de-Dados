import { useState } from 'react'
import './menu.css'

interface MenuProps {
  isOpen: boolean
  onAddDatabase: () => void
  tables: string[]
  dbName: string
}

function Menu({ isOpen, onAddDatabase, tables, dbName }: MenuProps) {
  // estado para filtrar o nome das tabelas digitadas no campo de busca
  const [searchTerm, setSearchTerm] = useState('')

  // filtra as tabelas em tempo real com base no texto digitado
  const filteredTables = tables.filter((table) =>
    table.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`menu-container ${isOpen ? 'open' : ''}`}>
      <div className="model-name">
        <h2>Agente de Consulta</h2>
      </div>

      <div className="db-functions">
        <h2>Banco de Dados</h2>

        {/* Exibe o status e o nome do banco de dados conectado */}
        {dbName && (
          <div className="db-status-container">
            <span className="db-status-dot"></span>
            <span className="db-status-name" title={dbName}>
              {dbName}
            </span>
          </div>
        )}

        <button id="add-db-button" type="button" onClick={onAddDatabase}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Banco de Dados
        </button>
      </div>

      <div className="db-schema">
        <h2>Esquema</h2>

        {/* Campo de busca para filtrar as tabelas do banco */}
        {tables.length > 0 && (
          <div className="table-search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="table-search-input"
              placeholder="Buscar tabela..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Lista de tabelas em cascata com rolagem */}
        <div className="tables-list">
          {filteredTables.map((table) => (
            <div key={table} className="table-item" title={table}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
              </svg>
              <span>{table}</span>
            </div>
          ))}

          {/* Mensagem caso o filtro nao encontre nenhuma tabela */}
          {tables.length > 0 && filteredTables.length === 0 && (
            <p className="no-tables-text">Nenhuma tabela encontrada</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu