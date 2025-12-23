
import { GoogleGenAI } from "@google/genai";

// Fix: Updated generateMenuDescription to follow the "create instance right before call" and "direct process.env.API_KEY usage" guidelines
export const generateMenuDescription = async (itemName: string, category: string): Promise<string> => {
  // Always use the required initialization format and create instance locally
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, appetizing, one-sentence culinary description for a restaurant menu item named "${itemName}" which is in the "${category}" category. Keep it elegant and professional.`,
    });
    // Property access .text used correctly for the extracted output
    return response.text?.trim() || "A delicious addition to our menu.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Freshly prepared with the finest ingredients.";
  }
};

// Fix: Refactored generateWittyGreeting to ensure the most up-to-date API key is used by initializing inside the function
export const generateWittyGreeting = async (restaurantName: string): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, witty, and warm thank you message for a restaurant receipt for a place called "${restaurantName}". Max 10 words.`,
    });
    return response.text?.trim() || "Thank you for dining with us!";
  } catch (error) {
    return "Thank you for dining with us!";
  }
};
