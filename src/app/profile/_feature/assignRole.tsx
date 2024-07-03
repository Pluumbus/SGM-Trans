"use client";
import { useState } from "react";
import {
  useMutation,
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Avatar } from "@nextui-org/react";

const queryClient = new QueryClient();

function AssignRoleComponent() {
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

  const { data, isLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const response = await fetch("/api/getUsers");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
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
      <div>
        {data &&
          data.map((user: any) => (
            <div key={user.id} className="border-small mt-3 rounded-xl">
              <Avatar src={user.avatar} />
              {user.userName}
            </div>
          ))}
      </div>
    </div>
  );
}

function AssignRole() {
  return (
    <QueryClientProvider client={queryClient}>
      <AssignRoleComponent />
    </QueryClientProvider>
  );
}

export default AssignRole;
