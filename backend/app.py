# # from flask import Flask, jsonify, request
# # from flask_migrate import Migrate
# # from flask_cors import CORS
# # from models import db, Student, Parent, Subject, Enrollment, Grade, FeeRecord, User, SchoolInfo, FeaturedStudent
# # from faker import Faker
# # import random
# # from datetime import datetime

# # def create_app():
# #     app = Flask(__name__)
# #     app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///school.db"
# #     app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# #     app.config["SECRET_KEY"] = "your-secret-key"

# #     db.init_app(app)
# #     Migrate(app, db)
# #     CORS(app)

# #     # ---------------- Home ----------------
# #     @app.route("/")
# #     def home():
# #         return jsonify({"message": "School Management API running"})

# #     # ---------------- Signup ----------------
# #     @app.route("/api/signup", methods=["POST"])
# #     def signup():
# #         data = request.json
# #         name = data.get("name")
# #         email = data.get("email")
# #         password = data.get("password")
# #         admission_number = data.get("admission_number")

# #         if User.query.filter_by(email=email).first():
# #             return jsonify({"message": "Email already in use"}), 400

# #         # Determine role
# #         if email.endswith("@admin.com.ke"):
# #             role = "admin"
# #         else:
# #             role = "parent"
# #             if not admission_number:
# #                 return jsonify({"message": "Admission number required for parents"}), 400
# #             student = Student.query.filter_by(admission_number=admission_number).first()
# #             if not student:
# #                 return jsonify({"message": "Invalid admission number"}), 400

# #         user = User(
# #             name=name,
# #             email=email,
# #             role=role,
# #             admission_number=admission_number if role == "parent" else None
# #         )
# #         user.set_password(password)
# #         db.session.add(user)
# #         db.session.commit()

# #         return jsonify({"message": "User created successfully", "user": {"name": name, "email": email, "role": role}}), 201

# #     # ---------------- Login ----------------
# #     @app.route("/api/login", methods=["POST"])
# #     def login():
# #         data = request.json
# #         email = data.get("email")
# #         password = data.get("password")

# #         user = User.query.filter_by(email=email).first()
# #         if not user or not user.check_password(password):
# #             return jsonify({"message": "Invalid credentials"}), 401

# #         return jsonify({"message": "Login successful", "role": user.role, "email": user.email})

# #     # ---------------- Students CRUD ----------------
# #     @app.route("/api/students", methods=["GET"])
# #     def get_students():
# #         students = Student.query.all()
# #         return jsonify([{
# #             "id": s.id,
# #             "admission_number": s.admission_number,
# #             "first_name": s.first_name,
# #             "last_name": s.last_name,
# #             "gender": s.gender,
# #             "class_level": s.class_level,
# #             "date_of_birth": s.date_of_birth.isoformat(),
# #             "parents": [{"id": p.id, "name": p.name} for p in s.parents],
# #             "grades": [{"subject": g.subject.name, "score": g.score, "term": g.term, "year": g.year} for g in s.grades],
# #             "fees": [{"term": f.term, "amount_due": f.amount_due, "amount_paid": f.amount_paid} for f in s.fees]
# #         } for s in students])

# #     @app.route("/api/students", methods=["POST"])
# #     def create_student():
# #         data = request.json
# #         student = Student(
# #             admission_number=data["admission_number"],
# #             first_name=data["first_name"],
# #             last_name=data["last_name"],
# #             gender=data["gender"],
# #             class_level=data["class_level"],
# #             date_of_birth=datetime.fromisoformat(data["date_of_birth"])
# #         )
# #         db.session.add(student)
# #         db.session.commit()
# #         return jsonify({"id": student.id}), 201

# #     @app.route("/api/students/<int:student_id>", methods=["PUT", "PATCH"])
# #     def update_student(student_id):
# #         s = Student.query.get_or_404(student_id)
# #         data = request.json
# #         s.first_name = data.get("first_name", s.first_name)
# #         s.last_name = data.get("last_name", s.last_name)
# #         s.gender = data.get("gender", s.gender)
# #         s.class_level = data.get("class_level", s.class_level)
# #         s.date_of_birth = datetime.fromisoformat(data.get("date_of_birth", s.date_of_birth.isoformat()))
# #         db.session.commit()
# #         return jsonify({"status": "ok"})

# #     @app.route("/api/students/<int:student_id>", methods=["DELETE"])
# #     def delete_student(student_id):
# #         s = Student.query.get_or_404(student_id)
# #         db.session.delete(s)
# #         db.session.commit()
# #         return jsonify({"status": "deleted"})

