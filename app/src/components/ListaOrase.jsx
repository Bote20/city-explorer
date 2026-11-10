import { useEffect, useState } from 'react'
import { getOrase } from '../api/orase.js'

export default function ListaOrase() {
  const [orase, setOrase] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getOrase()
        setOrase(date)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [])

  if (incarcare) return <p>Se încarcă...</p>
  if (eroare) return <p>A apărut o eroare: {eroare}</p>

  return (
    <ul>
      {orase.map((o) => (
        <li key={o.id}>{o.oras}, {o.tara} - {o.pret} euro</li>
      ))}
    </ul>
  )
}
