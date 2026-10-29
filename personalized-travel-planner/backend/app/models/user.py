from typing import Optional, List
from pydantic import BaseModel, EmailStr

class UserProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    traveler_style: Optional[str] = "explorer"
    preferred_currency: str = "USD"
    saved_trips_count: int = 0
