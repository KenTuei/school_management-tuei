from datetime import datetime, date
from faker import Faker
from app import create_app
from models import db, User, Student, Parent, Subject, Enrollment, Grade, FeeRecord, SchoolInfo, FeaturedStudent

app = create_app()
fake = Faker()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create admin user
        admin = User(
            email="admin@school.com",
            name="Admin User",
            role="admin",
            admission_number=None
        )
        admin.set_password("admin123")
        db.session.add(admin)

        # Create school info
        school = SchoolInfo(
            mission="To provide quality education",
            vision="To be a leading learning institution",
            principal_message="Welcome to our school"
        )
        db.session.add(school)

        # Create sample subjects
        subjects = [
            Subject(name="Mathematics", code="MATH101"),
            Subject(name="English", code="ENG101"),
            Subject(name="Science", code="SCI101"),
            Subject(name="History", code="HIS101")
        ]
        db.session.add_all(subjects)

        # Create 10 sample students with related data
        for i in range(1, 11):
            student = Student(
                admission_number=f"STD{i:03d}",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                gender=fake.random_element(elements=("Male", "Female")),
                date_of_birth=fake.date_between(start_date='-15y', end_date='-5y'),
                class_level=fake.random_element(elements=("Grade 1", "Grade 2", "Grade 3"))
            )
            db.session.add(student)
            db.session.flush()  # Get student ID before creating related records

            # Create parent for student
            parent = Parent(
                name=fake.name(),
                phone=fake.phone_number(),
                email=fake.email(),
                relationship=fake.random_element(elements=("Mother", "Father", "Guardian")),
                student_id=student.id
            )
            db.session.add(parent)

            # Enroll student in 3 random subjects
            for subj in fake.random_elements(elements=subjects, length=3, unique=True):
                enrollment = Enrollment(
                    student_id=student.id,
                    subject_id=subj.id
                )
                db.session.add(enrollment)

                # Add grades for each enrollment
                grade = Grade(
                    student_id=student.id,
                    subject_id=subj.id,
                    term=fake.random_element(elements=("Term 1", "Term 2", "Term 3")),
                    year=2025,
                    score=fake.random_int(min=50, max=100)
                )
                db.session.add(grade)

            # Add fee records
            for term in ["Term 1", "Term 2", "Term 3"]:
                fee = FeeRecord(
                    student_id=student.id,
                    term=term,
                    year=2025,
                    amount_due=3500.0,
                    amount_paid=fake.random_int(min=1000, max=3500),
                    status="cleared" if fake.boolean(chance_of_getting_true=70) else "pending"
                )
                db.session.add(fee)

            # Make first student featured
            if i == 1:
                featured = FeaturedStudent(
                    student_id=student.id,
                    photo="default.jpg",
                    message="Outstanding performance in science fair",
                    grade=student.class_level
                )
                db.session.add(featured)

        # Create parent user
        parent_user = User(
            email="parent@school.com",
            name="Parent User",
            role="parent",
            admission_number="STD001"  # Linking to first student
        )
        parent_user.set_password("parent123")
        db.session.add(parent_user)

        db.session.commit()
        print("✅ Database seeded successfully with:")
        print(f"- {User.query.count()} users")
        print(f"- {Student.query.count()} students")
        print(f"- {Parent.query.count()} parents")
        print(f"- {Subject.query.count()} subjects")
        print(f"- {Enrollment.query.count()} enrollments")
        print(f"- {Grade.query.count()} grades")
        print(f"- {FeeRecord.query.count()} fee records")

if __name__ == '__main__':
    seed_data()