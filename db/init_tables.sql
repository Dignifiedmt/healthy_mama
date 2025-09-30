CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_path TEXT,
  author TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_path TEXT,
  status TEXT DEFAULT 'pending',
  submitter_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

INSERT INTO articles (title, slug, excerpt, content, author, image_path) VALUES
('Muhimmancin Awon Ciki', 'muhimmancin-awon-ciki', 'Sanin muhimmancin zuwa awon ciki akai-akai don tabbatar da lafiyar uwa da abin da ke cikinta.', '**Muhimmancin Awon Ciki**: Awon ciki akai-akai shine mabuɗin lafiya. *Tuntuɓi likita* idan ka ji dadi.', 'Admin', ''),
('Abinci Mai Gina Jiki ga Yara', 'abinci-mai-gina-jiki-ga-yara', 'Jerin abinci masu gina jiki waɗanda ke taimakawa wajen haɓakar lafiyar kwakwalwa da jikin yara ƙanana.', '**Abinci Mai Gina Jiki**:\n- Nono na uwa\n- ''Ya''yan itace\n- Kayan lambu', 'Admin', ''),
('Rigakafin Yara', 'rigakafin-yara', 'Me yasa yake da muhimmanci a tabbatar da cewa yaronka ya sami dukkanin alluran rigakafin da ake buƙata?', '**Rigakafin Yara**: Yi amfani da jadawalin rigakafi don kare cututtuka. Tuntuɓi likita.', 'Admin', '');
