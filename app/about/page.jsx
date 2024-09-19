import React from "react";

const About = () => {
  return (
    <div className="flex flex-col max-h-screen items-center w-full p-6 rounded-lg justify-center place-items-center h-screen">
      <div className="w-4/5 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Welcome to the About Page
        </h1>{" "}
        <hr className="p-1 m-1 bg-black rounded-sm" />
        <div className="text-lg font-sans leading-relaxed text-gray-700">
          <h2 className="text-2xl font-semibold mb-4">
            My Name is Abdo Adel Soliman
          </h2>
          <div className="flex items-center justify-between">
            <img
              className="m-2"
              width={900}
              src="https://codequotient.com/blog/wp-content/uploads/2021/01/What-does-it-take-to-be-a-Full-Stack-Developer.jpg"
            />
            <p className="mb-4 px-4 text-3xl">
              I created this site to showcase movies and provide ratings using
              the following technologies:
            </p>
          </div>{" "}
          <hr className="p-1 m-1 bg-black rounded-sm" />
          <ul className="list-none list-inside pl-4 text-red-800 font-bold flex items-center justify-around text-2xl font-mono">
            <li>Next.js</li>
            <li>NextAuth</li>
            <li>TypeScript</li>
            <li>MongoDB</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
