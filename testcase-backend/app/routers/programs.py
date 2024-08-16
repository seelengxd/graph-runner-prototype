
from fastapi import APIRouter


router = APIRouter(prefix="/programs", tags=["programs"])


@router.post("/run")
def get_all_edges():
    pass
