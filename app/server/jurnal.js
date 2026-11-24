// Exercițiul 4a: scrie în tabela jurnal un rând pentru fiecare cerere terminată
import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  // calea se reține aici, înainte de next(): în interiorul unui router req.path se schimbă
  const cale = req.originalUrl

  res.on('finish', async () => {
    const durata = Number(process.hrtime.bigint() - inceput) / 1e6

    try {
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale.slice(0, 255), res.statusCode, Math.round(durata)],
      )
    } catch (error) {
      // răspunsul a plecat deja, deci eroarea doar se afișează
      console.error('Jurnal: nu am putut scrie rândul:', error.message)
    }
  })

  next()
}
