export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  // New user signup notification for admins
  newSignupAlert: (userData: {
    email: string
    full_name: string
    role_tech: boolean
    role_trainer: boolean
    base_city: string
    base_state: string
  }): EmailTemplate => {
    const roles = []
    if (userData.role_tech) roles.push('Technician')
    if (userData.role_trainer) roles.push('Trainer')
    
    const subject = `New User Signup: ${userData.full_name}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New User Signup</h2>
        <p>A new user has signed up and requires approval:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">User Details</h3>
          <p><strong>Name:</strong> ${userData.full_name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Roles:</strong> ${roles.join(', ')}</p>
          <p><strong>Location:</strong> ${userData.base_city}, ${userData.base_state}</p>
        </div>
        
        <p>Please review and approve this user in the admin dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated notification from MedEquipTech.
          </p>
        </div>
      </div>
    `
    
    const text = `
New User Signup

A new user has signed up and requires approval:

User Details:
- Name: ${userData.full_name}
- Email: ${userData.email}
- Roles: ${roles.join(', ')}
- Location: ${userData.base_city}, ${userData.base_state}

Please review and approve this user in the admin dashboard.

---
This is an automated notification from MedEquipTech.
    `
    
    return { subject, html, text }
  },

  // New bid notification for admins
  newBidAlert: (bidData: {
    job_title: string
    bidder_name: string
    bidder_location: string
    ask_price: number
    job_id: string
  }): EmailTemplate => {
    const subject = `New Bid: ${bidData.job_title}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Bid Received</h2>
        <p>A new bid has been submitted for a job:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Job Details</h3>
          <p><strong>Job Title:</strong> ${bidData.job_title}</p>
          <p><strong>Job ID:</strong> ${bidData.job_id}</p>
          
          <h3 style="margin-top: 20px;">Bid Details</h3>
          <p><strong>Bidder:</strong> ${bidData.bidder_name}</p>
          <p><strong>Location:</strong> ${bidData.bidder_location}</p>
          <p><strong>Bid Amount:</strong> $${bidData.ask_price.toFixed(2)}</p>
        </div>
        
        <p>Review this bid in the admin dashboard.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated notification from MedEquipTech.
          </p>
        </div>
      </div>
    `
    
    const text = `
New Bid Received

A new bid has been submitted for a job:

Job Details:
- Job Title: ${bidData.job_title}
- Job ID: ${bidData.job_id}

Bid Details:
- Bidder: ${bidData.bidder_name}
- Location: ${bidData.bidder_location}
- Bid Amount: $${bidData.ask_price.toFixed(2)}

Review this bid in the admin dashboard.

---
This is an automated notification from MedEquipTech.
    `
    
    return { subject, html, text }
  },

  // Job award notification for users
  jobAwarded: (jobData: {
    title: string
    company_name: string
    location: string
    met_date: string
  }): EmailTemplate => {
    const subject = `Job Awarded: ${jobData.title}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Congratulations! Job Awarded</h2>
        <p>Your bid has been accepted for the following job:</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #059669;">Job Details</h3>
          <p><strong>Title:</strong> ${jobData.title}</p>
          <p><strong>Company:</strong> ${jobData.company_name}</p>
          <p><strong>Location:</strong> ${jobData.location}</p>
          <p><strong>MET Date:</strong> ${new Date(jobData.met_date).toLocaleDateString()}</p>
        </div>
        
        <p>Please contact the company to coordinate the work schedule and any additional details.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This is an automated notification from MedEquipTech.
          </p>
        </div>
      </div>
    `
    
    const text = `
Congratulations! Job Awarded

Your bid has been accepted for the following job:

Job Details:
- Title: ${jobData.title}
- Company: ${jobData.company_name}
- Location: ${jobData.location}
- MET Date: ${new Date(jobData.met_date).toLocaleDateString()}

Please contact the company to coordinate the work schedule and any additional details.

---
This is an automated notification from MedEquipTech.
    `
    
    return { subject, html, text }
  },

  // Welcome email for approved users
  welcomeApproved: (userData: {
    full_name: string
    role_tech: boolean
    role_trainer: boolean
  }): EmailTemplate => {
    const roles = []
    if (userData.role_tech) roles.push('Technician')
    if (userData.role_trainer) roles.push('Trainer')
    
    const subject = `Welcome to MedEquipTech!`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to MedEquipTech!</h2>
        <p>Hi ${userData.full_name},</p>
        
        <p>Your account has been approved! You can now access the platform as a <strong>${roles.join(' and ')}</strong>.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul style="padding-left: 20px;">
            <li>Browse available jobs in your area</li>
            <li>Submit competitive bids</li>
            <li>Build your reputation and client base</li>
            <li>Access training and support resources</li>
          </ul>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            Welcome to the MedEquipTech community!
          </p>
        </div>
      </div>
    `
    
    const text = `
Welcome to MedEquipTech!

Hi ${userData.full_name},

Your account has been approved! You can now access the platform as a ${roles.join(' and ')}.

What's Next?
- Browse available jobs in your area
- Submit competitive bids
- Build your reputation and client base
- Access training and support resources

If you have any questions, please don't hesitate to contact our support team.

---
Welcome to the MedEquipTech community!
    `
    
    return { subject, html, text }
  },

  // Bulk email campaign template
  bulkCampaign: (campaignData: {
    title: string
    subject: string
    content: string
    cta_text?: string
    cta_link?: string
  }): EmailTemplate => {
    const subject = campaignData.subject
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${campaignData.title}</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${campaignData.content.replace(/\n/g, '<br>')}
        </div>
        
        ${campaignData.cta_link && campaignData.cta_text ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${campaignData.cta_link}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              ${campaignData.cta_text}
            </a>
          </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px;">
            This email was sent by MedEquipTech. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    `
    
    const text = `
${campaignData.title}

${campaignData.content}

${campaignData.cta_link && campaignData.cta_text ? `${campaignData.cta_text}: ${campaignData.cta_link}` : ''}

---
This email was sent by MedEquipTech. You can unsubscribe at any time.
    `
    
    return { subject, html, text }
  }
}
