// app/legal/refund-policy/page.tsx
export default function RefundPolicy() {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Refund Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">30-Day Money-Back Guarantee</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We offer a 30-day money-back guarantee for all course purchases. If you're not 
            satisfied with your course, you can request a full refund within 30 days of purchase.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              ✅ Eligible for Refund:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
              <li>Within 30 days of purchase</li>
              <li>Course content doesn't meet your expectations</li>
              <li>Technical issues preventing access</li>
              <li>Duplicate or accidental purchases</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Non-Refundable Situations</h2>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
              ❌ Not Eligible for Refund:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-400">
              <li>After 30 days from purchase</li>
              <li>If you've completed more than 50% of the course</li>
              <li>Downloaded course materials or resources</li>
              <li>Subscription payments for past periods</li>
              <li>Bundled courses if one course is completed</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li>
              <strong>Contact Support:</strong> Email refunds@coursewave.com with your:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Full name and email address</li>
                <li>Course name and purchase date</li>
                <li>Reason for refund request</li>
              </ul>
            </li>
            <li>
              <strong>Review Process:</strong> We'll review your request within 2-3 business days
            </li>
            <li>
              <strong>Refund Processing:</strong> Approved refunds are processed within 5-10 business days
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Subscription Cancellations</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            For subscription-based courses, you can cancel anytime:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Cancellation stops future charges</li>
            <li>No refunds for current billing period</li>
            <li>Access continues until the end of billing cycle</li>
            <li>Cancel through your account settings or contact support</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Free Courses and Trials</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Free courses and free trial periods are not eligible for refunds since no payment was made.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-600 dark:text-gray-300">
            For refund requests or questions about our policy:
            <br />
            <strong>Email:</strong> refunds@coursewave.com
            <br />
            <strong>Response Time:</strong> 2-3 business days
            <br />
            <strong>Processing Time:</strong> 5-10 business days after approval
          </p>
        </section>
      </div>
    </div>
  );
}