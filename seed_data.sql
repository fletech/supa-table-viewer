-- Crear la tabla de aplicaciones si no existe
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  date_applied DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  url TEXT,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE
);

-- Insertar datos de ejemplo (reemplaza 'YOUR_USER_ID' con el ID de usuario real)
INSERT INTO applications (user_id, company, position, location, date_applied, status, url, description, is_archived)
VALUES
  -- Aplicaciones activas
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Google', 'Frontend Developer', 'Buenos Aires, Argentina', CURRENT_DATE - INTERVAL '30 days', 'Applied', 'https://careers.google.com', 'Posición para trabajar con React y TypeScript en el equipo de Google Maps.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Microsoft', 'Full Stack Developer', 'Remoto', CURRENT_DATE - INTERVAL '25 days', 'Screening call', 'https://careers.microsoft.com', 'Desarrollo de aplicaciones web con .NET y React.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Mercado Libre', 'Senior Frontend Developer', 'Buenos Aires, Argentina', CURRENT_DATE - INTERVAL '20 days', 'Interviewing', 'https://jobs.mercadolibre.com', 'Posición para liderar el equipo de frontend en la plataforma de pagos.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Globant', 'React Developer', 'Córdoba, Argentina', CURRENT_DATE - INTERVAL '15 days', 'Waiting offer', 'https://careers.globant.com', 'Desarrollo de aplicaciones web con React y Node.js.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Auth0', 'Software Engineer', 'Remoto', CURRENT_DATE - INTERVAL '10 days', 'Got Offer', 'https://auth0.com/careers', 'Trabajar en el equipo de autenticación y seguridad.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Accenture', 'Frontend Architect', 'Buenos Aires, Argentina', CURRENT_DATE - INTERVAL '5 days', 'Accepted!', 'https://careers.accenture.com', 'Diseño de arquitectura frontend para aplicaciones empresariales.', FALSE),
  
  -- Aplicaciones rechazadas
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Facebook', 'React Developer', 'Remoto', CURRENT_DATE - INTERVAL '40 days', 'Rejected', 'https://facebook.com/careers', 'Desarrollo de componentes para la plataforma principal.', FALSE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Twitter', 'UI Engineer', 'Remoto', CURRENT_DATE - INTERVAL '35 days', 'Declined', 'https://careers.twitter.com', 'Desarrollo de interfaces de usuario para la plataforma.', FALSE),
  
  -- Aplicaciones archivadas
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Amazon', 'Frontend Engineer', 'Remoto', CURRENT_DATE - INTERVAL '60 days', 'Applied', 'https://amazon.jobs', 'Desarrollo de interfaces para la plataforma de e-commerce.', TRUE),
  
  ('099a666d-8496-4bf6-bfb8-228847b296e0', 'Netflix', 'UI/UX Developer', 'Remoto', CURRENT_DATE - INTERVAL '55 days', 'Screening call', 'https://jobs.netflix.com', 'Desarrollo de interfaces para la plataforma de streaming.', TRUE); 