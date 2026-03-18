import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide code or a project description." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing API key." },
        { status: 500 }
      );
    }

    const truncated = input.slice(0, 8000);

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an expert technical writer. Given code or a project description, generate a professional README.md in markdown format. Include these sections as appropriate: project title, description, features, installation, usage, tech stack, and license (MIT). Be concise but informative. Output ONLY the markdown content, no explanations.`,
            },
            {
              role: "user",
              content: truncated,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Groq API error:", res.status, errBody);
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const readme =
      data.choices?.[0]?.message?.content || "Failed to generate README.";

    return NextResponse.json({ readme });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
