"""
Golden Repertory Loader

This script extracts selected rubrics and their medical relations
from the raw OOREP database and builds Reperto AI's Golden Repertory.

This is NOT runtime code.
This is a controlled data build pipeline.
"""
# ============================================================
# GOLDEN CORE RUBRIC WHITELIST (Reperto AI v1 Medical Contract)
# ============================================================
CHAPTER_NORMALIZATION = {
    "Gemüt": "Mind",
    "Kopf": "Head",
    "Magen": "Stomach",
    "Schlaf": "Sleep",
    "Generalities": "Generalities"
}

# Translation Map: German -> English for Golden Core
RUBRIC_TRANSLATIONS = {
    "Gemüt, Angst": "Mind, anxiety",
    "Gemüt, Furcht": "Mind, fear",
    "Gemüt, Traurigkeit": "Mind, sadness",
    "Gemüt, Schwermut, geistige Depression": "Mind, sadness, mental depression",
    "Gemüt, Reizbarkeit": "Mind, irritability",
    "Gemüt, Zorn": "Mind, anger",
    "Gemüt, Ruhelosigkeit": "Mind, restlessness",
    "Gemüt, Verwirrung des Gemüts": "Mind, confusion",
    "Gemüt, Wahnvorstellungen": "Mind, delusions",
    "Gemüt, Stumpfheit": "Mind, dullness",
    "Gemüt, Gedächtnisschwäche": "Mind, memory, weakness of",
    "Gemüt, Konzentration, schwierig": "Mind, concentration, difficult",
    "Gemüt, vergesslich": "Mind, forgetful",
    "Gemüt, Erregung": "Mind, excitement",
    "Gemüt, Weinen": "Mind, weeping",
    "Gemüt, Gleichgültigkeit": "Mind, indifference",
    "Gemüt, Auffahren": "Mind, starting",
    "Gemüt, Bewusstlosigkeit": "Mind, unconsciousness",
    "Kopf, Schmerz": "Head, pain",
    "Kopf, Schwere": "Head, heaviness",
    "Kopf, Hitze": "Head, pulsating", # Note: Check OOREP mapping if heat vs pulsating
    "Kopf, Zusammenschnürungsgefühl": "Head, constriction",
    "Kopf, Kongestion": "Head, congestion",
    "Kopf, Schmerz, Stirn": "Head, pain, forehead",
    "Kopf, Schmerz, Schläfen": "Head, pain, temples",
    "Kopf, Schmerz, Hinterkopf": "Head, pain, occiput",
    "Kopf, Schmerz, Scheitel": "Head, pain, vertex",
    "Kopf, Schmerz, Seiten": "Head, pain, sides",
    "Kopf, Schmerz, drückender": "Head, pain, pressing",
    "Kopf, Schmerz, stechender": "Head, pain, stitching",
    "Kopf, Schmerz, reißender": "Head, pain, tearing",
    "Kopf, Schmerz, morgens": "Head, pain, morning",
    "Magen, Übelkeit": "Stomach, nausea",
    "Magen, Schmerz": "Stomach, pain",
    "Magen, Erbrechen": "Stomach, vomiting",
    "Magen, Aufstoßen": "Stomach, eructations",
    "Magen, Durst": "Stomach, thirst",
    "Magen, Schmerz, brennender": "Stomach, pain, burning",
    "Magen, Schmerz, krampfartiger": "Stomach, pain, cramping",
    "Magen, Schmerz, drückender": "Stomach, pain, pressing",
    "Magen, Schmerz, stechender": "Stomach, pain, stitching",
    "Magen, Schmerz, wunder": "Stomach, pain, sore",
    "Magen, Leeregefühl": "Stomach, emptiness",
    "Magen, Völlegefühl": "Stomach, fullness, sensation of",
    "Magen, Ausdehnung": "Stomach, distension",
    "Magen, Schwere": "Stomach, heaviness",
    "Magen, Würgen": "Stomach, retching",
    "Magen, Schluckauf": "Stomach, hiccough",
    "Magen, Aufstoßen, sauer": "Stomach, eructations, sour",
    "Magen, Durst, extremer": "Stomach, thirst, extreme",
    "Schlaf, Schläfrigkeit": "Sleep, sleepiness",
    "Schlaf, Schlaflosigkeit": "Sleep, sleeplessness",
    "Schlaf, Ruhelos": "Sleep, restless",
    "Schlaf, Nicht erfrischend": "Sleep, unrefreshing",
    "Schlaf, Tiefer": "Sleep, deep",
    "Schlaf, Aufwachen": "Sleep, waking",
    "Schlaf, Aufwachen, häufig": "Sleep, waking, frequent",
    "Schlaf, Aufwachen, früh": "Sleep, waking, early",
    "Schlaf, Schlaflosigkeit, nachts": "Sleep, sleeplessness, night",
    "Schlaf, Schlaflosigkeit, nachts, Mitternacht": "Sleep, sleeplessness, night, midnight",
    "Schlaf, Schläfrigkeit, abends": "Sleep, sleepiness, evening",
    "Schlaf, Schläfrigkeit, nachmittags": "Sleep, sleepiness, afternoon",
    "Schlaf, Träume": "Sleep, dreams",
    "Schlaf, Träume, ängstlich": "Sleep, dreams, anxious",
    "Schlaf, Träume, schreckhaft": "Sleep, dreams, frightful",
    "Schlaf, Träume, lebhaft": "Sleep, dreams, vivid",
    "Allgemeines, Schwäche": "Generalities, weakness",
    "Allgemeines, Schwäche, Entkräftung": "Generalities, weakness, enervation",
    "Allgemeines, Ohnmacht": "Generalities, faintness",
    "Allgemeines, Zittern": "Generalities, trembling",
    "Allgemeines, Schmerz": "Generalities, pain",
    "Allgemeines, Schmerz, brennender": "Generalities, pain, burning",
    "Allgemeines, Schmerz, drückender": "Generalities, pain, pressing",
    "Allgemeines, Schmerz, stechender": "Generalities, pain, stitching",
    "Allgemeines, Schmerz, Wundschmerz, wie zerschlagen": "Generalities, pain, sore, bruised",
    "Allgemeines, morgens": "Generalities, morning",
    "Allgemeines, nachmittags": "Generalities, afternoon",
    "Allgemeines, abends": "Generalities, evening",
    "Allgemeines, nachts": "Generalities, night",
    "Allgemeines, Hitze": "Generalities, heat",
    "Allgemeines, kalt": "Generalities, cold",
    "Allgemeines, Luft": "Generalities, air",
    "Allgemeines, draußen": "Generalities, air, open",
    "Allgemeines, Bewegung": "Generalities, motion",
    "Allgemeines, Gehen": "Generalities, walking",
    "Allgemeines, Liegen, beim": "Generalities, lying",
    "Allgemeines, Essen": "Generalities, food",
}


