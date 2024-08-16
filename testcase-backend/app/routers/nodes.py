
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from models import Node, Edge
from dependencies import get_session
from logging import log, INFO


router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("")
def get_all_nodes(session: Session = Depends(get_session)) -> list[Node]:
    nodes = session.exec(select(Node)).all() or []
    log(INFO, nodes)
    return []


@router.get("/{id}")
def get_node(id: int):
    return 1


@router.post("")
def create_node():
    pass


@router.put("/{id}")
def update_node(id: int):
    pass


@router.delete("/{id}")
def delete_node(id: int):
    pass
