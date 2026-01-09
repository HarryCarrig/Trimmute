type AvatarProps = {
  image?: string;
  name: string;
};

export default function Avatar({ image, name }: AvatarProps) {
  return (
    <div className="w-[90px] h-[90px] rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-slate-700 text-center px-2">
          {name}
        </span>
      )}
    </div>
  );
}
