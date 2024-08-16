
from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from dependencies import get_session
from models import Edge, EdgeBase


router = APIRouter(prefix="/edges", tags=["nodes"])


@router.get("")
def get_all_edges(session: Session = Depends(get_session)):
    edges = session.exec(select(Edge)).all()
    return edges


@router.post("")
def create_edge(data: EdgeBase, session: Session = Depends(get_session)):
    edge = Edge(**EdgeBase.model_dump(data))
    session.add(edge)
    session.commit()
    return edge


@router.delete("/{id}")
def delete_edge(id: int, session: Session = Depends(get_session)):
    edge = session.get(Edge, id)
    if not edge:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    session.delete(edge)
    session.commit()
    return