# #     # ---------------- Parents CRUD ----------------
# #     @app.route("/api/parents", methods=["GET"])
# #     def get_parents():
# #         parents = Parent.query.all()
# #         return jsonify([{"id": p.id, "name": p.name, "phone": p.phone, "email": p.email, "student_id": p.student_id} for p in parents])

# #     @app.route("/api/parents", methods=["POST"])
# #     def create_parent():
# #         data = request.json
# #         p = Parent(
# #             name=data["name"],
# #             phone=data.get("phone"),
# #             email=data.get("email"),
# #             relationship=data["relationship"],
# #             student_id=data["student_id"]
# #         )
# #         db.session.add(p)
# #         db.session.commit()
# #         return jsonify({"id": p.id}), 201

# #     # ---------------- Subjects CRUD ----------------
# #     @app.route("/api/subjects", methods=["GET"])
# #     def list_subjects():
# #         subjects = Subject.query.all()
# #         return jsonify([{"id": sub.id, "name": sub.name, "code": sub.code} for sub in subjects])

# #     @app.route("/api/subjects", methods=["POST"])
# #     def create_subject():
# #         data = request.json
# #         sub = Subject(name=data["name"], code=data["code"])
# #         db.session.add(sub)
# #         db.session.commit()
# #         return jsonify({"id": sub.id}), 201

# #     # ---------------- Featured Students (Admin Only) ----------------
# #     @app.route("/api/featured-students", methods=["GET"])
# #     def get_featured_students():
# #         featured = FeaturedStudent.query.all()
# #         return jsonify([{
# #             "id": f.id,
# #             "student_id": f.student_id,
# #             "student_name": f.student.first_name + " " + f.student.last_name,
# #             "photo": f.photo,
# #             "message": f.message,
# #             "grade": f.grade
# #         } for f in featured])

# #     @app.route("/api/featured-students", methods=["POST"])
# #     def add_featured_student():
# #         data = request.json
# #         admin_email = data.get("admin_email")
# #         user = User.query.filter_by(email=admin_email).first()
# #         if not user or user.role != "admin":
# #             return jsonify({"message": "Unauthorized"}), 403

# #         student = Student.query.get(data.get("student_id"))
# #         if not student:
# #             return jsonify({"message": "Student not found"}), 404

# #         featured = FeaturedStudent(
# #             student_id=student.id,
# #             photo=data.get("photo"),
# #             message=data.get("message"),
# #             grade=data.get("grade")
# #         )
# #         db.session.add(featured)
# #         db.session.commit()
# #         return jsonify({"message": "Featured student added", "id": featured.id}), 201

# #     @app.route("/api/featured-students/<int:id>", methods=["PUT", "PATCH"])
# #     def update_featured_student(id):
# #         data = request.json
# #         admin_email = data.get("admin_email")
# #         user = User.query.filter_by(email=admin_email).first()
# #         if not user or user.role != "admin":
# #             return jsonify({"message": "Unauthorized"}), 403

# #         f = FeaturedStudent.query.get_or_404(id)
# #         f.photo = data.get("photo", f.photo)
# #         f.message = data.get("message", f.message)
# #         f.grade = data.get("grade", f.grade)
# #         db.session.commit()
# #         return jsonify({"status": "ok"})

# #     return app


# # # ----------------- Seed Function -----------------
# # def seed_database(fake: Faker, reset=False):
# #     """Seeds the database with fake data for testing."""
# #     if reset:
# #         db.drop_all()
# #         db.create_all()

# #     # Create subjects
# #     subject_names = ["Math", "English", "Biology", "Chemistry", "Physics"]
# #     subject_list = []
# #     for sub_name in subject_names:
# #         sub = Subject.query.filter_by(name=sub_name).first()
# #         if not sub:
# #             sub = Subject(name=sub_name, code=sub_name[:3].upper())
# #             db.session.add(sub)
# #             db.session.commit()
# #         subject_list.append(sub)

# #     # Create students
# #     students = []
# #     for _ in range(10):
# #         student = Student(
# #             admission_number=str(random.randint(1000, 9999)),
# #             first_name=fake.first_name(),
# #             last_name=fake.last_name(),
# #             gender=random.choice(["Male", "Female"]),
# #             class_level=random.choice(["Grade 1", "Grade 2", "Grade 3"]),
# #             date_of_birth=fake.date_of_birth(minimum_age=6, maximum_age=18)
# #         )
# #         db.session.add(student)
# #         db.session.commit()
# #         students.append(student)

