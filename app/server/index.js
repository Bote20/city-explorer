import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import raportJurnal from './rute/jurnal.js'

const app = express()

// Fișa, pregătirea: tipărește fiecare cerere primită (înaintea tuturor, ca să vadă și OPTIONS)
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

// Exercițiul 4d: jurnalul stă ÎNAINTEA lui cors(). cors() răspunde singur la cererile
// OPTIONS de verificare prealabilă, fără să mai apeleze next(), deci un jurnal pus după
// el nu le-ar vedea niciodată. (Pentru fișă, punctul 5.2, se mută temporar sub cors().)
app.use(jurnal)
app.use(cors()) // permite paginii de pe portul 5173 să folosească răspunsul
app.use(express.json()) // citește corpul cererilor POST și PATCH în req.body

const deTrimis = (d) => ({ ...d, id: String(d.id), vizitat: Boolean(d.vizitat) })

// Exercițiul 1b: toate destinațiile, ordonate după identificator
app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id',
  )

  res.json(randuri.map(deTrimis))
})

// Exercițiul 5a: căutarea exactă după oraș, cu parametru.
// Se scrie înaintea rutelor cu :id, ca „caut” să nu fie luat drept identificator.
app.get('/api/destinatii/caut', async (req, res) => {
  const oras = req.query.oras ?? ''

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [oras],
  )

  res.json(randuri.map(deTrimis))
})

// Exercițiul 2: adăugarea unei destinații, cu validare pe server
app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body

  const textValid = (v) => typeof v === 'string' && v.trim() !== ''

  if (!textValid(oras) || !textValid(tara) || !Number.isInteger(zile) || zile < 1 || zile > 30) {
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zile, false],
  )

  res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile,
    vizitat: false,
  })
})

// Exercițiul 3a: marcarea, doar câmpul vizitat
app.patch('/api/destinatii/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { vizitat } = req.body ?? {}

  if (!Number.isInteger(id) || typeof vizitat !== 'boolean') {
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'UPDATE destinatii SET vizitat = ? WHERE id = ?',
    [vizitat, id],
  )

  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [id],
  )

  res.json(deTrimis(randuri[0]))
})

// Exercițiul 3c: panoul de statistici
app.use('/api/statistici', statistici)

// Exercițiul 4b: raportul jurnalului
app.use('/api/jurnal', raportJurnal)

// Exercițiul 1c: ruta de ecou, temporară, pentru punctul 1 al fișei
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, () => {
  console.log(`API pornit pe http://localhost:${PORT}`)
})
