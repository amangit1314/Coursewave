import SubscriptionPageClient from "./_components/subscription-page-client";

export default function Subscription() {
  return (
    <div className="mt-16 md:mt-0">
      <section className="bg-white py-8 dark:bg-zinc-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 md:py-0 lg:px-6">
          {/* <div className="mx-auto mb-8 max-w-screen-md space-y-6 text-center lg:mb-12">
            <p className="text-[42px] font-bold tracking-tight text-gray-900 dark:text-white">
              Choose a plan for <span className="text-blue-600">yourself!</span>{" "}
            </p>

            <p className="text-base font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              Here at Coursewave we are building a platform where technology,
              innovation, and capital can unlock long-term value and drive
              economic growth.
            </p>
          </div> */}

          <SubscriptionPageClient />
        </div>
      </section>
    </div>
  );
}
