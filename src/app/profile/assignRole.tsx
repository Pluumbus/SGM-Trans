import { useState } from "react";
import {
  useMutation,
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import getClerkClient from "@/utils/clerk/clerk";
import { User } from "@clerk/nextjs/server";

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

  const { data, error, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const clerk = await getClerkClient();
      const users = await clerk.users.getUserList();
      const userList = users.data.map((user: User) => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "No email",
      }));
      return userList;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
            <div key={user.id}>
              {user.id} - {user.email}
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
