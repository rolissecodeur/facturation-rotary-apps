// src/hooks/useUsers.js

import { useState, useEffect } from 'react';
import { usersService } from '../services/users.service';

export function useUsers(options = {}) { // On accepte un objet d'options
  const { ministereId } = options;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        // On passe ministereId à l'appel de service
        const response = await usersService.all({ page: 1, perPage: 1000, ministereId });
        console.log(response?.data?.allUsers)
        setUsers(response?.data?.allUsers || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Impossible de charger la liste des conseillers.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [ministereId]); // <-- LA CORRECTION EST ICI !

  return { users, loading, error };
}