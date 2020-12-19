import React from "react";

const Header = () => {
  return (
    <header className="p-4 pb-0 border-b border-gray-600 md:flex md:items-center md:justify-between md:pb-4">
      <nav>
        <ul className="md:flex md:items-center">
          <li className="md:ml-4">
            <a
              className="block py-2 hover:text-gray-900 md:p-0"
              href="/feed"
            >
              Feed
            </a>
          </li>
          <li className="md:ml-4">
            <a
              className="block py-2 hover:text-gray-900 md:p-0"
              href="/map"
            >
              Map View
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
