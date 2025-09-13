function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Copyright */}
        <p className="text-sm md:text-base mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Electronics Shop. All rights reserved.
        </p>

        {/* Social / Links */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-yellow-400 transition-colors">Facebook</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Twitter</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
