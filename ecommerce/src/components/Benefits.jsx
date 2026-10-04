import { Truck, ShieldCheck, Check } from "lucide-react";

function Benefits() {
  const benefits = [
    {
      icon: Truck,
      title: "Fast delivery",
      description: "Across all 47 counties",
    },
    {
      icon: ShieldCheck,
      title: "Shop securely",
      description: "Safe M-Pesa checkout",
    },
    {
      icon: Check,
      title: "Easy returns",
      description: "Within 7 days",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

        <div className="border border-[#e5e5e5] rounded-2xl">

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e5e5]">

            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className={`
                    flex items-center justify-center gap-4
                    px-6 py-5 sm:py-6
                    ${
                      index !== benefits.length - 1
                        ? "border-b sm:border-b-0 sm:border-r border-[#e5e5e5]"
                        : ""
                    }
                  `}
                >
                  {/* ICON */}

                  <div className="shrink-0 text-[#c59d18]">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  {/* TEXT */}

                  <div>
                    <h3 className="text-sm font-semibold text-[#171717]">
                      {benefit.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {benefit.description}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Benefits;