import Link from "next/link";

export default function ReturnHomeButtonComponent() {
  return (
    <Link href="/" passHref>
      <button className="absolute top-4 left-4 bg-[#222831] text-white px-4 py-2 rounded-md hover:bg-[#1b2027] transition-all duration-300 shadow-md">
        {'<- Return Home'}
      </button>
    </Link>
  );
}
