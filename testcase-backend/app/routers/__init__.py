from fastapi import APIRouter
from .edges import router as edgesRouter
from .nodes import router as nodesRouter
from .programs import router as programsRouter

router = APIRouter(prefix="/api")

router.include_router(edgesRouter)
router.include_router(nodesRouter)
router.include_router(programsRouter)
