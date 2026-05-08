import React from 'react';

// AJOUT de nuances plus foncées (600/500) pour être visibles sur le fond blanc de droite
const COLORS = [
  'bg-white/30',         // Visible sur le vert
  'bg-emerald-200/30',   // Visible sur le vert
  'bg-emerald-600/20',   // Visible sur le blanc !
  'bg-teal-600/20',      // Visible sur le blanc !
  'bg-cyan-500/20',      // Visible sur le blanc !
];

const NUM_FLAKES = 50; 

const FloatingShapesBackground = () => {
  const flakes = React.useMemo(() => {
    return Array.from({ length: NUM_FLAKES }).map((_, index) => {
      const size = Math.random() * 6 + 4; // Un peu plus gros pour être vus
      const left = Math.random() * 100; // 0 à 100% de la largeur de l'écran
      const animationDelay = Math.random() * 5; 
      const animationDuration = Math.random() * 10 + 10;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      return {
        id: index,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}vw`, // Utilisation de vw (viewport width) pour être sûr
          bottom: '-20px', 
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
        },
        // On garde l'animation, on s'assure que c'est arrondi
        className: `absolute block rounded-full ${color} animate-up-and-fade`,
      };
    });
  }, []);

  return (
    // CHANGEMENT CLÉ : 
    // 1. 'fixed' pour couvrir tout l'écran même si on scrolle
    // 2. 'z-10' pour être AU-DESSUS des fonds de couleur (vert et gris)
    // 3. 'pointer-events-none' pour qu'on puisse cliquer au travers sur le formulaire
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className={flake.className}
          style={flake.style}
        />
      ))}
    </div>
  );
};

export default FloatingShapesBackground;