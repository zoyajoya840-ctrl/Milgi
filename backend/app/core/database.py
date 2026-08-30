from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):   #base class of future SQLAIchemy models
    pass


engine = None
SessionLocal = None

if settings.database_url:
    engine = create_engine(          
        settings.database_url,
        pool_pre_ping=True,
    )                                #engine SQLAIchemy and PostgreSQL ... database connection managment's foundation

    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )                               # database session's making factory

def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database is not configured")

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()           #auth/register for call and for every request database session properli open and close