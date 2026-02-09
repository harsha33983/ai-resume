-- Seed jobs table with 40+ fresher-friendly jobs from various companies/sources
INSERT INTO jobs (title, company, location, job_type, experience_level, description, skills, salary_range, apply_url, source, posted_at) VALUES

-- Tech Giants
('Software Engineer, University Graduate', 'Google', 'Bangalore, India', 'Full-time', 'Entry Level', 'Join Google as a new grad software engineer. Work on products used by billions. Strong CS fundamentals required.', ARRAY['Python','Java','Data Structures','Algorithms','System Design'], '$120,000 - $160,000', 'https://careers.google.com', 'Google Careers', NOW() - INTERVAL '1 day'),

('Software Development Engineer I', 'Amazon', 'Hyderabad, India', 'Full-time', 'Entry Level', 'Build and operate massively scalable systems at Amazon. Ideal for fresh graduates with strong problem-solving skills.', ARRAY['Java','AWS','Distributed Systems','OOP','Linux'], '$110,000 - $150,000', 'https://www.amazon.jobs', 'Amazon Jobs', NOW() - INTERVAL '2 days'),

('Associate Software Engineer', 'Microsoft', 'Noida, India', 'Full-time', 'Entry Level', 'Develop innovative solutions across Microsoft products. Great opportunity for freshers passionate about technology.', ARRAY['C#','.NET','Azure','TypeScript','React'], '$105,000 - $140,000', 'https://careers.microsoft.com', 'Microsoft Careers', NOW() - INTERVAL '1 day'),

('Software Engineer - New Grad', 'Meta', 'Menlo Park, CA', 'Full-time', 'Entry Level', 'Build features that connect billions of people. Work on cutting-edge infrastructure and product teams.', ARRAY['Python','React','GraphQL','Machine Learning','C++'], '$125,000 - $170,000', 'https://www.metacareers.com', 'Meta Careers', NOW() - INTERVAL '3 days'),

('Junior Software Engineer', 'Apple', 'Cupertino, CA', 'Full-time', 'Entry Level', 'Design and build next-generation Apple software. Focus on performance, reliability, and user experience.', ARRAY['Swift','Objective-C','iOS','macOS','Xcode'], '$115,000 - $155,000', 'https://jobs.apple.com', 'Apple Jobs', NOW() - INTERVAL '2 days'),

-- Startups & Growth Companies
('Frontend Engineer (New Grad)', 'Vercel', 'Remote', 'Full-time', 'Entry Level', 'Build the future of web development. Work on Next.js, Turborepo, and the Vercel platform.', ARRAY['React','Next.js','TypeScript','CSS','Node.js'], '$100,000 - $140,000', 'https://vercel.com/careers', 'Vercel Careers', NOW() - INTERVAL '1 day'),

('Junior Full Stack Developer', 'Stripe', 'San Francisco, CA', 'Full-time', 'Entry Level', 'Help build the economic infrastructure of the internet. Work on payment APIs and developer tools.', ARRAY['Ruby','JavaScript','React','PostgreSQL','API Design'], '$120,000 - $155,000', 'https://stripe.com/jobs', 'Stripe Jobs', NOW() - INTERVAL '4 days'),

('Graduate Software Engineer', 'Atlassian', 'Sydney, Australia', 'Full-time', 'Entry Level', 'Build collaboration tools used by millions of teams worldwide. Work on Jira, Confluence, or Bitbucket.', ARRAY['Java','React','TypeScript','Agile','REST APIs'], '$85,000 - $110,000', 'https://www.atlassian.com/company/careers', 'Atlassian Careers', NOW() - INTERVAL '2 days'),

('Associate Engineer - Platform', 'Razorpay', 'Bangalore, India', 'Full-time', 'Entry Level', 'Build India''s leading payment gateway. Work on high-throughput financial systems processing millions of transactions.', ARRAY['Go','Python','MySQL','Redis','Docker'], '₹12,00,000 - ₹18,00,000', 'https://razorpay.com/careers', 'Razorpay Careers', NOW() - INTERVAL '1 day'),

('Software Engineer I', 'Flipkart', 'Bangalore, India', 'Full-time', 'Entry Level', 'Join India''s largest e-commerce platform. Build scalable backend services handling millions of users.', ARRAY['Java','Spring Boot','Microservices','Kafka','MySQL'], '₹14,00,000 - ₹22,00,000', 'https://www.flipkartcareers.com', 'Flipkart Careers', NOW() - INTERVAL '3 days'),

-- AI/ML Companies
('ML Engineer - New Grad', 'OpenAI', 'San Francisco, CA', 'Full-time', 'Entry Level', 'Work on large language models and AI safety research. Help shape the future of artificial intelligence.', ARRAY['Python','PyTorch','Machine Learning','NLP','Mathematics'], '$150,000 - $200,000', 'https://openai.com/careers', 'OpenAI Careers', NOW() - INTERVAL '2 days'),

