# ai.py
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv() 
openai_api_key = os.environ.get("OPENAI_API_KEY")
if not openai_api_key:
    import warnings
    warnings.warn("WARNING: OPENAI_API_KEY environment variable not set. AI features will not work!", RuntimeWarning)
client = OpenAI(api_key=openai_api_key or "")

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


def generate_cdss_insights(doctor_text: str, rubrics: list, remedies: list):
    """
    Generate medical rationales for selected rubrics and remedies.
    """
    try:
        rubric_list = [r["rubric"] for r in rubrics]
        remedy_list = [rem["remedy"] for rem in remedies]

        prompt = (
            f"Case Notes: {doctor_text}\n\n"
            f"Selected Rubrics: {', '.join(rubric_list)}\n"
            f"Ranked Remedies: {', '.join(remedy_list)}\n\n"
            "Analyze the above clinical data. Provide:\n"
            "1. A professional English summary of the patient's problem.\n"
            "2. A short rationale for why each rubric matches the case notes.\n"
            "3. A short clinical insight for why each remedy is indicated based on these rubrics.\n\n"
            "Return ONLY JSON in this format:\n"
            "{\n"
            "  \"summary\": \"string\",\n"
            "  \"rubric_rationales\": { \"rubric_path\": \"short rationale\" },\n"
            "  \"remedy_insights\": { \"remedy_name\": \"short insight\" }\n"
            "}"
        )

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a senior homeopathic clinical consultant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print("AI INSIGHT ERROR:", e)
        return {
            "summary": "Clinical analysis completed.",
            "rubric_rationales": {},
            "remedy_insights": {}
        }
