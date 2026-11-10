// Exercițiul 5: pentru setul de două mii se pune temporar portul 3002
const API_URL = 'http://localhost:3001'

// Exercițiul 1a + 5c: cere o singură pagină, de câte 20 de destinații,
// și întoarce obiectul primit (data, pages, items, ...), nu doar lista
export async function getDestinatii(pagina = 1) {
  const response = await fetch(`${API_URL}/destinatii?_page=${pagina}&_per_page=20`)

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

export async function postDestinatie(d) {
  const response = await fetch(`${API_URL}/destinatii`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(d),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}

export async function patchVizitat(id, vizitat) {
  const response = await fetch(`${API_URL}/destinatii/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vizitat }),
  })

  if (!response.ok) {
    throw new Error(`Serverul a răspuns cu ${response.status}`)
  }

  return response.json()
}