# #     # ---------------- Parents ----------------
# #     for student in students:
# #         for _ in range(random.randint(1, 2)):
# #             parent_name = fake.name()
# #             parent_email = fake.unique.email()
# #             parent = Parent(
# #                 name=parent_name,
# #                 phone=fake.phone_number(),
# #                 email=parent_email,
# #                 relationship=random.choice(["Mother", "Father", "Guardian"]),
# #                 student_id=student.id
# #             )
# #             db.session.add(parent)

# #             # Create corresponding user account for the parent
# #             if not User.query.filter_by(email=parent_email).first():
# #                 parent_user = User(
# #                     name=parent_name,
# #                     email=parent_email,
# #                     role="parent",
# #                     admission_number=student.admission_number
# #                 )
# #                 parent_user.set_password("parent123")  # default password
# #                 db.session.add(parent_user)
# #     db.session.commit()

# #     # ---------------- Grades ----------------
# #     terms = ["Term 1", "Term 2", "Term 3"]
# #     for student in students:
# #         for subject in subject_list:
# #             grade = Grade(
# #                 student_id=student.id,
# #                 subject_id=subject.id,
# #                 term=random.choice(terms),
# #                 year=datetime.now().year,
# #                 score=random.randint(50, 100)
# #             )
# #             db.session.add(grade)
# #     db.session.commit()

# #     # ---------------- Admin user ----------------
# #     if not User.query.filter_by(email="admin@admin.com.ke").first():
# #         admin = User(name="Admin", email="admin@admin.com.ke", role="admin")
# #         admin.set_password("admin123")
# #         db.session.add(admin)
# #         db.session.commit()


# # # Minimal app run
# # app = create_app()

# # if __name__ == "__main__":
# #     app.run(debug=True)

# from flask import Flask, jsonify, request
# from flask_migrate import Migrate
# from flask_cors import CORS
# from models import db, Student, Parent, Subject, Enrollment, Grade, FeeRecord, User, SchoolInfo, FeaturedStudent
# from faker import Faker
# import random
# from datetime import datetime
# import smtplib
# from email.mime.text import MIMEText

# fake = Faker()

# # ---------------- Email Function ----------------
# def send_admission_email(parent_email, student_name, admission_number):
#     sender_email = "YOUR_EMAIL@gmail.com"  # replace with your email
#     sender_password = "YOUR_APP_PASSWORD"  # replace with app password
#     subject = "Your Child's Admission Number"
#     body = f"""Hello,

# Student {student_name} has been added to the school system.
# Admission Number: {admission_number}

# Please use this admission number to sign up and link your account.

# Thank you."""

#     msg = MIMEText(body)
#     msg['Subject'] = subject
#     msg['From'] = sender_email
#     msg['To'] = parent_email

#     try:
#         with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
#             server.login(sender_email, sender_password)
#             server.sendmail(sender_email, parent_email, msg.as_string())
#         print(f"Admission email sent to {parent_email}")
#     except Exception as e:
#         print(f"Error sending email: {e}")

# # ---------------- Flask App ----------------
# def create_app():
#     app = Flask(__name__)
#     app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///school.db"
#     app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
#     app.config["SECRET_KEY"] = "your-secret-key"

#     db.init_app(app)
#     Migrate(app, db)
#     CORS(app)

#     # ---------------- Home ----------------
#     @app.route("/")
#     def home():
#         return jsonify({"message": "School Management API running"})

#     # ---------------- Signup ----------------
#     @app.route("/api/signup", methods=["POST"])
#     def signup():
#         data = request.json
#         name = data.get("name")
#         email = data.get("email")
#         password = data.get("password")
#         admission_number = data.get("admission_number")

#         if User.query.filter_by(email=email).first():
#             return jsonify({"message": "Email already in use"}), 400

#         # Determine role
#         if email.endswith("@admin.com.ke"):
#             role = "admin"
#         else:
#             role = "parent"
#             if not admission_number:
#                 return jsonify({"message": "Admission number required for parents"}), 400
#             student = Student.query.filter_by(admission_number=admission_number).first()
#             if not student:
#                 return jsonify({"message": "Invalid admission number"}), 400

#         user = User(
#             name=name,
#             email=email,
#             role=role,
#             admission_number=admission_number if role == "parent" else None
#         )
#         user.set_password(password)
#         db.session.add(user)
#         db.session.commit()

