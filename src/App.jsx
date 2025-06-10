import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

// Funzione debounce generica
function debounce(fn, delay) {
  let timer
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function App() {
  const [query, setQuery] = useState("")
  const [prodotti, setProdotti] = useState([])


  const fetchProducts = useCallback((term) => {
    if (!query.trim()) {
      setProdotti([])
      return
    }

    fetch(`http://localhost:3333/products?search=${term}`)
      .then(res => res.json())
      .then(data => setProdotti(data))
      .catch(err => {
        console.error('Errore nella chiamata API:', err)
        setProdotti([])
      })
  }, [])

  const debouncedFetch = useRef(debounce(fetchProducts, 300)).current

  useEffect(() => {
    debouncedFetch(query)
  }, [query, debouncedFetch])

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

