// api/categorias.js
import { supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('categoria').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { nombre } = req.body;
    const { data, error } = await supabase.from('categoria').insert([{ nombre }]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).json({ error: "Método no permitido" });
}
