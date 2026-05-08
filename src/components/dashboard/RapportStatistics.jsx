// src/components/dashboard/RapportStatistics.jsx
import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

export default function RapportStatistics({ data }) {
  const chartData = [
    { label: 'PAYÉES', value: data.paye || 0, color: '#22c55e' },
    { label: 'EN COURS', value: data.enCours || 0, color: '#3b82f6' },
    { label: 'IMPAYÉES', value: data.impaye || 0, color: '#ef4444' },
    { label: 'ANNULÉES', value: data.annule || 0, color: '#94a3b8' },
  ];

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          // CHANGEMENT : On met left à 0 ou 10 pour laisser de la place aux grands nombres
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid 
            strokeDasharray="4 4" 
            vertical={false} 
            stroke="#cbd5e1" 
            strokeOpacity={0.8} 
            className="dark:stroke-gray-700"
          />
          
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            fontSize={10} 
            fontWeight="900" 
            tick={{ fill: '#64748b' }} 
            dy={15} 
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            fontSize={11} 
            fontWeight="900" 
            tick={{ fill: '#64748b' }}
            // CHANGEMENT : 'auto' permet à Recharts de calculer 
            // des paliers propres (0, 100, 200...) automatiquement
            domain={[0, 'auto']} 
            allowDecimals={false}
            // OPTIONNEL : Ajoute un petit padding au texte pour ne pas coller
            tickMargin={10}
          />
          
          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
            contentStyle={{ 
                borderRadius: '20px', 
                border: 'none', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)', 
                fontSize: '12px', 
                fontWeight: '900',
                textTransform: 'uppercase',
                backgroundColor: '#fff',
                color: '#1e293b'
            }} 
          />
          
          <Bar 
            dataKey="value" 
            barSize={60} 
            radius={[15, 15, 15, 15]}
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}