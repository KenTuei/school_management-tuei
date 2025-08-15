from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# ---------------- User/Admin Model ----------------
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin or parent
    admission_number = db.Column(db.String(32), nullable=True)  # for parents
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# ---------------- Student Model ----------------
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
    featured_entry = db.relationship("FeaturedStudent", backref="student", uselist=False, cascade="all, delete-orphan")

# ---------------- Parent Model ----------------
class Parent(db.Model):
    __tablename__ = "parents"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(32))
    email = db.Column(db.String(120))
    relationship = db.Column(db.String(30), nullable=False)  # Mother, Father, Guardian
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)

# ---------------- Subject Model ----------------
class Subject(db.Model):
    __tablename__ = "subjects"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    code = db.Column(db.String(20), nullable=False, unique=True)
    enrollments = db.relationship("Enrollment", backref="subject", cascade="all, delete-orphan")
    grades = db.relationship("Grade", backref="subject", cascade="all, delete-orphan")

# ---------------- Enrollment Model ----------------
class Enrollment(db.Model):
    __tablename__ = "enrollments"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    __table_args__ = (db.UniqueConstraint("student_id", "subject_id", name="uq_student_subject"),)

# ---------------- Grade Model ----------------
class Grade(db.Model):
    __tablename__ = "grades"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"), nullable=False)
    term = db.Column(db.String(20), nullable=False)  # Term 1, Term 2, Term 3
    year = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Float, nullable=False)  # 0-100
    __table_args__ = (db.UniqueConstraint("student_id", "subject_id", "term", "year", name="uq_grade_slot"),)

# ---------------- Fee Record Model ----------------
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

# ---------------- School Info Model ----------------
class SchoolInfo(db.Model):
    __tablename__ = "school_info"
    id = db.Column(db.Integer, primary_key=True)
    mission = db.Column(db.String(255), nullable=True)
    vision = db.Column(db.String(255), nullable=True)
    principal_message = db.Column(db.String(255), nullable=True)
    principal_image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ---------------- Featured Student Model ----------------
class FeaturedStudent(db.Model):
    __tablename__ = "featured_students"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    photo = db.Column(db.String(255), nullable=False)
    message = db.Column(db.String(255), nullable=True)
    grade = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
