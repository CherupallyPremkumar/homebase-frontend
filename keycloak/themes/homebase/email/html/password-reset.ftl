<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="420" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding:40px 32px;">
                            <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#2563eb;text-align:center;letter-spacing:-0.5px;">
                                HomeBase
                            </h1>
                            <p style="margin:0 0 32px;font-size:15px;color:#6b7280;text-align:center;">
                                Reset your password
                            </p>

                            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
                                Hi ${user.firstName},
                            </p>
                            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                                We received a request to reset the password for your HomeBase account. Click the button below to set a new password. This link will expire in ${linkExpirationFormatter(linkExpiration)}.
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <a href="${link}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;background-color:#2563eb;border-radius:8px;text-decoration:none;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.5;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${link}" style="color:#2563eb;word-break:break-all;">${link}</a>
                            </p>

                            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.5;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px 32px;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#d1d5db;border-top:1px solid #e5e7eb;padding-top:24px;">
                                &copy; 2026 HomeBase. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
