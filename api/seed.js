// api/seed.js
import { supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Upsert categorias
    const categorias = [
      { id: 1, nombre: 'futbolistas' },
      { id: 2, nombre: 'selecciones' },
    ];

    const { error: catErr } = await supabase.from('categoria').upsert(categorias, {
      onConflict: 'id',
    });
    if (catErr) throw catErr;

    // Upsert opciones para cada categoria
    const opciones = [
      { id: 1, nombre: 'messi', id_categoria: 1 },
      { id: 2, nombre: 'ronaldo', id_categoria: 1 },
      { id: 3, nombre: 'paraguay', id_categoria: 2 },
      { id: 4, nombre: 'argentina', id_categoria: 2 },
    ];

    const { error: optErr } = await supabase.from('opciones').upsert(opciones, {
      onConflict: 'id',
    });
    if (optErr) throw optErr;

    return res.status(200).json({ message: 'Seed completado', categorias: categorias.length, opciones: opciones.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}


