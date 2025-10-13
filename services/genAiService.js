require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

let ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getCategoryForItem(itemName) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide one category for the following item: "${itemName}". Respond with only the category name.`,
    });

    return response.text;

    //response.status(200).json({ response: response.text });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = getCategoryForItem;
