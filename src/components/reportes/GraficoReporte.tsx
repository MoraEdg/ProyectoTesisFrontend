import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import type { PuntoGrafico } from '../../types/reporte';

// Paleta corporativa + colores complementarios
const PALETTE = [
  '#054690', // UISEK azul
  '#7c3aed', // púrpura
  '#0891b2', // cyan
  '#16a34a', // verde
  '#ea580c', // naranja
  '#6b7280', // gris
  '#db2777', // rosa
  '#d97706', // ámbar
];

interface GraficoReporteProps {
  titulo: string;
  datos:  PuntoGrafico[];
  tipo:   'pie' | 'bar';
}

export default function GraficoReporte({ titulo, datos, tipo }: GraficoReporteProps) {
  const sinDatos = datos.length === 0 || datos.every((d) => d.total === 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{titulo}</h3>

      {sinDatos ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-300">
          <i className="fa-solid fa-chart-pie text-4xl mb-2" />
          <p className="text-sm">Sin datos</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          {tipo === 'pie' ? (
            <PieChart>
              <Pie
                data={datos}
                dataKey="total"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={72}
                labelLine={false}
                label={({ percent }: { percent: number }) =>
                  percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {datos.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | string) => [value, 'Total']}
              />
              <Legend
                formatter={(value: string) => (
                  <span style={{ fontSize: '12px', color: '#374151' }}>{value}</span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={datos} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(value: number | string) => [value, 'Total']} />
              <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                {datos.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
