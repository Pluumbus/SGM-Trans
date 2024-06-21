import { useState } from "react";

function AssignRole() {
  const [userId, setUserId] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const assignRole = async () => {
    const response = await fetch("/api/setRole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });

    if (response.ok) {
      alert("Role assigned successfully");
    } else {
      alert("Error assigning role");
    }
  };

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
      <button onClick={assignRole}>Assign Role</button>
    </div>
  );
}

export default AssignRole;
