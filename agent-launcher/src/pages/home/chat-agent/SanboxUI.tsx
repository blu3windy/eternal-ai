import React, { useState } from "react";

const SandboxUI: React.FC = () => {
    const [port, setPort] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const startServer = async () => {
        setLoading(true);
        setLogs((prevLogs) => [...prevLogs, "Starting server..."]);

        try {
            if (window.electronAPI && window.electronAPI.startDynamicServer) {
                const assignedPort = await window.electronAPI.startDynamicServer();
                setPort(assignedPort);
                setLogs((prevLogs) => [...prevLogs, `✅ Server started on port ${assignedPort}`]);
            } else {
                throw new Error("🚨 window.electronAPI.startDynamicServer is undefined!");
            }
        } catch (error) {
            setLogs((prevLogs) => [...prevLogs, `❌ Error: ${error.message}`]);
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Electron Dynamic Server</h2>
            <button onClick={startServer} disabled={loading}>
                {loading ? "Starting..." : "Start Server"}
            </button>
            <div style={{ marginTop: "20px" }}>
                <h3>Logs:</h3>
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            </div>
            {port && (
                <>
                    <p>✅ Server running on port {port}</p>
                    <iframe
                        src={`http://localhost:${port}`}
                        width="100%"
                        height="400px"
                        sandbox="allow-scripts allow-forms"
                        style={{ border: "1px solid #ccc", marginTop: "10px" }}
                    ></iframe>
                </>
            )}
        </div>
    );
};

export default SandboxUI;
