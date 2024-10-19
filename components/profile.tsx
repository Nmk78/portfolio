"use client";

import React, { useState } from "react";

const ProfileCard = () => {
  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState("");

  const handleCvChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      setCvPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <img
          src="/path/to/profile-image.jpg" // Replace with your profile image path
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
        />
      </div>
      
      {/* Profile Information */}
      <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
        <h2 className="text-xl font-semibold">Your Name</h2>
        <p className="text-gray-600 mt-2">Bio: A passionate computerphile student.</p>
        <p className="text-gray-600 mt-1">Description: I love exploring technology, coding, and learning new things.</p>

        {/* Projects Section */}
        <h3 className="mt-4 font-semibold">Projects:</h3>
        <ul className="list-disc list-inside">
          <li>Project 1</li>
          <li>Project 2</li>
          <li>Project 3</li>
        </ul>

        {/* CV Upload Section */}
        <div className="mt-4">
          <label htmlFor="cv-upload" className="block text-sm font-medium text-gray-700">Upload CV:</label>
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleCvChange}
            className="mt-1 border border-gray-300 rounded-md p-2"
          />
          {cvPreview && (
            <iframe
              src={cvPreview}
              className="mt-2 w-full h-48 border rounded-md"
              title="CV Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