GOLDEN_CORE_RUBRICS = [
    # ---------------- MIND ----------------
    "Mind, anxiety",
    "Mind, fear",
    "Mind, sadness",
    "Mind, sadness, mental depression",
    "Mind, irritability",
    "Mind, anger",
    "Mind, restlessness",
    "Mind, confusion",
    "Mind, delusions",
    "Mind, dullness",
    "Mind, memory, weakness of",
    "Mind, concentration, difficult",
    "Mind, forgetful",
    "Mind, excitement",
    "Mind, weeping",
    "Mind, indifference",
    "Mind, starting",
    "Mind, unconsciousness",

    # ---------------- HEAD ----------------
    "Head, pain",
    "Head, heaviness",
    "Head, heat",
    "Head, pulsating",
    "Head, constriction",
    "Head, congestion",

    "Head, pain, forehead",
    "Head, pain, temples",
    "Head, pain, occiput",
    "Head, pain, vertex",
    "Head, pain, sides",

    "Head, pain, pressing",
    "Head, pain, stitching",
    "Head, pain, tearing",
    "Head, pain, morning",

    # ---------------- STOMACH ----------------
    "Stomach, nausea",
    "Stomach, pain",
    "Stomach, vomiting",
    "Stomach, eructations",
    "Stomach, thirst",

    "Stomach, pain, burning",
    "Stomach, pain, cramping",
    "Stomach, pain, pressing",
    "Stomach, pain, stitching",
    "Stomach, pain, sore",

    "Stomach, emptiness",
    "Stomach, fullness, sensation of",
    "Stomach, distension",
    "Stomach, heaviness",

    "Stomach, retching",
    "Stomach, hiccough",
    "Stomach, eructations, sour",
    "Stomach, thirst, extreme",

    # ---------------- SLEEP ----------------
    "Sleep, sleepiness",
    "Sleep, sleeplessness",
    "Sleep, restless",
    "Sleep, unrefreshing",
    "Sleep, deep",

    "Sleep, waking",
    "Sleep, waking, frequent",
    "Sleep, waking, early",

    "Sleep, sleeplessness, night",
    "Sleep, sleeplessness, night, midnight",
    "Sleep, sleepiness, evening",
    "Sleep, sleepiness, afternoon",

    "Sleep, dreams",
    "Sleep, dreams, anxious",
    "Sleep, dreams, frightful",
    "Sleep, dreams, vivid",

    # ---------------- GENERALITIES ----------------
    "Generalities, weakness",
    "Generalities, weakness, enervation",
    "Generalities, faintness",
    "Generalities, trembling",

    "Generalities, pain",
    "Generalities, pain, burning",
    "Generalities, pain, pressing",
    "Generalities, pain, stitching",
    "Generalities, pain, sore, bruised",

    "Generalities, morning",
    "Generalities, afternoon",
    "Generalities, evening",
    "Generalities, night",

    "Generalities, heat",
    "Generalities, cold",
    "Generalities, air",
    "Generalities, air, open",

    "Generalities, motion",
    "Generalities, walking",
    "Generalities, lying",

    "Generalities, food",
]


