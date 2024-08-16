from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .node import Node


class EdgeBase(SQLModel):
    id: int = Field(primary_key=True)
    start: int = Field(foreign_key="node.id")
    end: int = Field(foreign_key="node.id")


class Edge(EdgeBase, table=True):
    pass
