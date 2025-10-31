// app/legal/terms-conditions/page.tsx
export default function TermsConditions() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms and Conditions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Account Registration</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>You must be at least 13 years old to create an account</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>You are responsible for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Course Enrollment and Access</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Course access is granted upon successful payment</li>
            <li>Access is personal and non-transferable</li>
            <li>Lifetime access means for the lifetime of the course on our platform</li>
            <li>We reserve the right to update or remove courses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>All prices are in USD unless specified otherwise</li>
            <li>Payment is required before course access is granted</li>
            <li>We use secure third-party payment processors</li>
            <li>You authorize us to charge the provided payment method</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Course content is licensed, not sold</li>
            <li>You may not redistribute or share course materials</li>
            <li>Instructors retain copyright to their content</li>
            <li>Platform code and design are our intellectual property</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Prohibited activities include:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Sharing account access with others</li>
            <li>Downloading and distributing course content</li>
            <li>Harassing other students or instructors</li>
            <li>Attempting to hack or disrupt the platform</li>
            <li>Posting inappropriate content in discussions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may suspend or terminate your account for violations of these terms. 
            Upon termination, you lose access to all courses and content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We are not liable for any indirect, incidental, or consequential damages. 
            Our total liability is limited to the amount you paid for courses in the past 6 months.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-gray-600 dark:text-gray-300">
            These terms are governed by the laws of [Your Country/State]. 
            Any disputes shall be resolved in the courts of [Your Jurisdiction].
          </p>
        </section>
      </div>
    </div>
  );
}