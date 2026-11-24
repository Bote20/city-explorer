// Exercițiul 4b: raportul celor mai cerute adrese, montat la /api/jurnal
import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda ?? ''

  let sql = `SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
               FROM jurnal`
  const valori = []

  if (metoda !== '') {
    // Exercițiul 4c, varianta GREȘITĂ (doar pentru punctul 4 al fișei):
    // sql += ` WHERE metoda = '${metoda}'`

    // Varianta corectă: valoarea se trimite separat, ca parametru
    sql += ' WHERE metoda = ?'
    valori.push(metoda)
  }

  sql += `
   GROUP BY metoda, cale
   ORDER BY cereri DESC
   LIMIT 10`

  const [randuri] = await pool.query(sql, valori)

  // COUNT vine ca număr, dar AVG vine ca șir: se convertesc amândouă
  res.json(randuri.map((r) => ({
    ...r,
    cereri: Number(r.cereri),
    medie_ms: Number(r.medie_ms),
  })))
})

export default router
