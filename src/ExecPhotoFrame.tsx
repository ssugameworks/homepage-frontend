interface ExecPhotoFrameProps {
  src: string;
  alt?: string;
}

export function ExecPhotoFrame({ src, alt = "" }: ExecPhotoFrameProps) {
  return (
    <div className="relative size-full">
      <div className="absolute inset-0 overflow-hidden">
        <img
          alt={alt}
          className="absolute h-[102.78%] max-w-none top-[-2.86%] left-[-12.76%] w-[124.99%]"
          src={src}
        />
      </div>
    </div>
  );
}
