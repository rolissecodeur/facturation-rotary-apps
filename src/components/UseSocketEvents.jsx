import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/socket";

const useSocketEvents = () => {
  const [shouldRefreshSoul, setShouldRefreshSoul] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    const handleSoulAction = () => {
        console.log('soul_actionmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
      setShouldRefreshSoul((prev) => !prev);
    };

    socket.on("soul_created", handleSoulAction);
    socket.on("soul_updated", handleSoulAction);
    socket.on("soul_deleted", handleSoulAction);
    return () => {
      socket.off("soul_created", handleSoulAction);
      socket.off("soul_updated", handleSoulAction);
      socket.off("soul_deleted", handleSoulAction);
    };
  }, [socket]);

  return { shouldRefreshSoul };
};

export default useSocketEvents;
