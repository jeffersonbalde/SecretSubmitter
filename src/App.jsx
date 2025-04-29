import { useEffect, useState } from "react";

function App() {
  const [role, setRole] = useState("guest");

  useEffect(() => {
    const cookieRoleEncoded = document.cookie
      .split('; ')
      .find(row => row.startsWith('role='))
      ?.split('=')[1];

    if (!cookieRoleEncoded) {
      const encodedUser = btoa('guest');
      document.cookie = `role=${encodedUser}; path=/;`;
      setRole('guest');
    } else {
      try {
        const decodedRole = atob(cookieRoleEncoded);

        if (decodedRole === "guest" || decodedRole === "admin") {
          setRole(decodedRole);
        } else {
          setRole(cookieRoleEncoded);
        }
      } catch (error) {
        console.error("Invalid cookie, resetting:", error);
        const encodedUser = btoa('guest');
        document.cookie = `role=${encodedUser}; path=/;`;
        setRole('guest');
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for submitting your secret!');
  };

  return (
    <div style={{ padding: "1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
        Secret Submitter
      </h1>

      {role === "admin" ? (
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#22c55e" }}>
            Admin Panel
          </h2>
          <p style={{ marginTop: "1rem" }}>
            Flag: ZDSh4g&#123;c00ki3s_are_tricky&#125;
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter your secret..."
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
              width: "50%"
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
} 

export default App;