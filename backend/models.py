from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    admission_number = db.Column(db.String(32), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    class_level = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    parents = db.relationship("Parent", backref="student", cascade="all, delete-orphan")
    grades = db.relationship("Grade", backref="student", cascade="all, delete-orphan")
    fees = db.relationship("FeeRecord", backref="student", cascade="all, delete-orphan")
    enrollments = db.relationship("Enrollment", backref="student", cascade="all, delete-orphan")

class Parent(db.Model):
    __tablename__ = "parents"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(32))
    email = db.Column(db.String(120))
    relationship = db.Column(db.String(30), nullable=False)  # e.g., Mother, Father, Guardian
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)

class Subject(db.Model):
    __tablename__ = "subjects"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    code = db.Column(db.String(20), nullable=False, unique=True)
    enrollments = db.relationship("Enrollment", backref="subject", cascade="all, delete-orphan")
    grades = db.relationship("Grade", backref="subject", cascade="all, delete-orphan")

class Enrollment(db.Model):
    __tablename__ = "enrollments"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    __table_args__ = (db.UniqueConstraint("student_id", "subject_id", name="uq_student_subject"),)

class Grade(db.Model):
    __tablename__ = "grades"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    term = db.Column(db.String(20), nullable=False)  # e.g., Term 1, Term 2, Term 3
    year = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)      # 0-100
    __table_args__ = (db.UniqueConstraint("student_id", "subject_id", "term", "year", name="uq_grade_slot"),)

class FeeRecord(db.Model):
    __tablename__ = "fee_records"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    term = db.Column(db.String(20), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    amount_due = db.Column(db.Float, nullable=False, default=0.0)
    amount_paid = db.Column(db.Float, nullable=False, default=0.0)
    status = db.Column(db.String(20), nullable=False, default="pending")  # pending/partial/cleared
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (db.UniqueConstraint("student_id", "term", "year", name="uq_fee_slot"),)
