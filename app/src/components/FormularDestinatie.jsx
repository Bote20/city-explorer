import { useState } from 'react'

const valoriInitiale = { oras: '', tara: '', zile: '' }

// Exercițiul 2b: întoarce un obiect cu mesaje; un câmp corect nu apare în el
export function valideaza(valori) {
  const erori = {}
  const zile = Number(valori.zile)

  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orașul are cel puțin două caractere.'
  }

  if (valori.tara.trim() === '') {
    erori.tara = 'Țara este obligatorie.'
  }

  if (valori.zile === '' || Number.isNaN(zile) || zile < 1 || zile > 30) {
    erori.zile = 'Numărul de zile este între 1 și 30.'
  }

  return erori
}

export default function FormularDestinatie({ onAdd, seTrimite }) {
  const [valori, setValori] = useState(valoriInitiale)
  const [erori, setErori] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const rezultat = valideaza(valori)
    setErori(rezultat)

    if (Object.keys(rezultat).length > 0) {
      return
    }

    const reusit = await onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    })

    if (reusit) {
      setValori(valoriInitiale)
    }
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          name="zile"
          type="number"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}
