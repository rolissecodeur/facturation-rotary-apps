import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Area 
} from 'recharts';

// Le composant pour l'infobulle est déjà parfait.
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700">
        <p className="font-bold text-lg mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EvolutionChart = ({ soulsData }) => {
  const chartData = useMemo(() => {
    // La logique de préparation des données est déjà parfaite et reste inchangée.
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = months.map(monthName => ({ name: monthName, nc: 0, nv: 0 }));
    const currentYear = new Date().getFullYear();

    if (soulsData) {
      soulsData.forEach(soul => {
        if (soul.dates) {
          const soulDate = new Date(soul.dates);
          if (!isNaN(soulDate.getTime()) && soulDate.getFullYear() === currentYear) {
            const monthIndex = soulDate.getMonth();
            if (soul.type === 'nc') {
              data[monthIndex].nc++;
            } else if (soul.type === 'nv') {
              data[monthIndex].nv++;
            }
          }
        }
      });
    }
    return data;
  }, [soulsData]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {/* Définition des dégradés de couleur */}
        <defs>
          <linearGradient id="colorNc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorNv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }} 
          domain={[0, dataMax => Math.max(150, dataMax + 20)]}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} />
        <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
        
        {/* Courbe pour les Nouveaux Convertis (nc) */}
        <Area 
          type="monotone" 
          dataKey="nc" 
          name="Nvx. Convertis" 
          stroke="#8B5CF6" // Violet
          strokeWidth={2}
          fillOpacity={0.6} // <-- ON AJOUTE DE LA TRANSPARENCE
          fill="url(#colorNc)"
          activeDot={{ r: 8 }} 
          dot={{ strokeWidth: 1, r: 4 }}
          // stackId="1" // <-- ON SUPPRIME L'EMPILAGE
        />
        {/* Courbe pour les Nouvelles Venues (nv) */}
        <Area 
          type="monotone" 
          dataKey="nv" 
          name="Nvx. Arrivants" 
          stroke="#14B8A6" // Bleu-vert (Teal)
          strokeWidth={2}
          fillOpacity={0.6} // <-- ON AJOUTE DE LA TRANSPARENCE
          fill="url(#colorNv)"
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 1, r: 4 }}
          // stackId="1" // <-- ON SUPPRIME L'EMPILAGE
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EvolutionChart;