import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema for contact form
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: 'Please enter a valid phone number',
  }),
  inquiryType: z.string().min(1, 'Inquiry type is required'),
  bookingReference: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Map inquiry type values to labels
const inquiryTypeLabels: Record<string, string> = {
  general: 'General Inquiry',
  booking: 'Booking Support',
  payment: 'Payment Issue',
  cancellation: 'Cancellation Request',
  feedback: 'Feedback',
  other: 'Other',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = ContactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { name, email, phone, inquiryType, bookingReference, message } = validationResult.data;
    const inquiryLabel = inquiryTypeLabels[inquiryType] || inquiryType;

    // Send email to admin
    const { error } = await resend.emails.send({
      from: 'Total Travel Solution <no-reply@totaltravelsolutiongroup.com>',
      to: process.env.ADMIN_EMAIL || 'customerservice@totaltravelsolution.com',
      replyTo: email,
      subject: `New Contact Form Submission: ${inquiryLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #e11d48;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <a href="tel:${phone}" style="color: #e11d48;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Inquiry Type:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiryLabel}</td>
            </tr>
            ${bookingReference ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Booking Reference:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${bookingReference}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #1e3a5f;">Message:</h3>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This email was sent from the Total Travel Solution contact form.</p>
            <p>You can reply directly to this email to respond to the customer.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

