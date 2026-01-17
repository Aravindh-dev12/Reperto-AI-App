import re

# ---------------------------
# CORE CLINICAL DICTIONARY
# (this is your MOAT – will grow)
# ---------------------------

NORMALIZATION_MAP = {
    # English → German repertory anchors
    "anxiety": ["angst"],
    "fear": ["angst", "furcht"],
    "restless": ["unruhe"],
    "restlessness": ["unruhe"],

    "sleep": ["schlaf"],
    "sleepless": ["schlaflosigkeit"],
    "insomnia": ["schlaflosigkeit"],

    "burning": ["brennender"],
    "burn": ["brennender"],
    "heat": ["hitze"],

    "pain": ["schmerz"],
    "ache": ["schmerz"],

    "stomach": ["magen"],
    "abdomen": ["magen"],

    # Hinglish / Indian clinical language
    "ghabrahat": ["angst"],
    "dar": ["angst"],
    "neend": ["schlaf"],
    "jalan": ["brennender"],
    "pet": ["magen"],
    "dard": ["schmerz"],
}

STOPWORDS = {
    "in", "on", "at", "the", "is", "are", "was", "were",
    "me", "hai", "ho", "rahi", "raha", "ke", "ko", "se"
}


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def normalize_input(text: str):
    """
    Input: free doctor text
    Output: list of canonical repertory tokens
    """

    cleaned = clean_text(text)
    tokens = cleaned.split()

    normalized_tokens = []

    for token in tokens:
        if token in STOPWORDS:
            continue

        if token in NORMALIZATION_MAP:
            normalized_tokens.extend(NORMALIZATION_MAP[token])
        else:
            normalized_tokens.append(token)

    return list(set(normalized_tokens))
