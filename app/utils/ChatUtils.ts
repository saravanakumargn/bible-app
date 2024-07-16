// fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//       "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
//       "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       "model": "openai/gpt-3.5-turbo",
//       "messages": [
//         {"role": "user", "content": "What is the meaning of life?"},
//       ],
//     })
//   });

const OPENROUTER_API_KEY = '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';


// type for chat history
export type ChatHistory = {
    role: 'user' | 'system' | 'assistant';
    content: string;
};


// const SYSTEM_MESSAGE = "Please answer all questions and provide explanations with references and citations from the Bible. Ensure that your responses are grounded in biblical teachings, including specific verses or passages where applicable.";

export async function getWarmWelcome(message?: string) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openai/gpt-3.5-turbo",
          "messages": [
            {"role": "user", "content": message},
          ],
        })
      });

        const data = await response.json();
        return data;
}

export async function getChatCompletions(chatHistory: ChatHistory[],contentLength = 'Short', chatRole?: string) {
    const SYSTEM_MESSAGE = `Please answer all questions with references and citations from the Bible.${chatRole ? ` Respond in the specified mode: ${chatRole}. ` : ' '}Ensure that the response is grounded in biblical teachings, including specific verses or passages where applicable. Content response length should be ${contentLength}.`;

    const chatMessages = [
        { "role": "system", "content": SYSTEM_MESSAGE },
        ...chatHistory,
    ]
    console.log('chatMessages',chatMessages);
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-3.5-turbo",
                "messages": chatMessages,
            })
        });
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.log('getChatCompletions : ', error);
    }


}