#         return jsonify({"message": "User created successfully", "user": {"name": name, "email": email, "role": role}}), 201

#     # ---------------- Login ----------------
#     @app.route("/api/login", methods=["POST"])
#     def login():
#         data = request.json
#         email = data.get("email")
#         password = data.get("password")

#         user = User.query.filter_by(email=email).first()
#         if not user or not user.check_password(password):
#             return jsonify({"message": "Invalid credentials"}), 401

#         return jsonify({"message": "Login successful", "role": user.role, "email": user.email})

#     # ---------------- Admin adds student & parent ----------------
#     @app.route("/api/admin/add-student", methods=["POST"])
#     def admin_add_student():
#         data = request.json
#         admin_email = data.get("admin_email")
#         admin = User.query.filter_by(email=admin_email).first()
#         if not admin or admin.role != "admin":
#             return jsonify({"message": "Unauthorized"}), 403

#         # Create student
#         student = Student(
#             admission_number=str(random.randint(1000, 9999)),
#             first_name=data["first_name"],
#             last_name=data["last_name"],
#             gender=data["gender"],
#             class_level=data["class_level"],
#             date_of_birth=datetime.fromisoformat(data["date_of_birth"])
#         )
#         db.session.add(student)
#         db.session.commit()

#         # Create parent
#         parent_email = data.get("parent_email")
#         parent_name = data.get("parent_name")
#         parent = Parent(
#             name=parent_name,
#             email=parent_email,
#             phone=data.get("parent_phone"),
#             relationship=data.get("relationship", "Parent"),
#             student_id=student.id
#         )
#         db.session.add(parent)
#         db.session.commit()

#         # Send admission number to parent
#         send_admission_email(parent_email, f"{student.first_name} {student.last_name}", student.admission_number)

#         return jsonify({"message": "Student and parent added, admission number sent via email", "student_id": student.id, "parent_id": parent.id}), 201

#     # ---------------- Students CRUD ----------------
#     @app.route("/api/students", methods=["GET"])
#     def get_students():
#         students = Student.query.all()
#         return jsonify([{
#             "id": s.id,
#             "admission_number": s.admission_number,
#             "first_name": s.first_name,
#             "last_name": s.last_name,
#             "gender": s.gender,
#             "class_level": s.class_level,
#             "date_of_birth": s.date_of_birth.isoformat(),
#             "parents": [{"id": p.id, "name": p.name} for p in s.parents],
#             "grades": [{"subject": g.subject.name, "score": g.score} for g in s.grades],
#             "fees": [{"term": f.term, "amount_due": f.amount_due, "amount_paid": f.amount_paid} for f in s.fees]
#         } for s in students])

#     @app.route("/api/students/<int:student_id>", methods=["PUT", "PATCH"])
#     def update_student(student_id):
#         s = Student.query.get_or_404(student_id)
#         data = request.json
#         s.first_name = data.get("first_name", s.first_name)
#         s.last_name = data.get("last_name", s.last_name)
#         s.gender = data.get("gender", s.gender)
#         s.class_level = data.get("class_level", s.class_level)
#         s.date_of_birth = datetime.fromisoformat(data.get("date_of_birth", s.date_of_birth.isoformat()))
#         db.session.commit()
#         return jsonify({"status": "ok"})

#     @app.route("/api/students/<int:student_id>", methods=["DELETE"])
#     def delete_student(student_id):
#         s = Student.query.get_or_404(student_id)
#         db.session.delete(s)
#         db.session.commit()
#         return jsonify({"status": "deleted"})

#     # ---------------- Parents CRUD ----------------
#     @app.route("/api/parents", methods=["GET"])
#     def get_parents():
#         parents = Parent.query.all()
#         return jsonify([{"id": p.id, "name": p.name, "phone": p.phone, "email": p.email, "student_id": p.student_id} for p in parents])

#     # ---------------- Subjects CRUD ----------------
#     @app.route("/api/subjects", methods=["GET"])
#     def list_subjects():
#         subjects = Subject.query.all()
#         return jsonify([{"id": sub.id, "name": sub.name, "code": sub.code} for sub in subjects])

#     @app.route("/api/subjects", methods=["POST"])
#     def create_subject():
#         data = request.json
#         sub = Subject(name=data["name"], code=data["code"])
#         db.session.add(sub)
#         db.session.commit()
#         return jsonify({"id": sub.id}), 201

