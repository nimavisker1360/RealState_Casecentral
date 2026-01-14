import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";

// Create transporter with Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email
export const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required",
    });
  }

  try {
    const transporter = createTransporter();

    // Email to the company
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || `New Contact from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #06a84e 0%, #048a3d 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">New Property Inquiry</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #333;">Name:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #333;">Email:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">
                  <a href="mailto:${email}" style="color: #06a84e;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #333;">Phone:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">
                  <a href="tel:${phone}" style="color: #06a84e;">${phone}</a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                  <strong style="color: #333;">Subject:</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">
                  ${subject || 'Property Inquiry'}
                </td>
              </tr>
            </table>
            <div style="margin-top: 20px;">
              <strong style="color: #333;">Message:</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #e0e0e0; color: #555; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>This email was sent from HB International Real Estate website</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting HB International",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #06a84e 0%, #048a3d 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Thank You!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; font-size: 16px;">Dear ${name},</p>
            <p style="color: #555; line-height: 1.6;">Thank you for contacting HB International Real Estate. We have received your inquiry and will get back to you as soon as possible.</p>
            <p style="color: #555; line-height: 1.6;">In the meantime, feel free to browse our properties or contact us directly:</p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e0e0e0;">
              <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> +90 542 435 9694</p>
              <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> hprealstate2019@gmail.com</p>
            </div>
            <p style="color: #555; line-height: 1.6;">Best regards,<br><strong style="color: #06a84e;">HB International Team</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMail);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});
