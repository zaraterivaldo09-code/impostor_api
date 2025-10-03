// api/opciones.js
import { supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id_categoria } = req.query;
    let query = supabase.from('opciones').select('*');
    if (id_categoria) {
      query = query.eq('id_categoria', Number(id_categoria));
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre, id_categoria } = req.body;
    if (!nombre || !id_categoria) {
      return res.status(400).json({ error: 'nombre e id_categoria son requeridos' });
    }
    const { data, error } = await supabase
      .from('opciones')
      .insert([{ nombre, id_categoria }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).json({ error: 'Método no permitido' });
}