('Junior AI/ML Engineer', 'DeepMind', 'London, UK', 'Full-time', 'Entry Level', 'Solve intelligence to advance science and benefit humanity. Work on cutting-edge deep learning research.', ARRAY['Python','TensorFlow','Deep Learning','Research','Mathematics'], '£55,000 - £80,000', 'https://deepmind.google/careers', 'DeepMind Careers', NOW() - INTERVAL '5 days'),

('Associate Data Scientist', 'Databricks', 'San Francisco, CA', 'Full-time', 'Entry Level', 'Build the lakehouse platform. Work on data engineering and ML tools used by thousands of enterprises.', ARRAY['Python','Spark','SQL','Machine Learning','Scala'], '$110,000 - $145,000', 'https://www.databricks.com/company/careers', 'Databricks Careers', NOW() - INTERVAL '3 days'),

('Junior ML Ops Engineer', 'Hugging Face', 'Remote', 'Full-time', 'Entry Level', 'Democratize machine learning. Build tools and infrastructure for the open-source ML community.', ARRAY['Python','Docker','Kubernetes','MLOps','Transformers'], '$90,000 - $130,000', 'https://huggingface.co/jobs', 'Hugging Face Jobs', NOW() - INTERVAL '1 day'),

-- Cloud & DevOps
('Junior Cloud Engineer', 'Cloudflare', 'Austin, TX', 'Full-time', 'Entry Level', 'Help build a better internet. Work on the network that powers millions of websites worldwide.', ARRAY['Go','Rust','Linux','Networking','DNS'], '$100,000 - $135,000', 'https://www.cloudflare.com/careers', 'Cloudflare Careers', NOW() - INTERVAL '2 days'),

('Associate DevOps Engineer', 'HashiCorp', 'Remote', 'Full-time', 'Entry Level', 'Build infrastructure automation tools. Work on Terraform, Vault, Consul, and Nomad.', ARRAY['Go','Terraform','AWS','Docker','Kubernetes'], '$95,000 - $125,000', 'https://www.hashicorp.com/careers', 'HashiCorp Careers', NOW() - INTERVAL '4 days'),

('Graduate Site Reliability Engineer', 'Datadog', 'New York, NY', 'Full-time', 'Entry Level', 'Build and maintain monitoring infrastructure at scale. Ensure reliability of cloud-native applications.', ARRAY['Python','Go','Kubernetes','Prometheus','AWS'], '$105,000 - $140,000', 'https://careers.datadoghq.com', 'Datadog Careers', NOW() - INTERVAL '3 days'),

-- Fintech
('Junior Backend Developer', 'Zerodha', 'Bangalore, India', 'Full-time', 'Entry Level', 'Build India''s largest stock trading platform. Work on low-latency systems processing millions of orders daily.', ARRAY['Go','Python','PostgreSQL','Redis','WebSockets'], '₹10,00,000 - ₹16,00,000', 'https://zerodha.com/careers', 'Zerodha Careers', NOW() - INTERVAL '1 day'),

('Software Engineer - Graduate', 'Revolut', 'London, UK', 'Full-time', 'Entry Level', 'Build the global financial super app. Work on banking, crypto, and trading features for 30M+ users.', ARRAY['Java','Kotlin','Spring','Microservices','PostgreSQL'], '£50,000 - £70,000', 'https://www.revolut.com/careers', 'Revolut Careers', NOW() - INTERVAL '2 days'),

('Associate Software Engineer', 'PhonePe', 'Bangalore, India', 'Full-time', 'Entry Level', 'Build India''s leading digital payments platform. Handle 1B+ monthly transactions at scale.', ARRAY['Java','Spring Boot','Kafka','Cassandra','Microservices'], '₹12,00,000 - ₹20,00,000', 'https://www.phonepe.com/careers', 'PhonePe Careers', NOW() - INTERVAL '3 days'),

-- Internships
('Software Engineering Intern', 'Google', 'Mountain View, CA', 'Internship', 'Internship', 'Summer internship working on real Google products. Mentorship from senior engineers and exposure to large-scale systems.', ARRAY['Python','Java','C++','Algorithms','Data Structures'], '$8,000/month', 'https://careers.google.com/students', 'Google Careers', NOW() - INTERVAL '5 days'),

('SDE Intern', 'Amazon', 'Seattle, WA', 'Internship', 'Internship', '12-week internship building features for Amazon services. Full-time conversion opportunity for top performers.', ARRAY['Java','Python','AWS','OOP','Problem Solving'], '$7,500/month', 'https://www.amazon.jobs/students', 'Amazon Jobs', NOW() - INTERVAL '4 days'),

