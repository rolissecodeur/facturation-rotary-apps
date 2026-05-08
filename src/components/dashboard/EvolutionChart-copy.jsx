// src/components/dashboard/EvolutionChart.jsx

import React, { useMemo } from 'react';
// CHANGÉ : On importe 'Line' au lieu de 'Bar'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  // NOUVEAU : On a besoin de ces éléments pour un graphique en courbes
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // NOUVEAU : Pour pouvoir remplir la zone sous la courbe
} from 'chart.js';

// CHANGÉ : On enregistre les nouveaux modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EvolutionChart = ({ soulsData }) => {
  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const ncData = Array(12).fill(0);
    const nvData = Array(12).fill(0);

    soulsData.forEach(soul => {
      if (soul.dates) {
        const soulDate = new Date(soul.dates);
        if (!isNaN(soulDate.getTime()) && soulDate.getFullYear() === currentYear) {
          const month = soulDate.getMonth();
          if (soul.type === 'nc') {
            ncData[month]++;
          } else if (soul.type === 'nv') {
            nvData[month]++;
          }
        }
      }
    });

    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    return {
      labels,
      datasets: [
        {
          // --- STYLE DU GRAPHIQUE EN COURBES (NC) ---
          label: 'Nouveaux Convertis (NC)',
          data: ncData,
          fill: true, // NOUVEAU : On active le remplissage
          // NOUVEAU : Couleur de la zone sous la courbe (avec transparence)
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          // Couleur de la ligne elle-même
          borderColor: 'rgba(59, 130, 246, 1)',
          // NOUVEAU : Pour avoir des courbes lissées et non des lignes droites
          tension: 0.4,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointRadius: 4,
        },
        {
          // --- STYLE DU GRAPHIQUE EN COURBES (NV) ---
          label: 'Nouvelles Venues (NV)',
          data: nvData,
          fill: true, // NOUVEAU : On active le remplissage
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
          pointRadius: 4,
        },
      ],
    };
  }, [soulsData]);

  // Les options restent les mêmes, elles s'appliquent aussi bien aux courbes
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter, sans-serif' },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#FFFFFF',
        bodyColor: '#E5E7EB',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#9CA3AF',
          precision: 0,
          stepSize: 20,
        },
        max: 100,
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      {/* CHANGÉ : On utilise le composant <Line> */}
      <Line options={options} data={chartData} />
    </div>
  );
};

export default EvolutionChart;