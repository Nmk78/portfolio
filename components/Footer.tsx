import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-red-800 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-center md:text-left">
          <Link href="naymyokhant.me" className="text-lg font-bold">
            Nay Myo Khant
          </Link>{" "}
          {/* <p className="mt-1" id="description"></p> */}
        </div>
        <div className="mt-4 md:mt-0">
          <ul className="flex space-x-4">
            {/* <li>
              <Link
                href="https://www.linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                LinkedIn
              </Link>
            </li> */}
            <li>
              <Link
                href="https://github.com/nmk78"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400"
              >
                GitHub
              </Link>
            </li>
            <li>
              <a
                href="mailto:naymyokhant78@gmail.com"
                className="hover:text-gray-400"
              >
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-4 border-t border-red-700 pt-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/">Nay Myo Khant</Link>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
