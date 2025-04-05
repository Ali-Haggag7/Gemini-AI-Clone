

// import {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } from "@google/generative-ai";
// const fs = require("node:fs");
// const mime = require("mime-types");

// const apiKey = "AIzaSyBrKO-HIubjeF6a7x_IllqFWgFCrWJ6A-8";
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseModalities: [
//     ],
//     responseMimeType: "text/plain",
// };

// async function run() {
//     const chatSession = model.startChat({
//         generationConfig,
//         history: [
//         ],
//     });

//     const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     // TODO: Following code needs to be updated for client-side apps.
//     const candidates = result.response.candidates;
//     for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//         for (let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//             const part = candidates[candidate_index].content.parts[part_index];
//             if (part.inlineData) {
//                 try {
//                     const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//                     fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//                     console.log(`Output written to: ${filename}`);
//                 } catch (err) {
//                     console.error(err);
//                 }
//             }
//         }
//     }
//     console.log(result.response.text());
// }

// export default run;


// // import {
// //     GoogleGenerativeAI,
// //     HarmCategory,
// //     HarmBlockThreshold,
// // } from "@google/generative-ai";

// // const MODEL_NAME = "gemini-2.0-flash";
// // const API_KEY = "AIzaSyBrKO-HIubjeF6a7x_IllqFWgFCrWJ6A-8";

// // async function runChat() {
// //     const genAI = new GoogleGenerativeAI(API_KEY);
// //     const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// //     const generationConfig = {
// //         temperature: 0.9,
// //         topK: 1,
// //         topP: 1,
// //         maxOutputTokens: 2048,
// //     };

// //     const safetySettings = [
// //         {
// //             category: HarmCategory.HARM_CATEGORY_HARASSMENT,
// //             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //         },
// //         {
// //             category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
// //             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //         },
// //         {
// //             category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
// //             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //         },
// //         {
// //             category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
// //             threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //         },
// //     ];

// //     const chat = model.startChat({
// //         generationConfig,
// //         safetySettings,
// //         history: [
// //             // ... (بقية الكود غير مرئية في الصورة)
// //         ],
// //     });

// //     const result = await chat.sendMessage(prompt);
// //     const response = result.response;
// //     console.log(response.text());
// // }

// // export default runChat;

// const apiKey = "AIzaSyBrKO-HIubjeF6a7x_IllqFWgFCrWJ6A-8";

// async function run() {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             contents: [{ role: "user", parts: [{ text: "INSERT_INPUT_HERE" }] }],
//             generationConfig: {
//                 temperature: 1,
//                 topP: 0.95,
//                 topK: 40,
//                 maxOutputTokens: 8192,
//             }
//         })
//     });

//     if (!response.ok) {
//         console.error("Error fetching response", response.statusText);
//         return;
//     }

//     const data = await response.json();
//     console.log(data);
// }

// export default run;


import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyB6W5Q6dwAxfQjgZ-rL7efenGN1Ba-ePgE" });

async function run(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });
    console.log(response.text);
    return response.text
}

export default await run;