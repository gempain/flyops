import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FeatureBlockProps = {
  iconUrl: string;
  title: string;
  description: string;
  iconPosition?: "left" | "right";
};

export default function FeatureBlock({ iconUrl, title, description, iconPosition = "left" }: FeatureBlockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className={`flex justify-center ${iconPosition === "right" ? "md:order-2" : ""}`}>
        <Avatar className="w-40 h-40 shadow-lg">
          <AvatarImage src={iconUrl} alt={title} />
          <AvatarFallback className="bg-white text-gray-400">{title.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className={iconPosition === "right" ? "md:order-1" : ""}>
        <div className="w-24 h-1 bg-brand-orange mx-auto md:mx-0 mb-8"></div>
        <h3 className="text-2xl md:text-3xl font-bold text-text-dark mb-4 text-center md:text-left">{title}</h3>
        <div
          className="text-base text-text-medium leading-relaxed text-center md:text-left"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
}
