// app/legal/privacy-policy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Name and contact details</li>
                <li>Email address and profile information</li>
                <li>Payment and billing information</li>
                <li>Course progress and learning data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and course interactions</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Provide and maintain our learning platform</li>
            <li>Process your course enrollments and payments</li>
            <li>Personalize your learning experience</li>
            <li>Send important updates and notifications</li>
            <li>Improve our services and develop new features</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We do not sell your personal information. We may share your data with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Instructors for the courses you enroll in</li>
            <li>Payment processors to handle transactions</li>
            <li>Service providers who assist our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We implement industry-standard security measures to protect your data, 
            including encryption, secure servers, and regular security assessments.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your learning progress data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-600 dark:text-gray-300">
            For any privacy-related questions or concerns, please contact us at:
            <br />
            <strong>Email:</strong> privacy@coursewave.com
            <br />
            <strong>Address:</strong> [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  );
}