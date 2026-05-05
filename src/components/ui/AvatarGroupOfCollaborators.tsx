import Image from "next/image";

export interface AvatarProps {
  src: string;
  name: string;
  size?: number | string;
}

export function Avatar({ src, name, size = 32 }: AvatarProps) {
  return (
    <div
      className="relative rounded-full bg-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        fill
        className="rounded-full"
        sizes={typeof size === "number" ? `${size}px` : size}
      />
    </div>
  );
}

export interface AvatarGroupProps {
  collaborators: { src: string; name: string }[];
  maxVisible?: number;
  size?: number | string;
}

export function AvatarGroupOfCollaborators({
  collaborators,
  maxVisible = 5,
  size = 32,
}: AvatarGroupProps) {
  return (
    <div className="flex -space-x-2">
      {collaborators.slice(0, maxVisible).map((collaborator) => (
        <Avatar key={collaborator.name} src={collaborator.src} name={collaborator.name} size={size} />
      ))}
      {collaborators.length > maxVisible && (
        <div
          className="flex items-center justify-center rounded-full border bg-gray-100 text-gray-600"
          style={{ width: size, height: size }}
        >
          +{collaborators.length - maxVisible}
        </div>
      )}
    </div>
  );
}

export function CardOfCollaborators({ collaborator }: { collaborator: { src: string; name: string } }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <Avatar src={collaborator.src} name={collaborator.name} />
      <h3 className="font-medium text-sm mt-2" style={{ color: "var(--text-primary)" }}>
        {collaborator.name}
      </h3>
    </div>
  );
}
