import { useState } from "react";
import { saveAs } from "file-saver";

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
        objects: objects,
        doc: docType,
      };

      const backendDomain =
        process.env.REACT_APP_API_URL ||
        "api.quackternion.purpleblue.site";

      const apiUrl = backendDomain.startsWith("http") ? backendDomain : `https://${backendDomain}`;
        
      const response = await fetch(`${apiUrl}/api/procedure/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const blob = await response.blob();
      saveAs(blob, docType === "pdf" ? "scene.pdf" : "scene.tex");

    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { downloadDoc, loading, error };
};
