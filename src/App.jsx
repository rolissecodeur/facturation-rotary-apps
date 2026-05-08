import React from "react";

const App = ({ children }) => {
  // Ici, tu peux ajouter un layout global, navbars, sidebars, etc.
  return <>{children}</>;
};

export default App;

// // App.jsx
// import { SocketContext, socket } from "context/socket";

// const App = () => {
//   return (
//     <SocketContext.Provider value={socket}>
//       {/* Vos autres composants */}
//     </SocketContext.Provider>
//   );
// };

// export default App;
