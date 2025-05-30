// /workspace/Attraccess/apps/api/src/email/templates/verify-email.template.ts
export const VERIFY_EMAIL_MJML_TEMPLATE = `
<mjml>
  <mj-head>
    <mj-title>Verify your email address</mj-title>
    <mj-font
      name="Roboto"
      href="https://fonts.googleapis.com/css?family=Roboto"
    />
    <mj-attributes>
      <mj-all font-family="Roboto, Arial" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f4">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-image width="200px" src="{{logoUrl}}" alt="Logo" />

        <mj-text font-size="24px" color="#333333" align="center">
          Welcome to Attraccess!
        </mj-text>

        <mj-text font-size="16px" color="#555555"> Hi {{username}}, </mj-text>

        <mj-text font-size="16px" color="#555555">
          Thanks for signing up! Please verify your email address to complete
          your registration.
        </mj-text>

        <mj-button background-color="#4CAF50" href="{{verificationUrl}}">
          Verify Email Address
        </mj-button>

        <mj-text font-size="14px" color="#888888">
          If you didn't create an account, you can safely ignore this email.
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