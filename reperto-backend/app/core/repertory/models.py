from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class GoldenRubric(Base):
    __tablename__ = "golden_rubrics"

    id = Column(Integer, primary_key=True, index=True)
    chapter = Column(String, index=True)
    text = Column(String, index=True)
    text_en = Column(String, index=True, nullable=True)
    full_path = Column(String, unique=True, index=True)
    full_path_en = Column(String, index=True, nullable=True)

    parent_id = Column(Integer, ForeignKey("golden_rubrics.id"), nullable=True)
    depth = Column(Integer)

    oorep_id = Column(Integer, unique=True, index=True)

    parent = relationship("GoldenRubric", remote_side=[id])


class GoldenRemedy(Base):
    __tablename__ = "golden_remedies"

    id = Column(Integer, primary_key=True, index=True)
    short_name = Column(String, index=True)
    long_name = Column(String, index=True)
    description = Column(String, nullable=True)

    oorep_id = Column(Integer, unique=True, index=True)


class GoldenRubricRemedy(Base):
    __tablename__ = "golden_rubric_remedies"

    id = Column(Integer, primary_key=True, index=True)

    rubric_id = Column(Integer, ForeignKey("golden_rubrics.id"))
    remedy_id = Column(Integer, ForeignKey("golden_remedies.id"))
    grade = Column(Integer)

    rubric = relationship("GoldenRubric")
    remedy = relationship("GoldenRemedy")
