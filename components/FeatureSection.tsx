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
      <h1 className="font-extrabold text-4xl mb-3 tracking-tighter subpixel-antialiased text-white">Key Features</h1>
      <div className="flex justify-between mt-10 w-full max-w-5xl">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center mx-4 space-y-3">
            <div className="text-5xl mb-2">{feature.svg}</div>
            <h2 className="font-extrabold text-4xl mb-3 tracking-tighter subpixel-antialiased text-white">{feature.title}</h2>
            <p className="subpixel-antialiased font-bold text-lg max-w-xl text-center tracking-tighter">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
