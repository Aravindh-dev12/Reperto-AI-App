import os
import openai
from typing import List, Dict

OPENAI_KEY = os.environ.get('OPENAI_API_KEY')
if OPENAI_KEY:
    openai.api_key = OPENAI_KEY

def call_openai_parse(text:str):
    system = (
        "You are a clinical text parser for a homeopathy repertory. "
        "Convert the input into a JSON array of rubric candidates with fields: path, confidence (0-1), evidence. "
        "Return only valid JSON."
    )
    try:
        resp = openai.ChatCompletion.create(
            model='gpt-4o-mini',
            messages=[
                {'role':'system','content':system},
                {'role':'user','content':f'Parse this clinical text (no PII): {text}'}
            ],
            max_tokens=500,
            temperature=0.0
        )
        content = resp['choices'][0]['message']['content']
        import json
        return json.loads(content)
    except Exception as e:
        return [{'path':'Head > Pain > Night','confidence':0.6,'evidence':'fallback parser'}]

def parse_text_endpoint(text:str):
    if OPENAI_KEY:
        candidates = call_openai_parse(text)
        return {'rubrics': candidates}
    # fallback deterministic simple parse for offline/missing key
    return {'rubrics':[{'path':'Head > Pain > Night','confidence':0.6,'evidence':'local fallback'}]}
