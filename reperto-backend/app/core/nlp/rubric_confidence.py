def compute_rubric_confidence(rubric, normalized_tokens):
    """
    Simple deterministic confidence scoring.

    rubric.full_path: "Magen, Schmerz, brennender"
    normalized_tokens: ["angst", "schlaf", "magen", "brennender"]

    Output: float between 0 and 1
    """

    text = rubric.full_path.lower()

    hits = 0
    matched = []

    for token in normalized_tokens:
        if token in text:
            hits += 1
            matched.append(token)

    if hits == 0:
        return 0.0, matched

    confidence = hits / len(normalized_tokens)

    # soft boost if deep rubric (more specific)
    depth_boost = min(rubric.depth * 0.05, 0.3)

    confidence = min(confidence + depth_boost, 1.0)

    return round(confidence, 3), matched
