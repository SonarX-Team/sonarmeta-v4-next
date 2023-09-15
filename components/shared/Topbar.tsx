import Image from "next/image";
import Link from "next/link";

export default function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/logo-full-light.png"
          alt="logo"
          width={180}
          height={10}
          style={{
            width: "180px",
            height: "auto",
          }}
          priority
        />
      </Link>
    </nav>
  );
}
