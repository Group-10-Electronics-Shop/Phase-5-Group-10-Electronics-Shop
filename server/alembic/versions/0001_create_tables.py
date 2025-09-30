"""create initial tables via create_tables()

Revision ID: 0001_create_tables
Revises: 
Create Date: 2025-09-21 00:00:00.000000

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = '0001_create_tables'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
  
    from server.models.alembic_helpers import create_tables
    create_tables()

def downgrade():
    from server.models.alembic_helpers import drop_tables
    drop_tables()