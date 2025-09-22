# Catalog Studio Email Templates

This directory contains custom email templates for Supabase authentication emails, designed to match the modern, clean aesthetic of the Catalog Studio application.

## Templates Included

### 1. `confirm-signup.html`
- **Purpose**: Email confirmation for new user registrations
- **Trigger**: When a user signs up and needs to verify their email
- **Features**: Welcome message, clear call-to-action, security notice

### 2. `reset-password.html`
- **Purpose**: Password reset emails
- **Trigger**: When a user requests a password reset
- **Features**: Step-by-step instructions, security warnings, clear reset button

### 3. `magic-link.html`
- **Purpose**: Passwordless sign-in emails
- **Trigger**: When using magic link authentication
- **Features**: Secure sign-in, feature highlights, modern design

### 4. `email-change.html`
- **Purpose**: Email address change confirmation
- **Trigger**: When a user changes their email address
- **Features**: Shows old and new email, security notices

## Design Features

✨ **Modern Design**
- Clean, card-based layout
- Consistent with shadcn/ui design system
- Professional gradient header
- Responsive design for all devices

🎨 **Brand Consistency**
- Catalog Studio branding and colors
- Consistent typography and spacing
- Professional appearance

🔒 **Security Focus**
- Clear security notices and warnings
- Expiration time information
- Instructions for suspicious activity

📱 **Mobile Optimized**
- Responsive design
- Touch-friendly buttons
- Readable on all screen sizes

## Implementation Instructions

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Template

#### Confirm Signup Template
1. Select "Confirm signup" template
2. Replace the default HTML with content from `confirm-signup.html`
3. Ensure the subject line is: "Confirm your email - Catalog Studio"

#### Reset Password Template
1. Select "Reset password" template
2. Replace the default HTML with content from `reset-password.html`
3. Ensure the subject line is: "Reset your password - Catalog Studio"

#### Magic Link Template
1. Select "Magic Link" template
2. Replace the default HTML with content from `magic-link.html`
3. Ensure the subject line is: "Sign in to Catalog Studio"

#### Email Change Template
1. Select "Change email address" template
2. Replace the default HTML with content from `email-change.html`
3. Ensure the subject line is: "Confirm email change - Catalog Studio"

### Step 3: Configure Email Settings

#### SMTP Configuration (Recommended for Production)
1. Go to **Authentication** → **Settings**
2. Configure your SMTP settings:
   - **SMTP Host**: Your email provider's SMTP server
   - **SMTP Port**: Usually 587 or 465
   - **SMTP User**: Your email address
   - **SMTP Pass**: Your email password or app password
   - **Sender Email**: noreply@yourdomain.com
   - **Sender Name**: Catalog Studio

#### Email Rate Limiting
- Configure appropriate rate limits to prevent abuse
- Recommended: 30 emails per hour per IP

### Step 4: Test the Templates

1. **Test Signup Flow**:
   ```bash
   # Test user registration
   curl -X POST 'https://your-project.supabase.co/auth/v1/signup' \
   -H "apikey: YOUR_ANON_KEY" \
   -H "Content-Type: application/json" \
   -d '{"email": "test@example.com", "password": "password123"}'
   ```

2. **Test Password Reset**:
   ```bash
   # Test password reset
   curl -X POST 'https://your-project.supabase.co/auth/v1/recover' \
   -H "apikey: YOUR_ANON_KEY" \
   -H "Content-Type: application/json" \
   -d '{"email": "test@example.com"}'
   ```

3. **Test in Application**:
   - Use your forgot password page: `/auth/forgot-password`
   - Use your signup page: `/auth/signup`
   - Verify emails are sent and styled correctly

## Template Variables

Supabase provides these variables for use in templates:

- `{{ .ConfirmationURL }}` - The confirmation/action URL
- `{{ .Email }}` - User's email address
- `{{ .NewEmail }}` - New email address (for email change)
- `{{ .SiteURL }}` - Your site's URL
- `{{ .Token }}` - Authentication token

## Customization

### Colors
The templates use these primary colors:
- **Primary**: `#0f172a` (slate-900)
- **Secondary**: `#1e293b` (slate-800)
- **Background**: `#f8fafc` (slate-50)
- **Text**: `#475569` (slate-600)

### Fonts
- Primary font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Modifying Templates
1. Edit the HTML files in this directory
2. Update the templates in your Supabase dashboard
3. Test thoroughly before deploying to production

## Troubleshooting

### Common Issues

1. **Templates not updating**: Clear browser cache and check Supabase dashboard
2. **Styling issues**: Ensure all CSS is inline (email clients don't support external CSS)
3. **Variables not working**: Check Supabase documentation for correct variable syntax
4. **SMTP issues**: Verify SMTP credentials and test with a simple email client

### Support

For issues with:
- **Template design**: Check this README and template files
- **Supabase configuration**: Refer to [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
- **SMTP setup**: Contact your email provider's support

## Production Checklist

Before going live:

- [ ] All templates tested and working
- [ ] SMTP configured with production email service
- [ ] Rate limiting configured appropriately
- [ ] Email deliverability tested (check spam folders)
- [ ] Templates display correctly on mobile devices
- [ ] All links work correctly
- [ ] Security notices are appropriate for your use case

---

**Note**: These templates are designed specifically for Catalog Studio and match the application's design system. They provide a professional, secure, and user-friendly email experience for your restaurant management platform.
