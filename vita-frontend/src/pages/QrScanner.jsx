import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function MedicineQRPage({ onDoseTaken }) {
  const [mode, setMode] = useState("scan"); // scan | upload
  const [result, setResult] = useState(null);
  const [log, setLog] = useState([]);
  const [scanner, setScanner] = useState(null);

  // Map medicine → disease
  const diseaseMap = {
    Paracetamol: "diabetes",
    Metformin: "diabetes",
    Aspirin: "hypertension",
    Amoxicillin: "hypertension",
    Cetirizine: "asthma",
  };

  // Map disease → pet
  const petNames = {
    diabetes: "Glucobud",
    hypertension: "PulsePup",
    asthma: "Inhalo",
  };

  useEffect(() => {
    if (mode !== "scan") return;

    const qrScanner = new Html5Qrcode("reader");
    setScanner(qrScanner);

    qrScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        async (decodedText) => {
          if (!decodedText) return;

          await handleResult(decodedText);

          // ✅ stop scanner safely
          if (qrScanner._isScanning) {
            qrScanner.stop().then(() => qrScanner.clear()).catch(() => {});
          }
        },
        (error) => {
          if (error?.name !== "NotFoundException") {
            console.warn("QR Scan Error:", error);
          }
        }
      )
      .catch((err) => console.error("Failed to start QR scanner:", err));

    // cleanup
    return () => {
      if (qrScanner._isScanning) {
        qrScanner.stop().then(() => qrScanner.clear()).catch(() => {});
      }
    };
  }, [mode]);

  const handleResult = async (decodedText) => {
    let parsed;
    try {
      parsed = JSON.parse(decodedText);
    } catch {
      parsed = { name: decodedText };
    }

    const medicine = parsed.name || "Unknown Medicine";
    const disease = diseaseMap[medicine] || "diabetes";
    const petName = petNames[disease];

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await axios.post(`${API_BASE}/api/take`, {
        userId: "demoUser",
        disease,
      });

      if (onDoseTaken) {
        onDoseTaken(disease, res.data);
      }

      const newEntry = {
        medicine,
        disease,
        petName,
        time: new Date().toLocaleString(),
      };

      setResult(newEntry);
      setLog((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error("❌ Error sending dose:", err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const qrCode = new Html5Qrcode("reader-upload");
    try {
      const decodedText = await qrCode.scanFile(file, true);
      await handleResult(decodedText);
    } catch (err) {
      console.error("Upload scan error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan or Upload your Medicine QR here</h2>

      <div className="qr-container" style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("scan")}
          style={{
            margin: "5px",
            padding: "10px",
            background: mode === "scan" ? "#007bff" : "#ddd",
            color: "white",
            borderRadius: "8px",
          }}
        >
          Scan QR
        </button>
        <button
          onClick={() => setMode("upload")}
          style={{
            margin: "5px",
            padding: "10px",
            background: mode === "upload" ? "#28a745" : "#ddd",
            color: "white",
            borderRadius: "8px",
          }}
        >
          Upload QR
        </button>
      </div>

      {mode === "scan" && (
        <div id="reader" style={{ width: "320px", height: "320px", margin: "0 auto" }}></div>
      )}

      {mode === "upload" && (
        <div>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          <div id="reader-upload" style={{ display: "none" }}></div>
        </div>
      )}

      {result && (
        <div
          style={{
            width: "80%",
            margin: "20px auto",
            padding: "15px",
            border: "2px solid #28a745",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <h3>Dose Logged</h3>
          <p>
            {result.petName} took <b>{result.medicine}</b> ({result.disease})
          </p>
          <small>{result.time}</small>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ margin: "30px auto", textAlign: "left", width: "80%" }}>
          <h3>Scan History</h3>
          <ul>
            {log.map((entry, idx) => (
              <li className="scan-item" key={idx}>
                <b>{entry.medicine}</b> → {entry.petName} ({entry.disease}) at {entry.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
