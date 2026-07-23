CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'agent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'agent'))
);

CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(30),
  company VARCHAR(150),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_by BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT clients_status_check
    CHECK (status IN ('active', 'inactive')),

  CONSTRAINT clients_created_by_fk
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tickets (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  assigned_to BIGINT,
  created_by BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT tickets_status_check
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),

  CONSTRAINT tickets_priority_check
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  CONSTRAINT tickets_client_fk
    FOREIGN KEY (client_id)
    REFERENCES clients(id)
    ON DELETE CASCADE,

  CONSTRAINT tickets_assigned_to_fk
    FOREIGN KEY (assigned_to)
    REFERENCES users(id)
    ON DELETE SET NULL,

  CONSTRAINT tickets_created_by_fk
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS clients_name_index
  ON clients(name);

CREATE INDEX IF NOT EXISTS tickets_client_id_index
  ON tickets(client_id);

CREATE INDEX IF NOT EXISTS tickets_status_index
  ON tickets(status);

CREATE INDEX IF NOT EXISTS tickets_assigned_to_index
  ON tickets(assigned_to);