export default function DynamicIcons({ icon }: { icon: string }) {
  icon = icon.toLowerCase()
  return (
    ///Error with <Image/> component, so using <img/> instead
    //eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${icon}`}
      width={40}
      height={40}
      alt={icon}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`; // fallback
      }}
      className="w-10 h-10"
    />
  );
}


