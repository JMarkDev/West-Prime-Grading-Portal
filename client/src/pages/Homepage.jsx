import landingImg from "../assets/images/westprime1.png";
import logo from "../assets/images/west_prime_logo-removebg-preview.png";

const Homepage = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      {/* Dark Overlay for Readability */}
      <div className="absolute w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* Background Image */}
      <img
        src={landingImg}
        alt="Landing Background"
        className="absolute w-full h-full object-cover z-0"
      />

      {/* Login Form */}
      <div className="absolute bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-xl p-8 w-11/12 max-w-md z-20">
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="WestPrime Logo"
            className="w-24 h-auto drop-shadow-lg"
          />
        </div>

        <h3 className="text-3xl text-center text-white mb-6 font-semibold drop-shadow-lg">
          Login to Your Account
        </h3>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-lg mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-lg mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* <div className="mt-4 text-center text-white text-sm">
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-green-300 hover:underline">
              Sign up
            </a>
          </p>
          <p>
            <a href="#" className="text-green-300 hover:underline">
              Forgot Password?
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
