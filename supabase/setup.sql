-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create installers table
CREATE TABLE IF NOT EXISTS installers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checkins table
CREATE TABLE IF NOT EXISTS checkins (
    id VARCHAR(50) PRIMARY KEY,
    installer_id UUID REFERENCES installers(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    checkin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    checklist_data JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checklist_items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT true,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkins_installer_id ON checkins(installer_id);
CREATE INDEX IF NOT EXISTS idx_checkins_status ON checkins(status);
CREATE INDEX IF NOT EXISTS idx_checkins_created_at ON checkins(created_at);
CREATE INDEX IF NOT EXISTS idx_checklist_items_category ON checklist_items(category);
CREATE INDEX IF NOT EXISTS idx_checklist_items_sort_order ON checklist_items(sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE installers ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for installers table
CREATE POLICY "Enable read access for all users" ON installers
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON installers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON installers
    FOR UPDATE USING (true);

-- Create RLS policies for checkins table
CREATE POLICY "Enable read access for all users" ON checkins
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON checkins
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON checkins
    FOR UPDATE USING (true);

-- Create RLS policies for checklist_items table
CREATE POLICY "Enable read access for all users" ON checklist_items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON checklist_items
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON checklist_items
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for email_templates table
CREATE POLICY "Enable read access for authenticated users only" ON email_templates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON email_templates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON email_templates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert the specific 17-item checklist based on user requirements
INSERT INTO checklist_items (item_name, category, is_required, description, sort_order) VALUES
('Check materials in the warehouse with photos and videos', 'Materials', true, 'Document all materials in warehouse with photos and videos', 1),
('Scan QR code and change the status of any moved materials', 'Inventory', true, 'Scan QR codes and update material status', 2),
('Record checking materials with the client in the van and confirm payment method', 'Client', true, 'Verify materials with client and confirm payment', 3),
('Record the entire house, including the basement, before placing the drop cloths', 'Documentation', true, 'Document entire house condition before work begins', 4),
('Show drop cloths placed and furniture covered with plastic, if necessary', 'Protection', true, 'Document protection measures in place', 5),
('Videos of water temperature test and 5-gallon bucket', 'Testing', true, 'Record water temperature testing process', 6),
('Video after demolition', 'Documentation', true, 'Record post-demolition state', 7),
('Photos and videos before closing the walls with plywood', 'Construction', true, 'Document before plywood installation', 8),
('Photos and videos before closing the walls with acrylic', 'Construction', true, 'Document before acrylic installation', 9),
('Photos and videos of new drain and valve', 'Plumbing', true, 'Document new drain and valve installation', 10),
('Client pointing out where they want the accessories', 'Client', true, 'Record client preferences for accessories', 11),
('Video showing silicone application, slowly', 'Construction', true, 'Record silicone application process', 12),
('Final water and bucket test', 'Testing', true, 'Perform final water and bucket testing', 13),
('Show the completed work to the client', 'Client', true, 'Present completed work to client', 14),
('Photos of clean bathroom, hallway, and driveway', 'Documentation', true, 'Document final clean state', 15),
('COC (Certificate of Completion)', 'Administrative', true, 'Complete Certificate of Completion', 16),
('Flush shower valve', 'Plumbing', true, 'Flush and test shower valve', 17);

-- Insert default email template
INSERT INTO email_templates (template_name, subject, content, recipient_email, is_active) VALUES
('completion_notification', 'Installation Completed - {project_name}', 
'Dear {installer_name},

Your installation project "{project_name}" has been completed successfully.

Project Details:
- Project: {project_name}
- Client: {client_name}
- Check-in ID: {checkin_id}
- Completion Date: {completion_date}
- Items Completed: {completed_items}/{total_items} ({completion_percentage}%)

Thank you for your professional work.

Best regards,
Installation Team', 
'admin@company.com', true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_installers_updated_at BEFORE UPDATE ON installers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at BEFORE UPDATE ON checkins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 