"use client";
import getClerkClient from "@/utils/clerk/clerk";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function AssignRole() {
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const { mutate: setRoleMutation } = useMutation({
    mutationKey: ["setRole"],
    mutationFn: async () => {
      const response = await fetch("/api/setRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (response.ok) {
        alert("Роль выдана");
      } else {
        console.log(response);
        alert("Произошла непредвиденная ошибка");
      }
    },
  });
  const handleSetRole = () => {
    setRoleMutation();
  };
  const { data } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const clerk = await getClerkClient();
      return JSON.parse(JSON.stringify(clerk.users.getUserList()));
    },
  });

  return (
    <div>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button onClick={handleSetRole}>Добавить роль</button>
      <div> {data}</div>
    </div>
  );
}
