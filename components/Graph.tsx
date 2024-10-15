"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

const HighlightGraph = () => {
  const visJsRef = useRef<HTMLDivElement | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState<boolean>(false); // Track zoom state

  useEffect(() => {
    if (!visJsRef.current) return;

    // Accent colors for nodes
    const accentColors = [
      "#3498db", // blue
      "#1abc9c", // teal
      "#9b59b6", // purple
      "#FFD700", // yellow
      "#f39c12", // orange
      "#2ecc71", // green
    ];

    // A distinct highlight color for hover interactions
    const highlightColor = "#e74c3c"; // Gold highlight color for hover

    // Create 32 nodes with random accent colors
    const nodes = new DataSet(
      Array.from({ length: 32 }, (_, i) => ({
        id: i + 1,
        label: `Node ${i + 1}`,
        color: {
          background: accentColors[i % accentColors.length], // Accent colors
          highlight: {
            background: highlightColor, // Highlight color on hover
            border: "#FEFEFE", // White border on hover
          },
          border: "#111", // Primary color for node borders
        },
        font: { color: "#23f" }, // Keep text white for visibility
        physics: true, // Enable physics for initial animation
      }))
    );

    // Create 56 edges
    const edges = new DataSet<{ id?: number; from: number; to: number }>(
      Array.from({ length: 56 }, (_, i) => ({
        id: i + 1,
        from: Math.floor(Math.random() * 32) + 1, // Random node connection
        to: Math.floor(Math.random() * 32) + 1, // Random node connection
        color: {
          color: "#bdc3c7", // Neutral gray for default edges
          highlight: highlightColor, // Highlight the edge with the same color on hover
        },
      }))
    );

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: "dot",
        size: 30,
      },
      edges: {
        width: 2, // Adjust edge width
        color: {
          color: "#bdc3c7", // Neutral edge color
          highlight: highlightColor, // Highlight on hover
        },
        smooth: true, // Smooth edges
      },
      physics: {
        enabled: true,
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
        },
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: {
          iterations: 150,
          updateInterval: 25,
        },
      },
      interaction: {
        hover: true, // Enable hover interaction
      },
    };

    const newNetwork = new Network(visJsRef.current, data, options);
    setNetwork(newNetwork); // Store the network instance for later use

    return () => {
      newNetwork.destroy(); // Clean up when the component is unmounted
    };
  }, []);

  const handleZoomToggle = () => {
    if (network) {
      if (isZoomedOut) {
        // Zoom in to original scale
        network.moveTo({
          scale: 1, // Zoom in to 100%
          animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad",
          },
        });
      } else {
        // Zoom out to 50%
        network.moveTo({
          scale: 0.5, // Zoom out to 50%
          animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad",
          },
        });
      }
      // Toggle the zoom state
      setIsZoomedOut(!isZoomedOut);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center   ">
      <div ref={visJsRef} style={{ height: "800px", width: "100%" }} />
      <button className="w-14" onClick={handleZoomToggle}>
        <Image
          src="icons/zoomInAndOut.svg"
          height="50"
          width="150"
          className="w-14 h-14 md:w-auto"
          alt="zoom in and out"
        />
      </button>
    </div>
  );
};

export default HighlightGraph;

// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { DataSet, Network } from "vis-network/standalone";

// const HighlightGraph = () => {
//   const visJsRef = useRef<HTMLDivElement | null>(null);
//   const [network, setNetwork] = useState<Network | null>(null);

//   useEffect(() => {
//     if (!visJsRef.current) return;

//     // Accent colors for nodes
//     const accentColors = [
//       "#3498db", // blue
//       "#1abc9c", // teal
//       "#9b59b6", // purple
//       "#e74c3c", // red
//       "#f39c12", // orange
//       "#2ecc71", // green
//     ];

//     // A distinct highlight color for hover interactions
//     const highlightColor = "#FFD700"; // Gold highlight color for hover

//     // Create 32 nodes with random accent colors
//     const nodes = new DataSet(
//       Array.from({ length: 32 }, (_, i) => ({
//         id: i + 1,
//         label: `Node ${i + 1}`,
//         color: {
//           background: accentColors[i % accentColors.length], // Accent colors
//           highlight: {
//             background: highlightColor, // Highlight color on hover
//             border: "#FEFEFE", // White border on hover
//           },
//           border: "#111", // Primary color for node borders
//         },
//         font: { color: "#FEFEFE" }, // Keep text white for visibility
//         physics: true, // Enable physics for initial animation
//       }))
//     );

//     // Create 56 edges
//     const edges = new DataSet<{ id?: number; from: number; to: number }>(
//       Array.from({ length: 56 }, (_, i) => ({
//         id: i + 1,
//         from: Math.floor(Math.random() * 32) + 1, // Random node connection
//         to: Math.floor(Math.random() * 32) + 1, // Random node connection
//         color: {
//           color: "#bdc3c7", // Neutral gray for default edges
//           highlight: highlightColor, // Highlight the edge with the same color on hover
//         },
//       }))
//     );

//     const data = { nodes, edges };
//     const options = {
//       nodes: {
//         shape: "dot",
//         size: 30,
//       },
//       edges: {
//         width: 2, // Adjust edge width
//         color: {
//           color: "#bdc3c7", // Neutral edge color
//           highlight: highlightColor, // Highlight on hover
//         },
//         smooth: true, // Smooth edges
//       },
//       physics: {
//         enabled: true,
//         forceAtlas2Based: {
//           gravitationalConstant: -50,
//           centralGravity: 0.01,
//           springLength: 100,
//         },
//         solver: "forceAtlas2Based",
//         timestep: 0.35,
//         stabilization: {
//           iterations: 150,
//           updateInterval: 25,
//         },
//       },
//       interaction: {
//         hover: true, // Enable hover interaction
//       },
//     };

//     const newNetwork = new Network(visJsRef.current, data, options);
//     setNetwork(newNetwork); // Store the network instance for later use

//     return () => {
//       newNetwork.destroy(); // Clean up when the component is unmounted
//     };
//   }, []);

//   const handleZoomOut = () => {
//     if (network) {
//       // Set the camera view to a zoomed-out position
//       network.moveTo({
//         scale: 0.5, // Zoom out to 50%
//         animation: {
//           duration: 1000,
//           easingFunction: "easeOutQuad", // Make sure this easing function is valid
//         },
//       });
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleZoomOut}>
//         <Image
//           src="/images/icons/zoomInAndOut.svg"
//           height="100"
//           width="100"
//           className="w-16 md:w-auto"
//           alt="zoom in and out"
//         />{" "}
//       </button>
//       <div ref={visJsRef} style={{ height: "800px", width: "100%" }} />
//     </div>
//   );
// };

// export default HighlightGraph;
