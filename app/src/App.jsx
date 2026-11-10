import { useEffect, useState } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import Cautare from './components/Cautare.jsx'
// Exercițiul 4 (temporar): se decomentează cele două linii marcate „Ex. 4”
// import PanouStatistici from './components/PanouStatistici.jsx'
import './App.css'

export default function App() {
  // Exercițiul 1b
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  // Exercițiul 2c
  const [seTrimite, setSeTrimite] = useState(false)
  // Exercițiul 3a
  const [cautare, setCautare] = useState('')
  // Exercițiul 5c
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  useEffect(() => {
    async function incarca() {
      setIncarcare(true)
      try {
        const raspuns = await getDestinatii(pagina)
        setDestinatii(raspuns.data)
        setTotalPagini(raspuns.pages)
        setEroare(null)
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [pagina])

  // Exercițiul 1c: întâi serverul, apoi starea, cu obiectul întors de server
  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)
    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (error) {
      setEroare(error.message)
    }
  }

  // Exercițiul 2c: întoarce true dacă destinația a ajuns pe server
  async function handleAdd(destinatie) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(destinatie)
      setDestinatii((curent) => [...curent, salvata])
      return true
    } catch (error) {
      setEroare(error.message)
      return false
    } finally {
      setSeTrimite(false)
    }
  }

  // Exercițiul 3b: se filtrează doar lista afișată, rezumatul rămâne pe toată starea
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) || d.tara.toLowerCase().includes(text),
  )

  const nevizitate = getNevizitate(destinatii)

  let continut
  if (incarcare) {
    continut = <p className="stare">Se încarcă destinațiile...</p>
  } else if (eroare) {
    continut = <p className="stare eroare">A apărut o eroare: {eroare}</p>
  } else {
    continut = (
      <>
        <Rezumat
          total={destinatii.length}
          nevizitate={nevizitate.length}
          zile={totalZile(nevizitate)}
        />
        <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
        <Cautare valoare={cautare} onChange={setCautare} />

        {/* Exercițiul 3c: două motive diferite pentru o listă goală */}
        {destinatii.length === 0 && (
          <p className="gol">
            Nu există încă nicio destinație. Adaugă prima destinație din formularul de mai sus.
          </p>
        )}
        {destinatii.length > 0 && afisate.length === 0 && (
          <p className="gol">Niciun rezultat pentru «{cautare.trim()}».</p>
        )}
        {afisate.length > 0 && (
          <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
        )}

        {/* Exercițiul 5c: paginarea */}
        <div className="paginare">
          <button type="button" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
            Înapoi
          </button>
          <span>pagina {pagina} din {totalPagini}</span>
          <button
            type="button"
            disabled={pagina >= totalPagini}
            onClick={() => setPagina(pagina + 1)}
          >
            Înainte
          </button>
        </div>
      </>
    )
  }

  return (
    <main>
      <h1>City Explorer</h1>
      {/* <PanouStatistici /> Ex. 4 */}
      {continut}
    </main>
  )
}
