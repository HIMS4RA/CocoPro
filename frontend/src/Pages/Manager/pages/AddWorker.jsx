import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/UI/Card';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import axios from 'axios';

const AddWorker = () => {

  const [worker, setWorker] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    joinDate: "",
    address: "",
    notes: "",
    role: "Worker",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
      setWorker({ ...worker, [e.target.name]: e.target.value });
  };

  console.log(worker);
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post("http://localhost:8080/api/workers", worker);
          setMessage("Worker added successfully! Login details have been emailed.");
          setWorker({ firstName: "", lastName: "", email: "", phoneNumber: "", joinDate: "", address: "", notes: "", role: "Worker" });
      } catch (error) {
         setMessage("Error adding worker.");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link
          to="/workers"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Workers
        </Link>
      </div>

      {message && <p className="text-green-600">{message}</p>}
      <Card title="Add New Worker">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="First Name"
                value={worker.firstName} onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Last Name"
                value={worker.lastName} onChange={handleChange}
              />
            </div>
            {/* <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                id="position"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Position</option>
                <option value="Processing Operator">Processing Operator</option>
                <option value="Drying Specialist">Drying Specialist</option>
                <option value="Maintenance Technician">Maintenance Technician</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Packaging Lead">Packaging Lead</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Department</option>
                <option value="Processing">Processing</option>
                <option value="Drying">Drying</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Quality">Quality</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div> */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="email@example.com"
                value={worker.email} onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="(123) 456-7890"
                value={worker.phoneNumber} onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                Join Date
              </label>
              <input
                type="date"
                id="joinDate"
                name="joinDate"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={worker.joinDate} onChange={handleChange}
              />
            </div>
            {/* <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div> */}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Worker's address"
              value={worker.address} onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Any additional information about the worker"
              value={worker.notes} onChange={handleChange}
            ></textarea>
          </div>
          <input type="role" name="role" value="Worker" className="w-full p-2 border rounded" hidden />
          <div className="flex justify-end space-x-3">
            <Link
              to="/workers"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center"
            >
              <SaveIcon size={16} className="mr-2" />
              Save Worker
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddWorker;