from sqlalchemy.orm import Session
from app.core.repertory.models import GoldenRubric, GoldenRemedy, GoldenRubricRemedy
from sqlalchemy import text

def verify_core_rubrics_exist(oorep_db):
    """
    Verifies that all Golden Core rubrics exist in OOREP.
    Returns a mapping: fullpath -> oorep_row
    """

    found = {}
    missing = []

    query = text("""
        SELECT id, fullpath, mother
        FROM rubric
        WHERE fullpath = :fp
    """)

    for fp in GOLDEN_CORE_RUBRICS:
        result = oorep_db.execute(query, {"fp": fp}).fetchall()

        if not result:
            missing.append(fp)
        else:
            # Normally exactly 1 row
            found[fp] = result

    print("========== GOLDEN RUBRIC VERIFICATION ==========")
    print(f"Total expected: {len(GOLDEN_CORE_RUBRICS)}")
    print(f"Found: {len(found)}")
    print(f"Missing: {len(missing)}")

    if missing:
        print("\n❌ Missing rubrics:")
        for m in missing:
            print(" -", m)

    if len(found) != len(GOLDEN_CORE_RUBRICS):
        raise Exception("Rubric verification failed. Fix missing rubrics before proceeding.")

    print("\n✅ All Golden Core rubrics verified successfully.")
    return found


def resolve_rubric_hierarchy(oorep_db, starting_rows):
    """
    Given verified OOREP rubric rows,
    recursively resolve all parent rubrics to build full hierarchy.

    Returns:
        dict[oorep_id] = {
            "id": int,
            "fullpath": str,
            "mother": int | None,
            "chapter": str,
            "depth": int
        }
    """

    all_nodes = {}

    query = text("""
        SELECT id, fullpath, mother
        FROM rubric
        WHERE id = :rid
    """)

    def walk_up(rid, depth=0):
        if rid in all_nodes:
            return

        row = oorep_db.execute(query, {"rid": rid}).fetchone()
        if not row:
            return

        fullpath = row.fullpath
        mother = row.mother

        raw_chapter = fullpath.split(",")[0].strip()
        chapter = CHAPTER_NORMALIZATION.get(raw_chapter, raw_chapter)

        

        all_nodes[rid] = {
            "id": rid,
            "fullpath": fullpath,
            "mother": mother,
            "chapter": chapter,
            "depth": None  # filled later
        }

        if mother:
            walk_up(mother, depth + 1)

    # start walking from all golden rubrics
    for rows in starting_rows.values():
        for r in rows:
            walk_up(r.id)

    # after collecting all, compute depth properly
    def compute_depth(rid):
        node = all_nodes[rid]
        if not node["mother"]:
            node["depth"] = 0
        else:
            parent = all_nodes.get(node["mother"])
            if parent["depth"] is None:
                compute_depth(parent["id"])
            node["depth"] = parent["depth"] + 1

    for rid in all_nodes:
        if all_nodes[rid]["depth"] is None:
            compute_depth(rid)

    print("\n========== RUBRIC HIERARCHY RESOLVED ==========")
    print("Total unique rubric nodes (including parents):", len(all_nodes))

    return all_nodes
def insert_golden_rubrics(golden_db, resolved_nodes):
    """
    Inserts resolved rubric hierarchy into golden_rubrics table.
    Ensures parents are inserted before children.
    """

    print("\n========== INSERTING GOLDEN RUBRICS ==========")

    # sort by depth so parents go first
    nodes_sorted = sorted(
        resolved_nodes.values(),
        key=lambda x: x["depth"]
    )

    oorep_to_golden = {}

    for node in nodes_sorted:
        # check if already exists
        existing = golden_db.query(GoldenRubric).filter_by(
            oorep_id=node["id"]
        ).first()

        if existing:
            oorep_to_golden[node["id"]] = existing.id
            continue

        parent_golden_id = None
        if node["mother"]:
            parent_golden_id = oorep_to_golden.get(node["mother"])

        full_path_en = RUBRIC_TRANSLATIONS.get(node["fullpath"], node["fullpath"])
        text_en = full_path_en.split(",")[-1].strip()

        rubric = GoldenRubric(
            chapter=node["chapter"],
            text=node["fullpath"].split(",")[-1].strip(),
            text_en=text_en,
            full_path=node["fullpath"],
            full_path_en=full_path_en,
            parent_id=parent_golden_id,
            depth=node["depth"],
            oorep_id=node["id"]
        )

        golden_db.add(rubric)
        golden_db.flush()  # get rubric.id

        oorep_to_golden[node["id"]] = rubric.id

    golden_db.commit()

    print("✅ Golden rubrics inserted successfully.")
    print("Total rubrics in Golden Core:", len(oorep_to_golden))

    return oorep_to_golden

