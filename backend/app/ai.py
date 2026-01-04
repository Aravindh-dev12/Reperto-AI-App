# backend/app/ai.py
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def call_openai_parse(text: str):
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a clinical analysis assistant. "
                        "Extract key symptoms, generate medical rubrics, "
                        "assess risk level, and return ONLY valid JSON with fields: "
                        "summary, rubrics (array), risk."
                    )
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.0,
            max_tokens=400,
        )

        content = resp.choices[0].message.content.strip()
        return json.loads(content)

    except Exception as e:
        print("OPENAI ERROR:", e)
        return [
            {
                "path": "Head > Pain > Night",
                "confidence": 0.6,
                "evidence": "local fallback",
            }
        ]


def parse_text_endpoint(text: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a medical analysis assistant.\n"
                        "Return ONLY valid JSON with this exact structure:\n"
                        "{\n"
                        "  \"summary\": string,\n"
                        "  \"risk\": \"low\" | \"medium\" | \"high\",\n"
                        "  \"rubrics\": [\n"
                        "    {\n"
                        "      \"path\": string,\n"
                        "      \"confidence\": number,\n"
                        "      \"evidence\": string\n"
                        "    }\n"
                        "  ]\n"
                        "}\n"
                        "Do not return arrays of strings."
                    )
                },
                {"role": "user", "content": text}
            ],
            temperature=0.1
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print("OPENAI ERROR:", e)
        return {
            "summary": "AI unavailable",
            "risk": "unknown",
            "rubrics": [
                {
                    "path": "Head > Pain > Night",
                    "confidence": 0.6,
                    "evidence": "local fallback"
                }
            ]
        }
