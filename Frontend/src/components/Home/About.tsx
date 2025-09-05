import { Award, Shield, CheckCircle, Users, Star, Globe } from "lucide-react";

interface StatProps {
  number: string;
  label: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}

interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-sky-50 to-blue-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              About <span className="text-sky-600">WanderLux</span>
            </h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              For over 15 years, WanderLux has been crafting extraordinary
              travel experiences that go beyond the ordinary. We believe that
              travel is not just about visiting places—it's about creating
              memories that last a lifetime.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team of travel experts, local guides, and cultural ambassadors
              work tirelessly to curate authentic experiences that showcase the
              true essence of each destination. From hidden gems to iconic
              landmarks, we ensure every journey is safe, memorable, and
              transformative.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Stat number="15+" label="Years Experience" />
              <Stat number="150+" label="Destinations" />
              <Stat number="50K+" label="Happy Travelers" />
              <Stat number="98%" label="Satisfaction Rate" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4">
              <Badge icon={<Award className="h-5 w-5 text-yellow-500" />} text="Award Winning" />
              <Badge icon={<Shield className="h-5 w-5 text-green-500" />} text="IATA Certified" />
              <Badge icon={<CheckCircle className="h-5 w-5 text-blue-500" />} text="SSL Secured" />
            </div>
          </div>

          {/* Right Content (Features Grid) */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <Feature
                  icon={<Users className="h-8 w-8 text-sky-600 mx-auto" />}
                  bg="bg-sky-100"
                  title="Expert Team"
                  desc="Professional travel consultants"
                />
                <Feature
                  icon={<Shield className="h-8 w-8 text-green-600 mx-auto" />}
                  bg="bg-green-100"
                  title="Safe Travel"
                  desc="24/7 support & assistance"
                />
                <Feature
                  icon={<Star className="h-8 w-8 text-yellow-600 mx-auto" />}
                  bg="bg-yellow-100"
                  title="Best Value"
                  desc="Competitive pricing guaranteed"
                />
                <Feature
                  icon={<Globe className="h-8 w-8 text-purple-600 mx-auto" />}
                  bg="bg-purple-100"
                  title="Global Reach"
                  desc="Worldwide destinations"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Small Sub-Components --- */
function Stat({ number, label }:StatProps) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-sky-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function Badge({ icon, text }:BadgeProps) {
  return (
    <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
      {icon}
      <span className="ml-2 text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
}

function Feature({ icon, bg, title, desc }:FeatureProps) {
  return (
    <div className="text-center">
      <div className={`${bg} p-4 rounded-xl mb-4`}>{icon}</div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  );
}
