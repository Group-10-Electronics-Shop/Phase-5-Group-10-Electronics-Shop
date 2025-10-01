"""
Robust helpers for alembic migration 0001_create_tables.py

- Imports modules under server.models (best-effort)
- Finds an object with a .metadata that supports create_all / drop_all
- Calls metadata.create_all / metadata.drop_all using DATABASE_URL env var
"""
import os
import pkgutil
import importlib
import sys
from sqlalchemy import create_engine

def _get_db_url_from_env():
    return os.environ.get("DATABASE_URL") or os.environ.get("SQLALCHEMY_DATABASE_URI")

def _import_all_model_modules():
    """
    Import all modules under server.models so SQLAlchemy model classes get registered.
    Best-effort: swallow individual import errors.
    """
    try:
        import server.models as models_pkg
    except Exception:
        # fallback path if invoked from a different working dir
        import server as _server
        import server.models as models_pkg

    for finder, modname, ispkg in pkgutil.iter_modules(models_pkg.__path__):
        if modname == "alembic_helpers":
            continue
        fullname = f"server.models.{modname}"
        if fullname in sys.modules:
            continue
        try:
            importlib.import_module(fullname)
        except Exception:
            # ignore modules that fail to import — many projects have optional imports
            pass

def _find_base_metadata():
    """
    Return (base_obj, metadata) where metadata has create_all/drop_all.
    Looks through imported server.models modules for attributes exposing .metadata.
    """
    _import_all_model_modules()
    candidates = []
    for name, module in list(sys.modules.items()):
        if not name or not name.startswith("server.models"):
            continue
        module = sys.modules.get(name)
        if module is None:
            continue
        for attr in dir(module):
            try:
                val = getattr(module, attr)
            except Exception:
                continue
            metadata = getattr(val, "metadata", None)
            if metadata is None:
                continue
            has_create = callable(getattr(metadata, "create_all", None))
            has_drop = callable(getattr(metadata, "drop_all", None))
            if has_create and has_drop:
                candidates.append((f"{name}.{attr}", val, metadata))
    if not candidates:
        return None, None
    # prefer something named .Base
    for label, val, meta in candidates:
        if label.endswith(".Base"):
            return val, meta
    # fallback to first candidate
    return candidates[0][1], candidates[0][2]

def create_tables():
    db_url = _get_db_url_from_env()
    if not db_url:
        raise RuntimeError("DATABASE_URL or SQLALCHEMY_DATABASE_URI must be set in environment for migrations.")
    base_obj, metadata = _find_base_metadata()
    if metadata is None:
        # helpful error listing candidates we saw (if any)
        seen = []
        for name, module in list(sys.modules.items()):
            if name.startswith("server.models"):
                for attr in dir(module):
                    try:
                        val = getattr(module, attr)
                    except Exception:
                        continue
                    md = getattr(val, "metadata", None)
                    if md is not None and callable(getattr(md, "create_all", None)):
                        seen.append(f"{name}.{attr}")
        raise RuntimeError("Could not find SQLAlchemy Base.metadata to create tables. "
                           "Searched server.models; candidates found: " + (", ".join(seen) if seen else "<none>"))
    engine = create_engine(db_url)
    metadata.create_all(engine)

def drop_tables():
    db_url = _get_db_url_from_env()
    if not db_url:
        raise RuntimeError("DATABASE_URL or SQLALCHEMY_DATABASE_URI must be set in environment for migrations.")
    base_obj, metadata = _find_base_metadata()
    if metadata is None:
        raise RuntimeError("Could not find SQLAlchemy Base.metadata to drop tables.")
    engine = create_engine(db_url)
    metadata.drop_all(engine)