def insert_golden_remedies(golden_db, oorep_db, oorep_rubric_ids):
    """
    Extracts and inserts all remedies linked to selected rubrics.
    Returns mapping: oorep_remedy_id -> golden_remedy_id
    """

    print("\n========== EXTRACTING GOLDEN REMEDIES ==========")

    # Step 1: get all unique remedy IDs for these rubrics
    remedy_query = text("""
        SELECT DISTINCT remedyid
        FROM rubricremedy
        WHERE rubricid = ANY(:rids)
    """)

    result = oorep_db.execute(
        remedy_query,
        {"rids": list(oorep_rubric_ids)}
    ).fetchall()

    remedy_ids = [r[0] for r in result]

    print("Unique remedies found:", len(remedy_ids))

    # Step 2: fetch remedy details
    details_query = text("""
        SELECT id, nameabbrev, namelong
        FROM remedy
        WHERE id = ANY(:ids)
    """)

    rows = oorep_db.execute(
        details_query,
        {"ids": remedy_ids}
    ).fetchall()

    oorep_to_golden = {}

    # Step 3: insert into golden_remedies
    for r in rows:
        existing = golden_db.query(GoldenRemedy).filter_by(
            oorep_id=r.id
        ).first()

        if existing:
            oorep_to_golden[r.id] = existing.id
            continue

        remedy = GoldenRemedy(
            short_name=r.nameabbrev,
            long_name=r.namelong,
            oorep_id=r.id
        )

        golden_db.add(remedy)
        golden_db.flush()

        oorep_to_golden[r.id] = remedy.id

    golden_db.commit()

    print("✅ Golden remedies inserted successfully.")
    print("Total remedies in Golden Core:", len(oorep_to_golden))

    return oorep_to_golden
def insert_golden_relations(
    golden_db,
    oorep_db,
    oorep_to_golden_rubrics,
    oorep_to_golden_remedies
):
    """
    Inserts rubric-remedy-grade relations into golden_rubric_remedies.
    """

    print("\n========== INSERTING GOLDEN RUBRIC-REMEDY RELATIONS ==========")

    oorep_rubric_ids = list(oorep_to_golden_rubrics.keys())

    query = text("""
        SELECT rubricid, remedyid, weight
        FROM rubricremedy
        WHERE rubricid = ANY(:rids)
    """)

    rows = oorep_db.execute(query, {"rids": oorep_rubric_ids}).fetchall()

    count = 0

    for row in rows:
        golden_rubric_id = oorep_to_golden_rubrics.get(row.rubricid)
        golden_remedy_id = oorep_to_golden_remedies.get(row.remedyid)

        if not golden_rubric_id or not golden_remedy_id:
            continue

        # prevent duplicates
        existing = golden_db.query(GoldenRubricRemedy).filter_by(
            rubric_id=golden_rubric_id,
            remedy_id=golden_remedy_id
        ).first()

        if existing:
            continue

        rel = GoldenRubricRemedy(
            rubric_id=golden_rubric_id,
            remedy_id=golden_remedy_id,
            grade=row.weight
        )

        golden_db.add(rel)
        count += 1

    golden_db.commit()

    print("✅ Golden rubric-remedy relations inserted.")
    print("Total relations:", count)



def build_golden_repertory(golden_db, oorep_db):
    print("\n==============================================")
    print("   REPERTO AI — GOLDEN REPERTORY BUILD START  ")
    print("==============================================\n")

    # 1. Verify whitelist against OOREP
    verified = verify_core_rubrics_exist(oorep_db)

    # 2. Resolve full hierarchy
    resolved_nodes = resolve_rubric_hierarchy(oorep_db, verified)

    # 3. Insert Golden rubrics
    oorep_to_golden_rubrics = insert_golden_rubrics(golden_db, resolved_nodes)

    # 4. Insert Golden remedies
    oorep_to_golden_remedies = insert_golden_remedies(
        golden_db,
        oorep_db,
        oorep_to_golden_rubrics.keys()
    )

    # 5. Insert Golden relations
    insert_golden_relations(
        golden_db,
        oorep_db,
        oorep_to_golden_rubrics,
        oorep_to_golden_remedies
    )

    print("\n==============================================")
    print("   GOLDEN REPERTORY BUILD COMPLETED SUCCESS  ")
    print("==============================================\n")

