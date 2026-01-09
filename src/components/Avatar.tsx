type AvatarProps = {
  image?: string;
  name: string;
  size?: number; // optional
};

export default function Avatar({ image, name, size = 90 }: AvatarProps) {
const initials = name
  .toUpperCase()
  .replace(/[^A-Z\s]/g, " ")   // turn symbols (&, -, etc) into spaces
  .trim()
  .split(/\s+/)                 // split on one-or-more spaces
  .slice(0, 2)
  .map((w) => w[0])
  .join("") || "TM";


  return (
    <div
      className="rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-br from-teal-500/30 to-slate-900/40"
      style={{ width: size, height: size }}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-semibold text-white/90 text-center px-2">
          {initials || name}
        </span>
      )}
    </div>
  );
}
