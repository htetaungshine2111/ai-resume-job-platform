function Footer() {
  return (
    <footer
      className="
        bg-gray-900
        text-gray-300
        py-10 px-6
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col md:flex-row
          justify-between items-center
          gap-6
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Job Match</h2>

          <p className="text-gray-400">
            AI-powered career platform for resumes, job matching, and interview
            preparation.
          </p>
        </div>

        <div className="flex gap-6">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>

          <a href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </a>

          <a href="/register" className="hover:text-white transition-colors">
            Get Started
          </a>
        </div>
      </div>

      <div
        className="
          mt-8 pt-6
          border-t border-gray-800
          text-center text-gray-500
        "
      >
        © 2026 AI Job Match. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
