import { useState } from "react";

export const useDownloadDoc = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadDoc = async (docType = "pdf") => {
    setLoading(true);
    setError(null);

    try {
      // Obtener los objetos directamente desde localStorage
      const objects = JSON.parse(localStorage.getItem("Objects"));
      if (!objects) {
        alert("No object data available for download.");
        setLoading(false);
        return;
      }

      const data = {
        method: "quaternions",
        objects: objects
      };

      const backendDomain = process.env.REACT_APP_API_URL || "api.dev.quackternion.purpleblue.site";
      const apiUrl = backendDomain.startsWith("http") ? backendDomain : `https://${backendDomain}`;
        
      const response = await fetch(`${apiUrl}/api/procedure/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, doc: docType }),
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = docType === "pdf" ? "scene.pdf" : "scene.tex";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { downloadDoc, loading, error };
};
