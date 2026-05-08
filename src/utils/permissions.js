// src/utils/permissions.js

export const aggregatePermissions = (role) => {  
  // Vérifie si le rôle et l'objet Permission existent
  if (!role || !role.Permission) return {};
  
  const permissions = {};
  
  // On itère directement sur l'objet Permission du rôle unique
  for (const [key, value] of Object.entries(role.Permission)) {
    if (typeof value === "boolean") {
      permissions[key] = value;
    }
  }
  
  return permissions;
};