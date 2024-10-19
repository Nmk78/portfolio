// import { SiReact } from "@icons-pack/react-simple-icons";

export default function DynamicIcons({ icon }: any) {
  {
    /* <img height="32" width="32" src="https://cdn.simpleicons.org/dotenv" /> */
  }
  return (
    <img
      height="32"
      width="32"
      src={`https://cdn.simpleicons.org/${icon}`}
    />
  );
}
