import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { checkinId, installerData, projectData, checklistData } = await req.json()

    // Email configuration
    const client = new SmtpClient()

    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USER') || '',
      password: Deno.env.get('SMTP_PASS') || '',
    })

    // Calculate completion statistics
    const completedItems = Object.values(checklistData || {}).filter((item: any) => item.completed).length
    const totalItems = Object.keys(checklistData || {}).length
    const completionPercentage = Math.round((completedItems / totalItems) * 100)

    // Create email content
    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .stats { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
            .success { color: #16a34a; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Installation Completed Successfully</h1>
          </div>
          
          <div class="content">
            <h2>Project Details</h2>
            <p><strong>Project:</strong> ${projectData?.name}</p>
            <p><strong>Client:</strong> ${projectData?.client}</p>
            <p><strong>Installer:</strong> ${installerData?.name} (${installerData?.company})</p>
            <p><strong>Check-in ID:</strong> ${checkinId}</p>
            <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <div class="stats">
              <h3>Completion Summary</h3>
              <p class="success">✅ ${completedItems} of ${totalItems} items completed (${completionPercentage}%)</p>
            </div>
            
            <h3>Completed Checklist Items:</h3>
            <ul>
              ${Object.entries(checklistData || {}).map(([key, item]: [string, any]) => 
                item.completed ? `<li>✅ ${key}</li>` : ''
              ).join('')}
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the Installer Check-in System.</p>
            <p>Check-in ID: ${checkinId}</p>
          </div>
        </body>
      </html>
    `

    // Send email
    await client.send({
      from: Deno.env.get('SMTP_FROM') || '',
      to: installerData?.email || 'admin@company.com',
      subject: `Installation Completed - ${projectData?.name}`,
      content: emailContent,
      html: emailContent,
    })

    await client.close()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 