('Product Engineering Intern', 'Swiggy', 'Bangalore, India', 'Internship', 'Internship', 'Work on India''s top food delivery app. Build features used by millions of customers and restaurant partners.', ARRAY['React','Node.js','MongoDB','Python','Git'], '₹50,000/month', 'https://careers.swiggy.com', 'Swiggy Careers', NOW() - INTERVAL '2 days'),

('Data Science Intern', 'Zomato', 'Gurugram, India', 'Internship', 'Internship', 'Apply ML models to food-tech problems. Work on recommendation systems and demand prediction at scale.', ARRAY['Python','SQL','Machine Learning','Pandas','Statistics'], '₹40,000/month', 'https://www.zomato.com/careers', 'Zomato Careers', NOW() - INTERVAL '3 days'),

('Frontend Intern', 'Figma', 'San Francisco, CA', 'Internship', 'Internship', 'Build the future of collaborative design tools. Work on the web-based design editor used by millions.', ARRAY['TypeScript','React','WebGL','CSS','Performance'], '$9,000/month', 'https://www.figma.com/careers', 'Figma Careers', NOW() - INTERVAL '1 day'),

-- Remote-first Companies
('Junior Developer', 'GitLab', 'Remote', 'Full-time', 'Entry Level', 'Work at the world''s largest all-remote company. Contribute to the DevSecOps platform used by millions of developers.', ARRAY['Ruby','Go','Vue.js','PostgreSQL','Git'], '$90,000 - $120,000', 'https://about.gitlab.com/jobs', 'GitLab Jobs', NOW() - INTERVAL '2 days'),

('Associate Software Engineer', 'Automattic', 'Remote', 'Full-time', 'Entry Level', 'Build WordPress.com, WooCommerce, Tumblr, and more. Join a fully distributed team across 90+ countries.', ARRAY['PHP','JavaScript','React','WordPress','MySQL'], '$70,000 - $100,000', 'https://automattic.com/work-with-us', 'Automattic Careers', NOW() - INTERVAL '4 days'),

('Junior Backend Engineer', 'Supabase', 'Remote', 'Full-time', 'Entry Level', 'Build the open source Firebase alternative. Work on PostgreSQL, realtime, auth, and edge functions.', ARRAY['TypeScript','PostgreSQL','Elixir','Go','Docker'], '$90,000 - $130,000', 'https://supabase.com/careers', 'Supabase Careers', NOW() - INTERVAL '1 day'),

('Graduate Engineer', 'Canonical', 'Remote', 'Full-time', 'Entry Level', 'Work on Ubuntu, the world''s most popular Linux distribution. Build cloud infrastructure and open source tools.', ARRAY['Python','Go','Linux','Kubernetes','Juju'], '$60,000 - $90,000', 'https://canonical.com/careers', 'Canonical Careers', NOW() - INTERVAL '5 days'),

-- Contract/Freelance
('React Developer (Contract)', 'Toptal', 'Remote', 'Contract', 'Entry Level', 'Join Toptal''s network of top freelance developers. Work with Fortune 500 companies on exciting projects.', ARRAY['React','TypeScript','Next.js','Node.js','GraphQL'], '$50-80/hr', 'https://www.toptal.com/developers', 'Toptal', NOW() - INTERVAL '3 days'),

('Junior Web Developer (Freelance)', 'Upwork', 'Remote', 'Contract', 'Entry Level', 'Find freelance web development projects. Build your portfolio working with global clients.', ARRAY['HTML','CSS','JavaScript','React','WordPress'], '$25-50/hr', 'https://www.upwork.com', 'Upwork', NOW() - INTERVAL '1 day'),

-- Part-time Opportunities
('Part-time Frontend Developer', 'Shopify', 'Remote', 'Part-time', 'Entry Level', 'Help build the e-commerce platform powering millions of businesses. Flexible hours for students and new grads.', ARRAY['React','TypeScript','GraphQL','Ruby','Polaris'], '$45-65/hr', 'https://www.shopify.com/careers', 'Shopify Careers', NOW() - INTERVAL '2 days'),

('Junior Developer Advocate', 'Twilio', 'Remote', 'Part-time', 'Entry Level', 'Create developer tutorials and sample applications. Help developers build communication features.', ARRAY['JavaScript','Python','APIs','Technical Writing','Public Speaking'], '$40-55/hr', 'https://www.twilio.com/company/jobs', 'Twilio Jobs', NOW() - INTERVAL '4 days'),

-- Indian Service Companies
('Associate Engineer', 'Infosys', 'Pune, India', 'Full-time', 'Entry Level', 'Join one of India''s largest IT companies. Training provided through Infosys Springboard program.', ARRAY['Java','SQL','Python','Agile','SDLC'], '₹4,50,000 - ₹7,00,000', 'https://www.infosys.com/careers', 'Infosys Careers', NOW() - INTERVAL '1 day'),

