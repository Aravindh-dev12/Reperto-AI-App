def build_explanations(db, remedies, selected_rubrics):
    """
    Converts raw scoring output into clinical explanations.
    """

    rubric_map = {r.id: r.full_path_en if r.full_path_en else r.full_path for r in selected_rubrics}

    explained = []

    for rem in remedies:
        used = {}

        for c in rem["contributions"]:
            rid = c["rubric_id"]
            grade = c["grade"]

            name = rubric_map.get(rid, f"Rubric {rid}")

            if name not in used:
                used[name] = []
            used[name].append(grade)

        rubric_explanations = []
        for name, grades in used.items():
            rubric_explanations.append({
                "rubric": name,
                "grades": grades,
                "total": sum(grades)
            })

        explained.append({
            "remedy": rem["remedy_name"],
            "score": rem["score"],
            "rubrics": rubric_explanations
        })

    return explained
