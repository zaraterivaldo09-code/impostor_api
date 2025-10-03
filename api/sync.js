// api/sync.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Ejemplo: consumir equipos de fútbol de Argentina
  const resp = await fetch("https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Argentina");
  const data = await resp.json();

  // Crear categoría si no existe
  let { data: cat } = await supabase.from('categoria').select('*').eq('nombre', 'selecciones').single();
  if (!cat) {
    const { data: newCat } = await supabase.from('categoria').insert([{ nombre: 'selecciones' }]).select().single();
    cat = newCat;
  }

  // Insertar equipos en opciones
  const equipos = data.teams.map(t => ({
    nombre: t.strTeam,
    id_categoria: cat.id
  }));

  const { error } = await supabase.from('opciones').insert(equipos);
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: "Opciones insertadas", count: equipos.length });
}