#     # ---------------- Grades CRUD ----------------
#     @app.route("/api/grades", methods=["POST"])
#     def add_grade():
#         data = request.json
#         g = Grade(
#             student_id=data["student_id"],
#             subject_id=data["subject_id"],
#             term=data["term"],
#             year=data["year"],
#             score=data["score"]
#         )
#         db.session.add(g)
#         db.session.commit()
#         return jsonify({"id": g.id}), 201

#     # ---------------- Fees CRUD ----------------
#     @app.route("/api/fees", methods=["POST"])
#     def add_fee():
#         data = request.json
#         f = FeeRecord(
#             student_id=data["student_id"],
#             term=data["term"],
#             amount_due=data["amount_due"],
#             amount_paid=data.get("amount_paid", 0)
#         )
#         db.session.add(f)
#         db.session.commit()
#         return jsonify({"id": f.id}), 201

#     # ---------------- Featured Students ----------------
#     @app.route("/api/featured-students", methods=["POST"])
#     def add_featured_student():
#         data = request.json
#         admin_email = data.get("admin_email")
#         user = User.query.filter_by(email=admin_email).first()
#         if not user or user.role != "admin":
#             return jsonify({"message": "Unauthorized"}), 403

#         student = Student.query.get(data.get("student_id"))
#         if not student:
#             return jsonify({"message": "Student not found"}), 404

#         featured = FeaturedStudent(
#             student_id=student.id,
#             photo=data.get("photo"),
#             message=data.get("message"),
#             grade=data.get("grade")
#         )
#         db.session.add(featured)
#         db.session.commit()
#         return jsonify({"message": "Featured student added", "id": featured.id}), 201

#     return app

# # ----------------- Seed Function -----------------
# def seed_database(fake: Faker, reset=False):
#     if reset:
#         db.drop_all()
#         db.create_all()

#     # Create admin if not exists
#     if not User.query.filter_by(email="admin@admin.com.ke").first():
#         admin = User(name="Admin", email="admin@admin.com.ke", role="admin")
#         admin.set_password("admin123")
#         db.session.add(admin)
#         db.session.commit()

# # ----------------- Run -----------------
# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True)
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Student, Parent, Subject, Enrollment, Grade, FeeRecord, User, SchoolInfo, FeaturedStudent
from faker import Faker
import random
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

fake = Faker()

# ---------------- Email Function ----------------
def send_admission_email(parent_email, student_name, admission_number):
    sender_email = "YOUR_EMAIL@gmail.com"  # replace with your email
    sender_password = "YOUR_APP_PASSWORD"  # replace with app password
    subject = "Your Child's Admission Number"
    body = f"""Hello,

Student {student_name} has been added to the school system.
Admission Number: {admission_number}

Please use this admission number to sign up and link your account.

Thank you."""

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = parent_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, parent_email, msg.as_string())
        print(f"Admission email sent to {parent_email}")
    except Exception as e:
        print(f"Error sending email: {e}")


