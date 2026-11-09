import './menu.css'

interface MenuProps {
  isOpen: boolean
  onAddDatabase: () => void
}

function Menu({ isOpen, onAddDatabase }: MenuProps) {
  return (
    <div className={`menu-container ${isOpen ? 'open' : ''}`}>
      <div className="model-name">
        <h2>Agente de Consulta</h2>
      </div>
      <div className="db-functions">
        <h2>Banco de Dados</h2>
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
      </div>
    </div>
  )
}

export default Menu