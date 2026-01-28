from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Sessions
    sessions = relationship("Session", back_populates="presenter")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, default="Untitled Presentation")
    
    # Store the entire final state (polls, questions, quiz results) as JSON
    data = Column(JSON, default={}) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign Key to User
    presenter_id = Column(Integer, ForeignKey("users.id"))
    presenter = relationship("User", back_populates="sessions")