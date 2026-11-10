import { useState } from 'react'

export default function FormularBuget({ onCauta }) {
  const [buget, setBuget] = useState('')
  const [eroare, setEroare] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const numar = Number(buget)

    if (buget === '' || Number.isNaN(numar) || numar < 50) {
      setEroare('Bugetul este un număr de cel puțin 50 de euro.')
      return
    }

    setEroare('')
    onCauta(numar)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="number"
        placeholder="Buget maxim"
        value={buget}
        onChange={(event) => setBuget(event.target.value)}
      />
      <button type="submit">Caută</button>
      {eroare && <p className="eroare-camp">{eroare}</p>}
    </form>
  )
}
