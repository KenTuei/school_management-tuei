import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from faker import Faker
import random
from datetime import date

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
fake = Faker()

# ---------------- Models ----------------
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("parent.id"))
    enrollments = db.relationship("Enrollment", backref="student", lazy=True)
    fee_records = db.relationship("FeeRecord", backref="student", lazy=True)

class Parent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    students = db.relationship("Student", backref="parent", lazy=True)

class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    enrollments = db.relationship("Enrollment", backref="subject", lazy=True)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"))
    subject_id = db.Column(db.Integer, db.ForeignKey("subject.id"))
    grades = db.relationship("Grade", backref="enrollment", lazy=True)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey("enrollment.id"))
    score = db.Column(db.Float, nullable=False)

class FeeRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"))
    balance = db.Column(db.Float, nullable=False)

# ---------------- App Factory ----------------
def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///school.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "your-secret-key"

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # ---------- Routes ----------
    @app.route("/")
    def home():
        return jsonify({"message": "School Management API running"})

    # List all students
    @app.route("/api/students", methods=["GET"])
    def get_students():
        students = Student.query.all()
        return jsonify([
            {
                "id": s.id,
                "name": s.name,
                "age": s.age,
                "parent": s.parent.name if s.parent else None,
                "fee_balance": sum(fr.balance for fr in s.fee_records)
            } for s in students
        ])

    # Get single student details
    @app.route("/api/students/<int:student_id>", methods=["GET"])
    def get_student(student_id):
        s = Student.query.get_or_404(student_id)
        return jsonify({
            "id": s.id,
            "name": s.name,
            "age": s.age,
            "parent": {"id": s.parent.id, "name": s.parent.name, "phone": s.parent.phone} if s.parent else None,
            "subjects": [{"id": e.subject.id, "name": e.subject.name} for e in s.enrollments],
            "grades": [
                {"subject": e.subject.name, "score": g.score}
                for e in s.enrollments for g in e.grades
            ],
            "fee_balance": sum(fr.balance for fr in s.fee_records)
        })

    # Get grades
    @app.route("/api/students/<int:student_id>/grades", methods=["GET"])
    def get_grades(student_id):
        s = Student.query.get_or_404(student_id)
        out = []
        for e in s.enrollments:
            for g in e.grades:
                out.append({
                    "subject": e.subject.name,
                    "score": g.score
                })
        return jsonify(out)

    # Get fees
    @app.route("/api/students/<int:student_id>/fees", methods=["GET"])
    def get_fees(student_id):
        s = Student.query.get_or_404(student_id)
        return jsonify([{"balance": f.balance} for f in s.fee_records])

    # Subjects list
    @app.route("/api/subjects", methods=["GET"])
    def list_subjects():
        subs = Subject.query.all()
        return jsonify([{"id": sub.id, "name": sub.name} for sub in subs])

    # Dashboard summary
    @app.route("/api/summary", methods=["GET"])
    def summary():
        total_students = Student.query.count()
        total_subjects = Subject.query.count()
        total_fees = sum(fr.balance for fr in FeeRecord.query.all())
        return jsonify({
            "students": total_students,
            "subjects": total_subjects,
            "total_fee_balance": total_fees
        })

    # Seed endpoint
    @app.route("/api/dev/seed", methods=["POST"])
    def seed_endpoint():
        return jsonify(seed_database(fake, reset=True))

    return app

# ---------------- Seeding function ----------------
def seed_database(fake, reset=True):
    if reset:
        db.drop_all()
        db.create_all()

    # Parents
    parents = [Parent(name=fake.name(), phone=fake.phone_number()) for _ in range(5)]
    db.session.add_all(parents)
    
    # Subjects
    subjects = [Subject(name=n) for n in ["Math","English","Science","History","Geography"]]
    db.session.add_all(subjects)
    db.session.commit()

    # Students, enrollments, grades, fees
    students = []
    for _ in range(15):
        student = Student(
            name=fake.name(),
            age=random.randint(6, 18),
            parent=random.choice(parents)
        )
        db.session.add(student)
        db.session.commit()

        # Fee record
        fee = FeeRecord(student=student, balance=round(random.uniform(0,500),2))
        db.session.add(fee)

        # Enrollments & Grades
        for subj in random.sample(subjects, k=random.randint(2,3)):
            enrollment = Enrollment(student=student, subject=subj)
            db.session.add(enrollment)
            db.session.commit()
            for _ in range(3):
                grade = Grade(enrollment=enrollment, score=round(random.uniform(40,100),2))
                db.session.add(grade)

    db.session.commit()
    return {"message": "Database seeded successfully"}

# ---------------- Run ----------------
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
