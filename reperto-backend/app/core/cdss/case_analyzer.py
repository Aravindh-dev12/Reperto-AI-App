from app.core.nlp.rubric_mapper import map_text_to_rubrics
from app.core.repertory.scoring import score_remedies
from app.core.nlp.dataset_writer import store_phrase_mapping
from app.core.cdss.explanation import build_explanations
from app.ai import generate_cdss_insights



def analyze_case(db, doctor_text: str, top_rubrics=5, top_remedies=10):
    """
    Full CDSS pipeline.
    """

    # 1. Language understanding → rubric candidates
    tokens, ranked_rubrics = map_text_to_rubrics(db, doctor_text)

    # 1.1 Proprietary Dataset Capture
    store_phrase_mapping(db, doctor_text, tokens, ranked_rubrics)

    if not ranked_rubrics:
        return {
            "tokens": tokens,
            "rubrics": [],
            "remedies": [],
            "message": "No confident rubrics found"
        }

    # 2. Take top rubrics (simulate doctor confirmation)
    selected = ranked_rubrics[:top_rubrics]
    selected_rubrics = [item["rubric"] for item in selected]

    # 3. Deterministic repertory scoring
    raw_scores = score_remedies(db, selected_rubrics)
    explained_scores = build_explanations(db, raw_scores, selected_rubrics)
    
    # 3.1 AI Insights (Rationale & English Summary)
    rubric_paths = [r.full_path_en if r.full_path_en else r.full_path for r in selected_rubrics]
    insights = generate_cdss_insights(doctor_text, [{"rubric": p} for p in rubric_paths], explained_scores[:top_remedies])

    # 4. Final response build with Rationales
    final_rubrics = []
    for item in selected:
        path_en = item["rubric"].full_path_en if item["rubric"].full_path_en else item["rubric"].full_path
        final_rubrics.append({
            "rubric": path_en,
            "confidence": item["confidence"],
            "matched": item["matched_tokens"],
            "rationale": insights["rubric_rationales"].get(path_en, "Matched based on clinical tokens.")
        })

    final_remedies = []
    for rem in explained_scores[:top_remedies]:
        final_remedies.append({
            **rem,
            "rationale": insights["remedy_insights"].get(rem["remedy"], "Indicated based on cumulative rubric scores.")
        })

    return {
        "summary": insights["summary"],
        "tokens": tokens,
        "rubrics": final_rubrics,
        "remedies": final_remedies
    }

