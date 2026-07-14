import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// StrictMode desactivado a propósito: monta los componentes dos veces en
// desarrollo, lo que duplica la instancia imperativa de Quill (editor de
// descripción) y rompe la escritura. Producción ya se comporta así.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
