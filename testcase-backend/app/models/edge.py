from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .node import Node


class Edge(SQLModel, table=True):
    start: int = Field(default=None, foreign_key="node.id", primary_key=True)
    end: int = Field(default=None, foreign_key="node.id", primary_key=True)