('Systems Engineer', 'TCS', 'Mumbai, India', 'Full-time', 'Entry Level', 'Work with Fortune 500 clients across banking, healthcare, and retail domains. Comprehensive training program.', ARRAY['Java','Python','SQL','Cloud','DevOps'], '₹3,60,000 - ₹6,50,000', 'https://www.tcs.com/careers', 'TCS Careers', NOW() - INTERVAL '2 days'),

('Associate Software Engineer', 'Wipro', 'Chennai, India', 'Full-time', 'Entry Level', 'Digital transformation projects for global enterprises. Elite NLTH training program for freshers.', ARRAY['Java','Python','Cloud','Automation','SQL'], '₹3,50,000 - ₹6,00,000', 'https://careers.wipro.com', 'Wipro Careers', NOW() - INTERVAL '3 days'),

('Graduate Engineer Trainee', 'HCLTech', 'Noida, India', 'Full-time', 'Entry Level', 'Work on next-gen technologies including AI, cloud, and cybersecurity. Rotational program across business units.', ARRAY['Java','C++','Python','Linux','Networking'], '₹4,00,000 - ₹7,00,000', 'https://www.hcltech.com/careers', 'HCLTech Careers', NOW() - INTERVAL '1 day'),

-- Cybersecurity
('Junior Security Analyst', 'CrowdStrike', 'Remote', 'Full-time', 'Entry Level', 'Protect organizations from cyber threats. Work on endpoint security and threat intelligence.', ARRAY['Python','Linux','Networking','Security','SIEM'], '$85,000 - $115,000', 'https://www.crowdstrike.com/careers', 'CrowdStrike Careers', NOW() - INTERVAL '3 days'),

('Associate Security Engineer', 'Palo Alto Networks', 'Santa Clara, CA', 'Full-time', 'Entry Level', 'Build next-generation cybersecurity solutions. Work on firewalls, cloud security, and AI-driven threat detection.', ARRAY['Python','Networking','Cloud Security','Linux','Go'], '$95,000 - $130,000', 'https://jobs.paloaltonetworks.com', 'Palo Alto Networks Jobs', NOW() - INTERVAL '2 days'),

-- Gaming
('Junior Game Developer', 'Ubisoft', 'Montreal, Canada', 'Full-time', 'Entry Level', 'Create AAA gaming experiences. Work on game engines, gameplay systems, and online features.', ARRAY['C++','Unreal Engine','3D Math','Physics','Game Design'], 'CAD 55,000 - 75,000', 'https://www.ubisoft.com/careers', 'Ubisoft Careers', NOW() - INTERVAL '4 days'),

('Associate Game Engineer', 'Riot Games', 'Los Angeles, CA', 'Full-time', 'Entry Level', 'Build games that players love. Work on League of Legends, Valorant, or new titles.', ARRAY['C++','Game Engines','Networking','Graphics','Problem Solving'], '$100,000 - $135,000', 'https://www.riotgames.com/careers', 'Riot Games Careers', NOW() - INTERVAL '2 days'),

-- Blockchain/Web3
('Junior Blockchain Developer', 'Polygon', 'Remote', 'Full-time', 'Entry Level', 'Build Ethereum scaling solutions. Work on Layer 2 protocols and developer tools for Web3.', ARRAY['Solidity','Go','Rust','Ethereum','Smart Contracts'], '$90,000 - $130,000', 'https://polygon.technology/careers', 'Polygon Careers', NOW() - INTERVAL '5 days'),

-- Healthcare Tech
('Junior Software Engineer', 'Practo', 'Bangalore, India', 'Full-time', 'Entry Level', 'Build healthcare technology connecting doctors and patients. Work on telemedicine and health records platforms.', ARRAY['Python','Django','React','PostgreSQL','AWS'], '₹8,00,000 - ₹14,00,000', 'https://www.practo.com/careers', 'Practo Careers', NOW() - INTERVAL '2 days'),

-- EdTech
('Associate Engineer', 'Byju''s', 'Bangalore, India', 'Full-time', 'Entry Level', 'Build India''s largest ed-tech platform. Create engaging learning experiences for millions of students.', ARRAY['React Native','Node.js','MongoDB','Python','AWS'], '₹8,00,000 - ₹14,00,000', 'https://byjus.com/careers', 'BYJU''S Careers', NOW() - INTERVAL '3 days'),

('Junior Developer', 'Coursera', 'Remote', 'Full-time', 'Entry Level', 'Make world-class education accessible to everyone. Build features for 100M+ registered learners.', ARRAY['React','Python','Scala','PostgreSQL','AWS'], '$90,000 - $120,000', 'https://about.coursera.org/careers', 'Coursera Careers', NOW() - INTERVAL '4 days')

ON CONFLICT DO NOTHING;
