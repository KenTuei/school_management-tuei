from app import create_app, seed_database
from faker import Faker

app = create_app()
with app.app_context():
    seed_database(Faker(), reset=True)
    print("Database seeded!")
