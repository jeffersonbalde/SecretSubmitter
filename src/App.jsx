import { useEffect, useRef, useState } from "react";

function App() {
  const [role, setRole] = useState("guest");
  const [secret, setSecret] = useState("");
  const [storedSecrets, setStoredSecrets] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const cookieRoleEncoded = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];

    let decodedRole = "guest";

    if (!cookieRoleEncoded) {
      const encodedUser = btoa("guest");
      document.cookie = `role=${encodedUser}; path=/;`;
    } else {
      try {
        decodedRole = atob(cookieRoleEncoded);
        if (decodedRole !== "guest" && decodedRole !== "admin") {
          decodedRole = "guest";
        }
      } catch (error) {
        console.error("Invalid cookie, resetting:", error);
        decodedRole = "guest";
        const encodedUser = btoa("guest");
        document.cookie = `role=${encodedUser}; path=/;`;
      }
    }

    setRole(decodedRole);

    if (decodedRole === "guest") {
      localStorage.removeItem("user-secrets");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (secret.trim() === "") {
      alert("Please enter a secret.");
      inputRef.current?.focus(); 
      return;
    }

    const existingSecrets = JSON.parse(
      localStorage.getItem("user-secrets") || "[]"
    );
    const updatedSecrets = [...existingSecrets, secret];
    localStorage.setItem("user-secrets", JSON.stringify(updatedSecrets));

    alert("Thank you for submitting your secret!");
    setSecret(""); 
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (role === "admin") {
      const userSecrets = JSON.parse(
        localStorage.getItem("user-secrets") || "[]"
      );
      setStoredSecrets(userSecrets);
    }
  }, [role]);

  useEffect(() => {
    inputRef.current?.focus(); 
  }, []);

  return (
    <div style={{ padding: "1.5rem", textAlign: "center" }}>
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Secret Submitter
      </h1>

      {role === "admin" ? (
        <div>
          <h2
            style={{ fontSize: "1.5rem", fontWeight: "600", color: "#22c55e" }}
          >
            Admin Panel
          </h2>
          {storedSecrets.length > 0 && (
            <div style={{ marginTop: "1rem", color: "#f59e0b" }}>
              <p>🧾 Submitted Secrets:</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {storedSecrets.map((s, i) => (
                  <li key={i}>
                    <strong>•</strong> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p style={{ marginTop: "1rem" }}>
            WkRTaDRne2MwMGtpM3NfYXJlX3RyaWNreX0=
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <input
            ref={inputRef} 
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter your secret..."
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
              width: "50%",
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
              cursor: "pointer",
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