// /workspace/Attraccess/apps/api/src/email/templates/reset-password.template.ts
export const RESET_PASSWORD_MJML_TEMPLATE = `
<mjml>
  <mj-head>
    <mj-title>Reset your password</mj-title>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
    <mj-attributes>
      <mj-all font-family="Roboto, Arial" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-image width="200px" src="{{logoUrl}}" alt="Logo" />

        <mj-text font-size="24px" color="#333333" align="center"> Password Reset Request </mj-text>

        <mj-text font-size="16px" color="#555555"> Hi {{username}}, </mj-text>

        <mj-text font-size="16px" color="#555555">
          We received a request to reset your password. Click the button below to create a new password.
        </mj-text>

        <mj-button background-color="#4CAF50" href="{{resetUrl}}"> Reset Password </mj-button>

        <mj-text font-size="14px" color="#888888">
          If you didn't request a password reset, you can safely ignore this email.
        </mj-text>

        <mj-divider border-color="#eeeeee" />

        <mj-text font-size="12px" color="#888888" align="center">
          &copy; {{year}} Attraccess. All rights reserved.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;