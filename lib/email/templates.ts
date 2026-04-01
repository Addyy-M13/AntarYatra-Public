/**
 * Email templates for AntarYatra
 * These are placeholder templates for development
 * For production: Consider using a template engine or email service with built-in templates
 */

interface EmailTemplate {
  subject: string
  text: string
  html: string
}

/**
 * Welcome email for new waitlist signups
 */
export function getWaitlistWelcomeEmail(email: string): EmailTemplate {
  return {
    subject: "Welcome to AntarYatra! 🌟",
    text: `Hi there!

Thank you for joining the AntarYatra waitlist. We're building something special - an AI-powered mental wellness platform that will help you transform anxiety into confidence.

You'll be among the first to know when we launch on November 14th, 2024.

Meanwhile, feel free to explore our interactive features at https://antaryatra.com/explore

Take care,
The AntarYatra Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Welcome to AntarYatra! 🌟</h1>
        <p>Hi there!</p>
        <p>Thank you for joining the AntarYatra waitlist. We're building something special - an AI-powered mental wellness platform that will help you transform anxiety into confidence.</p>
        <p>You'll be among the first to know when we launch on <strong>November 14th, 2024</strong>.</p>
        <p>Meanwhile, feel free to explore our interactive features at <a href="https://antaryatra.com/explore">antaryatra.com/explore</a></p>
        <p style="margin-top: 30px;">Take care,<br>The AntarYatra Team</p>
      </div>
    `
  }
}

/**
 * Confirmation email with waitlist position and referral code
 */
export function getWaitlistConfirmationEmail(email: string, position: number, referralCode: string): EmailTemplate {
  return {
    subject: `You're #${position} on the AntarYatra waitlist! 🎉`,
    text: `Hi there!

You're officially on the AntarYatra waitlist!

Your Position: #${position}
Your Referral Code: ${referralCode}

Want to move up the waitlist? Share your referral code with friends! For every person who joins using your code, you'll both move up 10 spots.

Share this link: https://antaryatra.com?ref=${referralCode}

We're launching November 14th, 2024. See you soon!

Take care,
The AntarYatra Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">You're on the waitlist! 🎉</h1>
        <p>Hi there!</p>
        <p>You're officially on the AntarYatra waitlist!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Your Position:</strong> #${position}</p>
          <p style="margin: 5px 0;"><strong>Your Referral Code:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${referralCode}</code></p>
        </div>

        <h2 style="color: #4f46e5;">Want to move up?</h2>
        <p>Share your referral code with friends! For every person who joins using your code, you'll both move up <strong>10 spots</strong>.</p>
        
        <p>Share this link: <a href="https://antaryatra.com?ref=${referralCode}">https://antaryatra.com?ref=${referralCode}</a></p>

        <p style="margin-top: 30px;">We're launching <strong>November 14th, 2024</strong>. See you soon!</p>
        <p>Take care,<br>The AntarYatra Team</p>
      </div>
    `
  }
}

/**
 * Notification email when someone uses their referral code
 */
export function getReferralSuccessEmail(referrerEmail: string, newUserEmail: string, totalReferrals: number): EmailTemplate {
  // Obscure the new user's email for privacy
  const obscuredEmail = newUserEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  
  return {
    subject: "🎉 Someone used your referral code!",
    text: `Hi there!

Great news! Someone just joined AntarYatra using your referral code.

New member: ${obscuredEmail}
Your total referrals: ${totalReferrals}

You both moved up 10 spots on the waitlist! Keep sharing to move up even more.

Share your link: https://antaryatra.com?ref=${referrerEmail}

Take care,
The AntarYatra Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">🎉 Someone used your referral code!</h1>
        <p>Hi there!</p>
        <p>Great news! Someone just joined AntarYatra using your referral code.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>New member:</strong> ${obscuredEmail}</p>
          <p style="margin: 5px 0;"><strong>Your total referrals:</strong> ${totalReferrals}</p>
        </div>

        <p>You both moved up <strong>10 spots</strong> on the waitlist! Keep sharing to move up even more.</p>

        <p style="margin-top: 30px;">Take care,<br>The AntarYatra Team</p>
      </div>
    `
  }
}
