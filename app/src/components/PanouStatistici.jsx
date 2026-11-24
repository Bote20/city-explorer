// Laboratorul 5: panoul de statistici. Cifrele sunt calculate în SQL, de ruta /api/statistici;
// interfața doar le cere, câte o cerere la fiecare tastare.
import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [statistici, setStatistici] = useState(null)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    const pragNumar = Number(prag)

    // un prag gol sau invalid nu se trimite: serverul ar răspunde oricum cu 400
    if (!Number.isInteger(pragNumar) || pragNumar < 1) {
      setStatistici(null)
      return
    }

    async function incarca() {
      try {
        const date = await getStatistici(pragNumar, tara.trim())
        setStatistici(date)
        setEroare(null)
      } catch (error) {
        setEroare(error.message)
      }
    }

    incarca()
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>

      <div className="panou-filtre">
        <label>
          Cel puțin{' '}
          <input
            type="number"
            min="1"
            value={prag}
            onChange={(event) => setPrag(event.target.value)}
          />{' '}
          zile
        </label>

        <label>
          Țara{' '}
          <input
            type="text"
            className="panou-tara"
            placeholder="toate"
            value={tara}
            onChange={(event) => setTara(event.target.value)}
          />
        </label>
      </div>

      {eroare && <p className="stare eroare">Statistici indisponibile: {eroare}</p>}

      {!eroare && statistici && (
        <ul>
          <li>Destinații: {statistici.destinatii}</li>
          <li>Total zile: {statistici.zile}</li>
          <li>Media: {statistici.medie} zile</li>
        </ul>
      )}
    </section>
  )
}
