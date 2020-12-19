import Header from "../Header";

const Layout = ({ children }) => (
  <div className="bg-gray-700">
    <Header />
    {children}
  </div>
);

export default Layout;
