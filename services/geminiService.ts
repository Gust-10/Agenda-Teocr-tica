
export const fetchMotivationalQuote = async (): Promise<string> => {
  try {
    // Call our own serverless function proxy instead of the Gemini API directly.
    const response = await fetch('/.netlify/functions/get-quote');

    if (!response.ok) {
      // If the function returned an error, use a fallback.
      const errorData = await response.json();
      console.error("Error from serverless function:", errorData.error);
      return "El secreto para salir adelante es empezar.";
    }

    const data = await response.json();
    return data.quote;

  } catch (error) {
    console.error("Error fetching from serverless function:", error);
    // Fallback quote if the fetch itself fails
    return "La disciplina es el puente entre las metas y los logros.";
  }
};
