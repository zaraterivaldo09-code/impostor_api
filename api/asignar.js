// api/asignar.js
import { supabase } from './_supabase.js';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id_categoria, num_jugadores, num_impostores } = req.body;

  if (!id_categoria || !num_jugadores || num_impostores === undefined) {
    return res.status(400).json({ error: 'id_categoria, num_jugadores y num_impostores son requeridos' });
  }

  if (num_impostores < 0 || num_impostores > num_jugadores) {
    return res.status(400).json({ error: 'num_impostores debe ser entre 0 y num_jugadores' });
  }

  // Obtener opciones de la categoría
  const { data: opciones, error } = await supabase
    .from('opciones')
    .select('*')
    .eq('id_categoria', id_categoria);

  if (error) return res.status(500).json({ error: error.message });
  if (!opciones || opciones.length === 0) {
    return res.status(404).json({ error: 'No hay opciones en esta categoría' });
  }

  // Elegir 1 opción aleatoria (el tema común)
  const opcionElegida = opciones[getRandomInt(opciones.length)];

  // Construir arreglo de asignaciones
  const asignaciones = new Array(num_jugadores).fill(opcionElegida.nombre);

  // Elegir índices únicos para impostores
  const indices = Array.from({ length: num_jugadores }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const impostorIndices = indices.slice(0, num_impostores);
  impostorIndices.forEach((idx) => {
    asignaciones[idx] = 'impostor';
  });

  // Responder como jugador1, jugador2, ...
  const resultado = asignaciones.map((valor, i) => ({ jugador: i + 1, valor }));
  return res.status(200).json({
    id_categoria,
    opcion: opcionElegida.nombre,
    num_jugadores,
    num_impostores,
    asignaciones: resultado,
  });
}


