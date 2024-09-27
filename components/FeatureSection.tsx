import { Users, Podcast, Headphones } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      svg: <Users />,
      title: "Fan interaction",
      description: "Let fans choose the music.",
    },
    {
      svg: <Podcast />,
      title: "Live Streaming",
      description: "Stream with real-time input.",
    },
    {
      svg: <Headphones />,
      title: "High-Quality Audio",
      description: "Crystal clear sound quality.",
    },
    
  ];

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h1 className="text-3xl font-bold">Key Features</h1>
      <div className="flex justify-between mt-10 w-full max-w-4xl">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center mx-4 space-y-3">
            <div className="text-4xl mb-2">{feature.svg}</div>
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
