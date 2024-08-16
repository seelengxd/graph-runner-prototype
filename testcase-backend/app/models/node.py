from sqlmodel import SQLModel, Field, Relationship
from .edge import Edge


class Node(SQLModel, table=True):
    id: int = Field(primary_key=True)
    label: str
    code: str

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
