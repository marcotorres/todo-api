export type Actions = "create" | "read" | "update" | "delete" | "complete" | "manage";
export type Subjects = "Task" | "User" | "all";

export interface Permission {
  action: Actions;
  subject: Subjects;
}

export interface UserAbilities {
  permissions: Permission[];
}

export const defineAbilitiesFor = (): UserAbilities => {
  const permissions: Permission[] = [
    { action: "create", subject: "Task" },
    { action: "read", subject: "Task" },
    { action: "update", subject: "Task" },
    { action: "delete", subject: "Task" },
    { action: "complete", subject: "Task" },
    { action: "read", subject: "User" },
    { action: "update", subject: "User" },
  ];

  return { permissions };
};

export const serializeAbilities = (abilities: UserAbilities): Permission[] => {
  return abilities.permissions;
};
