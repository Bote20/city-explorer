import { useState } from 'react';

export default function FormularDestinatie({ onAdd }) {
  const [oras, setOras] = useState('');
  const [tara, setTara] = useState('');
  const [zile, setZile] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (oras.trim() === '' || tara.trim() === '') {
      return;
    }

    const nouaDestinatie = {
      id: crypto.randomUUID(),
      oras: oras.trim(),
      tara: tara.trim(),
      zile: Number(zile) || 0,
      vizitat: false
    };

    onAdd(nouaDestinatie);

    setOras('');
    setTara('');
    setZile('');
  };

  return (
    <form className="formular" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Oraș" 
        value={oras} 
        onChange={(e) => setOras(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Țară" 
        value={tara} 
        onChange={(e) => setTara(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Zile" 
        value={zile} 
        onChange={(e) => setZile(e.target.value)} 
      />
      <button type="submit">Adaugă</button>
    </form>
  );
}