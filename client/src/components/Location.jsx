import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const LocationInput = ({
  location,
  onLocationChange,
  customerAddressError,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [barangay, setBarangay] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [purok, setPurok] = useState("");

  // useEffect(() => {
  //   onLocationChange(selectedLocation + ", " + purok);
  // }, []);

  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
    } else {
      setSelectedLocation("");
    }
  }, [location]);

  const toggleDropdown = async () => {
    setIsDropdownOpen((prev) => !prev);
    setSelectedLocation("");
    try {
      const response = await fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/097322000/barangays.json`
      );
      const data = await response.json();
      const sort = data.sort((a, b) => a.name.localeCompare(b.name));
      setBarangay(sort);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getCity = async () => {
      try {
        const response = await fetch(
          `https://psgc.gitlab.io/api/cities-municipalities/097322000/barangays.json`
        );
        const data = await response.json();
        const sort = data.sort((a, b) => a.name.localeCompare(b.name));
        setBarangay(sort);
      } catch (error) {
        console.error(error);
      }
    };
    getCity();
  }, []);

  const handleBarangay = async (location, event) => {
    event.preventDefault();
    setIsDropdownOpen(false);

    // Set the selected location with the barangay name
    setSelectedLocation(`Pagadian City, ${location.name}`);
    setBarangay([]);
  };

  const handlePurok = (event) => {
    const purokValue = event.target.value.trim(); // Get the new purok value
    setPurok(purokValue);

    // Construct the new location string, ensuring purok is at the end
    const locationParts = selectedLocation
      .split(",")
      .map((part) => part.trim());
    const baseLocation = locationParts.slice(0, 2).join(", "); // Keep city and barangay
    const newLocation = `${baseLocation}, ${purokValue}`;

    onLocationChange(newLocation);
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          required
          placeholder="Barangay, Purok"
          className={`w-full  ${
            customerAddressError ? "border-red-500" : "border-gray-300"
          } px-3 text-sm py-2.5 border rounded-lg  cursor-pointer focus:outline-none focus:ring-0 focus:border-blue-600 peer text-left inline-flex items-center`}
          onClick={toggleDropdown}
          readOnly
          value={selectedLocation}
        />
        <svg
          className="w-2.5 h-2.5 absolute right-3 top-1/2 transform -translate-y-1/2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>

      <div
        id="dropdown"
        className={`z-10 customerAddressError ${
          isDropdownOpen ? "block" : "hidden"
        }  w-full absolute left-0 border-gray-300 z-50 border rounded-lg bg-white divide-y divide-gray-100  shadow dark:bg-gray-700`}
      >
        <ul
          className="py-2 text-sm overflow-y-auto h-[200px] text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {barangay.map((location, index) => (
            <li key={index}>
              <a
                href="#"
                className="w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={(event) => handleBarangay(location, event)}
              >
                {location.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {selectedLocation && (
        <input
          type="text"
          placeholder="Purok, Street Name, Building"
          className={`w-full ${
            customerAddressError ? "border-red-500" : "border-gray-300"
          } mt-2 px-3 text-sm py-2 border rounded-lg cursor-pointer focus:outline-none focus:ring-0 focus:border-blue-600 peer text-left inline-flex items-center`}
          value={purok}
          onChange={(e) => handlePurok(e)}
        />
      )}
    </div>
  );
};

LocationInput.propTypes = {
  location: PropTypes.string,
  onLocationChange: PropTypes.func,
  customerAddressError: PropTypes.string,
};

export default LocationInput;
