import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Track your savings goals with clarity
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              See exactly how much more you need to save for the things you
              want. Stay motivated and focused on your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/item/upload">Add Your Goal</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/items">View Your Goals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-[1100px] mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Your Goal</h3>
              <p className="text-gray-600">
                Upload an item you want to purchase and enter its price. Add how
                much you&apos;ve already saved.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Track Your Progress
              </h3>
              <p className="text-gray-600">
                See a visual progress bar showing how close you are to your goal
                and exactly how much more you need.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-6">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Stay Motivated</h3>
              <p className="text-gray-600">
                Update your savings regularly and watch as you get closer to
                achieving your financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              See How It Works
            </h2>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Example Goal: New Laptop
                </h3>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Total Price: ₹2,78,000</span>
                  <span>Current Savings: ₹1,20,000</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-black h-4 rounded-full"
                    style={{ width: "43%" }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span>43% Complete</span>
                  <span className="font-medium">₹1,58,000 more needed</span>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="sm" asChild>
                  <Link href="/item/upload">Create Your Own Goal</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to achieve your financial goals?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start tracking your progress today and stay motivated on your
              savings journey.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Sign up for free</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