# ---------------- Flask App ----------------
def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///school.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "your-secret-key"

    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    @app.route("/")
    def home():
        return jsonify({"message": "School Management API running"})

    # ---------------- Signup ----------------
    @app.route("/api/signup", methods=["POST"])
    def signup():
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        admission_number = data.get("admission_number")

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already in use"}), 400

        if email.endswith("@admin.com.ke"):
            role = "admin"
        else:
            role = "parent"
            if not admission_number:
                return jsonify({"message": "Admission number required for parents"}), 400
            student = Student.query.filter_by(admission_number=admission_number).first()
            if not student:
                return jsonify({"message": "Invalid admission number"}), 400

        user = User(
            name=name,
            email=email,
            role=role,
            admission_number=admission_number if role == "parent" else None
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User created successfully", "user": {"name": name, "email": email, "role": role}}), 201

    # ---------------- Login ----------------
    @app.route("/api/login", methods=["POST"])
    def login():
        data = request.json
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful", "role": user.role, "email": user.email})

    # ---------------- Admin adds student & parent ----------------
    @app.route("/api/admin/add-student", methods=["POST"])
    def admin_add_student():
        data = request.json
        admin_email = data.get("admin_email")
        admin = User.query.filter_by(email=admin_email).first()
        if not admin or admin.role != "admin":
            return jsonify({"message": "Unauthorized"}), 403

        # Create student
        student = Student(
            admission_number=str(random.randint(1000, 9999)),
            first_name=data["first_name"],
            last_name=data["last_name"],
            gender=data["gender"],
            class_level=data["class_level"],
            date_of_birth=datetime.fromisoformat(data["date_of_birth"])
        )
        db.session.add(student)
        db.session.commit()

        # Create parent
        parent_email = data.get("parent_email")
        parent_name = data.get("parent_name")
        parent = Parent(
            name=parent_name,
            email=parent_email,
            phone=data.get("parent_phone"),
            relationship=data.get("relationship", "Parent"),
            student_id=student.id
        )
        db.session.add(parent)

        # Create user account for parent
        if not User.query.filter_by(email=parent_email).first():
            parent_user = User(
                name=parent_name,
                email=parent_email,
                role="parent",
                admission_number=student.admission_number
            )
            parent_user.set_password("parent123")
            db.session.add(parent_user)

        db.session.commit()

        # Send admission number to parent
        send_admission_email(parent_email, f"{student.first_name} {student.last_name}", student.admission_number)

        return jsonify({"message": "Student and parent added, admission number sent via email", "student_id": student.id, "parent_id": parent.id}), 201

    # ---------------- Students, Parents, Subjects, Grades, Fees, Featured Students ----------------
    # ... [include all CRUD routes as in your previous code] ...

    return app


# ----------------- Seed Function -----------------
def seed_database(fake: Faker, reset=False, send_emails=False):
    """Seeds the database with fake data including students, parents, subjects, grades, fees, featured students."""
    if reset:
        db.drop_all()
        db.create_all()

    # Subjects
    subjects_list = ["Math", "English", "Biology", "Chemistry", "Physics"]
    subjects = []
    for name in subjects_list:
        if not Subject.query.filter_by(name=name).first():
            sub = Subject(name=name, code=name[:3].upper())
            db.session.add(sub)
            subjects.append(sub)
    db.session.commit()

    # Admin
    if not User.query.filter_by(email="admin@admin.com.ke").first():
        admin = User(name="Admin", email="admin@admin.com.ke", role="admin")
        admin.set_password("admin123")
        db.session.add(admin)
        db.session.commit()

    # Students
    students = []
    for _ in range(10):
        student = Student(
            admission_number=str(random.randint(1000, 9999)),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            gender=random.choice(["Male", "Female"]),
            class_level=random.choice(["Grade 1", "Grade 2", "Grade 3"]),
            date_of_birth=fake.date_of_birth(minimum_age=6, maximum_age=18)
        )
        db.session.add(student)
        students.append(student)
    db.session.commit()

    # Parents
    for student in students:
        for _ in range(random.randint(1, 2)):
            parent_name = fake.name()
            parent_email = fake.unique.email()
            parent = Parent(
                name=parent_name,
                email=parent_email,
                phone=fake.phone_number(),
                relationship=random.choice(["Mother", "Father", "Guardian"]),
                student_id=student.id
            )
            db.session.add(parent)

            if not User.query.filter_by(email=parent_email).first():
                parent_user = User(
                    name=parent_name,
                    email=parent_email,
                    role="parent",
                    admission_number=student.admission_number
                )
                parent_user.set_password("parent123")
                db.session.add(parent_user)

            # Only send real emails if flag is True
            if send_emails:
                send_admission_email(parent_email, f"{student.first_name} {student.last_name}", student.admission_number)

    db.session.commit()

    # Grades
    terms = ["Term 1", "Term 2", "Term 3"]
    current_year = datetime.now().year
    for student in students:
        for subject in subjects:
            for term in terms:
                grade = Grade(
                    student_id=student.id,
                    subject_id=subject.id,
                    term=term,
                    year=current_year,
                    score=random.randint(50, 100)
                )
                db.session.add(grade)
    db.session.commit()

    # Fees
    for student in students:
        for term in terms:
            fee = FeeRecord(
                student_id=student.id,
                term=term,
                amount_due=random.randint(1000, 5000),
                amount_paid=random.randint(0, 5000)
            )
            db.session.add(fee)
    db.session.commit()

    # Featured Students
    for _ in range(3):
        student = random.choice(students)
        featured = FeaturedStudent(
            student_id=student.id,
            photo=fake.image_url(),
            message=f"Excellent performance by {student.first_name}",
            grade=random.choice(["A", "A+", "B+"])
        )
        db.session.add(featured)
    db.session.commit()

    print("Database seeded successfully!")

# ----------------- Run App -----------------
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
