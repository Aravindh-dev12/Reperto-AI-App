import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

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
                        "      \"confidence\": number between 0 and 1,\n"
                        "      \"evidence\": string,\n"
                        "      \"category\": string (like 'Mind', 'Head', 'Stomach', etc.)\n"
                        "    }\n"
                        "  ]\n"
                        "}\n"
                        "Extract 3-5 key medical rubrics from the patient complaint. "
                        "Rubrics should follow the format 'Category > Subcategory > Symptom'. "
                        "Evidence should be a brief quote or summary from the text."
                    )
                },
                {"role": "user", "content": text}
            ],
            temperature=0.1,
            max_tokens=500
        )

        content = response.choices[0].message.content.strip()
        # Clean up the response (sometimes GPT adds markdown)
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        return json.loads(content)

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"Raw content: {content}")
        return {
            "summary": "AI analysis completed with some issues.",
            "risk": "medium",
            "rubrics": [
                {
                    "path": "General > Analysis > Error",
                    "confidence": 0.5,
                    "evidence": "AI response parsing failed",
                    "category": "General"
                }
            ]
        }
    except Exception as e:
        print(f"OPENAI ERROR: {e}")
        return {
            "summary": "AI analysis unavailable. Please try again.",
            "risk": "unknown",
            "rubrics": [
                {
                    "path": "General > Service > Unavailable",
                    "confidence": 0.6,
                    "evidence": "AI service temporarily unavailable",
                    "category": "General"
                }
            ]
        }