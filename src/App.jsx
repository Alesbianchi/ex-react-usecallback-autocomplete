import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState("")
  const [prodotti, setProdotti] = useState([])
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setProdotti([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetch(`http://localhost:3333/products?search=${query}`)
        .then(res => res.json())
        .then(data => setProdotti(data))
        .catch(err => {
          console.error('Errore nella chiamata API:', err)
          setProdotti([])
        })
    }, 300)
  }, [query])

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Cerca il tuo prodotto.."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {query && prodotti.length > 0 && (
          <div className='container'>
            {prodotti.map(product => (
              <p className='card' key={product.id}>{product.name}</p>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App

