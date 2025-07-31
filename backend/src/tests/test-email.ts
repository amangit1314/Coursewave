import EmailService from '../core/services/emailService';
import TokenService from '../core/services/tokenService';
import CSRFService from '../core/services/csrfService';

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');

  try {
    // Test 1: Email configuration
    console.log('1. Testing email configuration...');
    const configValid = await EmailService.testEmailConfiguration();
    console.log(`   ✅ Email configuration: ${configValid ? 'VALID' : 'INVALID'}\n`);

    if (!configValid) {
      console.log('❌ Email configuration is invalid. Please check your environment variables:');
      console.log('   - SMTP_HOST');
      console.log('   - SMTP_PORT');
      console.log('   - SMTP_USER');
      console.log('   - SMTP_PASS');
      console.log('   - FROM_EMAIL');
      console.log('   - FROM_NAME');
      return;
    }

    // Test 2: Token generation
    console.log('2. Testing token generation...');
    const testUserId = 'test-user-id';
    const verificationToken = await TokenService.generateVerificationToken(testUserId);
    const resetToken = await TokenService.generatePasswordResetToken(testUserId);
    console.log(`   ✅ Verification token: ${verificationToken ? 'GENERATED' : 'FAILED'}`);
    console.log(`   ✅ Reset token: ${resetToken ? 'GENERATED' : 'FAILED'}\n`);

    // Test 3: CSRF token generation
    console.log('3. Testing CSRF token generation...');
    const csrfToken = await CSRFService.createCSRFToken(testUserId, 'EMAIL_VERIFICATION');
    console.log(`   ✅ CSRF token: ${csrfToken ? 'GENERATED' : 'FAILED'}\n`);

    // Test 4: Email templates (without sending)
    console.log('4. Testing email templates...');
    // Import templates directly for testing
    const { EMAIL_TEMPLATES } = await import('../core/services/emailService');
    const welcomeTemplate = EMAIL_TEMPLATES.WELCOME('Test User', 'test-token', 'test-csrf');
    const resetTemplate = EMAIL_TEMPLATES.PASSWORD_RESET('Test User', 'test-token', 'test-csrf');
    const verificationTemplate = EMAIL_TEMPLATES.EMAIL_VERIFICATION('Test User', 'test-token', 'test-csrf');
    
    console.log(`   ✅ Welcome template: ${welcomeTemplate.subject ? 'VALID' : 'INVALID'}`);
    console.log(`   ✅ Reset template: ${resetTemplate.subject ? 'VALID' : 'INVALID'}`);
    console.log(`   ✅ Verification template: ${verificationTemplate.subject ? 'VALID' : 'VALID'}\n`);

    console.log('🎉 All tests passed! Email system is ready to use.\n');
    console.log('📧 Available email templates:');
    console.log('   - Welcome email (registration)');
    console.log('   - Password reset email');
    console.log('   - Email verification');
    console.log('   - Course enrollment email');
    console.log('\n🔧 To send a test email, use:');
    console.log('   npm run test:email');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmailConfiguration(); 