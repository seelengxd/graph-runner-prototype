
from fastapi import APIRouter


router = APIRouter(prefix="/edges", tags=["nodes"])


@router.get("")
def get_all_edges():
    pass


@router.post("")
def create_edge():
    pass


@router.delete("/{id}")
def delete_edge(id: int):
    pass
