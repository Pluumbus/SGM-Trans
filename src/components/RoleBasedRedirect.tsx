"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
//TODO: Do it better
const RoleBasedRedirect: React.FC<{
  allowedRoles: string[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userRole = user?.publicMetadata.role as string | "Guest";
        if (allowedRoles.includes(userRole)) {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    checkUserRole();
  }, [allowedRoles]);
  if (!hasAccess) {
    return <></>;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
