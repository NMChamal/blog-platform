interface CenteredImageProps {
  src: string;
  alt: string;
}

const CenteredImage = ({ src, alt }: CenteredImageProps) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const fullSrc = src.startsWith('http') ? src : `${baseUrl}${src}`;

  return (
    <div className="flex justify-center">
      <img src={fullSrc} alt={alt} />
    </div>
  );
};

export default CenteredImage;
