import { useState } from "react";

function App() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");

  const handleSavePassword = async () => {
    const result = await window.electronAPI.keytarSave(account, password);
    if (result.success) {
      alert("Password saved successfully!");
    } else {
      alert("Error saving password: " + result.error);
    }
  };

  const handleGetPassword = async () => {
    const result = await window.electronAPI.keytarGet(account);
    if (result.success) {
      setRetrievedPassword(result.value || "No password found");
    } else {
      alert("Error retrieving password: " + result.error);
    }
  };

  const handleDeletePassword = async () => {
    const result = await window.electronAPI.keytarRemove(account);
    if (result.success) {
      alert("Password deleted successfully!");
      setRetrievedPassword("");
    } else {
      alert("Error deleting password: " + result.error);
    }
  };

  return (
      <div>
        <h1>Secure Password Storage</h1>
        <input
            type="text"
            placeholder="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSavePassword}>Save Password</button>
        <button onClick={handleGetPassword}>Retrieve Password</button>
        <button onClick={handleDeletePassword}>Delete Password</button>
        <p>Retrieved Password: {retrievedPassword}</p>
      </div>
  );
}

export default App;