type ContentBlockProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  imageUrl: string;
  imagePosition: "left" | "right";
};

export default function ContentBlock({ title, subtitle, children, imageUrl, imagePosition }: ContentBlockProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
      <div
        className={`bg-cover bg-center min-h-[500px] ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      <div
        className={`flex items-center justify-center px-8 lg:px-32 py-32 bg-bg-lighter ${
          isImageLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="max-w-md space-y-5">
          <div className="w-24 h-1 bg-brand-orange mb-4"></div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-left text-text-light">{title}</h2>
          {subtitle && <h3 className="text-xl md:text-2xl font-bold mb-8 text-left text-text-light">{subtitle}</h3>}
          <div className="text-base leading-relaxed text-text-light">{children}</div>
        </div>
      </div>
    </div>
  );
}
