"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { checkRole } from "./roleChecker";
import { useQuery } from "@tanstack/react-query";
//TODO: Do it better
const RoleBasedRedirect: React.FC<{
  allowedRoles: string[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userRole =
          isLoaded && (user?.publicMetadata.role as string | "Пользователь");
        if (allowedRoles.includes(userRole)) {
          setHasAccess(true);
        }
        console.log(hasAccess);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    checkUserRole();
  }, [allowedRoles, user]);
  if (!hasAccess) {
    return <></>;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
