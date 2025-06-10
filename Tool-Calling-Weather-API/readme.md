# Weather Tool Example using AI SDK and Liara API

This example demonstrates how to use [Vercel's AI SDK](https://sdk.vercel.ai) with the [Liara AI API](https://docs.liara.ir/ai/about) to call a **custom tool function** for fetching the current weather in a specified city using natural language.

## 🧠 What It Does

- Uses the AI SDK's `generateText` function to process a natural language prompt.
- Registers a custom tool (`getCurrentWeather`) that fetches real-time weather data from [wttr.in](https://wttr.in).
- Allows the AI model to determine if the tool should be used, execute it, and output the result.

## 📦 Requirements

- Node.js (v18+)
- A Liara AI API key
- Internet access (to fetch weather data)

## 🛠️ Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-org/ai-sdk-examples.git
   cd ai-sdk-examples/weather-tool
   ```
   
2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Add Environment Variables**

   ```bash
   mv .env.example .env # and set the ENVs
   ```

4. **Run the App**

   ```bash
   node main.mjs
   ```

## 💡 How It Works

- The script initializes a tool getCurrentWeather that queries wttr.in for current weather data.
- A prompt ("What is the weather like in Tehran in fahrenheit today?") is sent to the AI model.
- If the model determines a tool is needed, it calls getCurrentWeather, passing the location and unit.
- The script logs the returned weather info.
