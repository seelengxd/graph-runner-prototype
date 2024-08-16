
from fastapi import APIRouter, Depends, HTTPException
from http import HTTPStatus
from sqlmodel import Session, select
from models import Node, NodeBase
from dependencies import get_session


router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("")
def get_all_nodes(session: Session = Depends(get_session)) -> list[Node]:
    nodes = session.exec(select(Node)).all() or []
    return nodes


@router.get("/{id}")
def get_node(id: int, session: Session = Depends(get_session)) -> Node:
    node = session.get(Node, id)
    if not node:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    return node


@router.post("")
def create_node(session: Session = Depends(get_session)):
    node = Node(label="New Node", code="")
    session.add(node)
    session.commit()
    session.refresh(node)
    return node


@router.put("/{id}")
def update_node(id: int, data: NodeBase, session: Session = Depends(get_session)):
    node = session.get(Node, id)
    if not node:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    node.sqlmodel_update(data.model_dump())
    session.add(node)
    session.commit()
    session.refresh(node)
    return node


@router.delete("/{id}")
def delete_node(id: int, session: Session = Depends(get_session)):
    node = session.get(Node, id)
    if not node:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)
    session.delete(node)
    session.commit()
    return
