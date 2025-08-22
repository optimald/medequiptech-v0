import { Resend } from 'resend'
import { emailTemplates, EmailTemplate } from './email-templates'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailOptions {
  from?: string
  replyTo?: string
}

export class EmailService {
  private static instance: EmailService
  private resend: Resend
  private defaultFrom: string

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
    this.defaultFrom = process.env.FROM_EMAIL || 'noreply@medequiptech.com'
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Send a single email
   */
  async sendEmail(
    to: EmailRecipient | EmailRecipient[],
    template: EmailTemplate,
    options: EmailOptions = {}
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const recipients = Array.isArray(to) ? to : [to]
      
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.defaultFrom,
        to: recipients.map(r => r.name ? `${r.name} <${r.email}>` : r.email),
        subject: template.subject,
        html: template.html,
        text: template.text,
        reply_to: options.replyTo,
      })

      if (error) {
        console.error('Resend email error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, messageId: data?.id }
    } catch (error) {
      console.error('Email service error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Send bulk emails to multiple recipients
   */
  async sendBulkEmails(
    recipients: EmailRecipient[],
    template: EmailTemplate,
    options: EmailOptions = {}
  ): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
    const results = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process emails in batches to avoid rate limiting
    const batchSize = 10
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      const batchPromises = batch.map(recipient =>
        this.sendEmail(recipient, template, options)
      )

      const batchResults = await Promise.all(batchPromises)
      
      batchResults.forEach(result => {
        if (result.success) {
          results.sent++
        } else {
          results.failed++
          if (result.error) {
            results.errors.push(result.error)
          }
        }
      })

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    results.success = results.failed === 0
    return results
  }

  /**
   * Send new signup alert to admins
   */
  async sendSignupAlert(
    userData: {
      email: string
      full_name: string
      role_tech: boolean
      role_trainer: boolean
      base_city: string
      base_state: string
    },
    adminEmails: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = emailTemplates.newSignupAlert(userData)
    const recipients = adminEmails.map(email => ({ email }))
    
    return this.sendEmail(recipients, template, {
      from: 'signups@medequiptech.com',
      replyTo: 'support@medequiptech.com'
    })
  }

  /**
   * Send new bid alert to admins
   */
  async sendBidAlert(
    bidData: {
      job_title: string
      bidder_name: string
      bidder_location: string
      ask_price: number
      job_id: string
    },
    adminEmails: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = emailTemplates.newBidAlert(bidData)
    const recipients = adminEmails.map(email => ({ email }))
    
    return this.sendEmail(recipients, template, {
      from: 'bids@medequiptech.com',
      replyTo: 'support@medequiptech.com'
    })
  }

  /**
   * Send job award notification to user
   */
  async sendJobAwarded(
    userEmail: string,
    userName: string,
    jobData: {
      title: string
      company_name: string
      shipping_city: string
      shipping_state: string
      met_date: string
    }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = emailTemplates.jobAwarded({
      title: jobData.title,
      company_name: jobData.company_name,
      location: `${jobData.shipping_city}, ${jobData.shipping_state}`,
      met_date: jobData.met_date
    })
    
    return this.sendEmail(
      { email: userEmail, name: userName },
      template,
      {
        from: 'awards@medequiptech.com',
        replyTo: 'support@medequiptech.com'
      }
    )
  }

  /**
   * Send welcome email to approved user
   */
  async sendWelcomeApproved(
    userEmail: string,
    userData: {
      full_name: string
      role_tech: boolean
      role_trainer: boolean
    }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = emailTemplates.welcomeApproved(userData)
    
    return this.sendEmail(
      { email: userEmail, name: userData.full_name },
      template,
      {
        from: 'welcome@medequiptech.com',
        replyTo: 'support@medequiptech.com'
      }
    )
  }

  /**
   * Send bulk campaign email
   */
  async sendBulkCampaign(
    recipients: EmailRecipient[],
    campaignData: {
      title: string
      subject: string
      content: string
      cta_text?: string
      cta_link?: string
    }
  ): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
    const template = emailTemplates.bulkCampaign(campaignData)
    
    return this.sendBulkEmails(recipients, template, {
      from: 'campaigns@medequiptech.com',
      replyTo: 'support@medequiptech.com'
    })
  }

  /**
   * Test email service connectivity
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to send a test email to verify API key and connectivity
      const { data, error } = await this.resend.emails.send({
        from: this.defaultFrom,
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>This is a test email to verify the email service is working.</p>',
        text: 'This is a test email to verify the email service is working.'
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()
