from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from .edge import Edge


class NodeType(str, Enum):
    INPUT = "input"
    OUTPUT = "output"
    USER_PROGRAM = "user_program"
    PROGRAM = "program"
    COMPARATOR = "comparator"


class NodeNew(SQLModel):
    type: NodeType


class NodeBase(NodeNew):
    label: str
    code: str


class NodeUpdate(SQLModel):
    label: str | None = None
    code: str | None = None


class Node(NodeBase, table=True):
    id: int = Field(primary_key=True)

    # reference: https://github.com/fastapi/sqlmodel/issues/89
    incoming_nodes: list["Node"] = Relationship(
        back_populates="outgoing_nodes",
        link_model=Edge,
        sa_relationship_kwargs=dict(
            primaryjoin="Node.id==Edge.start",
            secondaryjoin="Node.id==Edge.end"
        ))
    outgoing_nodes: list["Node"] = Relationship(
        back_populates="incoming_nodes",
        link_model=Edge,
        sa_relationship_kwargs=dict(
            primaryjoin="Node.id==Edge.end",
            secondaryjoin="Node.id==Edge.start",
        ))
