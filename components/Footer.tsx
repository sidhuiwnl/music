import Link from "next/link";

export default function Footer() {
    return (
      <footer className="w-full mt-10">
        <hr className=" w-full border-t border-gray-300 mb-4" />
        <div className="w-full p-4 flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">© 2023 MusicStreamChoice. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-600 text-sm hover:text-gray-800 transition">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 text-sm hover:text-gray-800 transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    );
  }
  