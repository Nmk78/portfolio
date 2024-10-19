"use client";

import Image from "next/image";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Suspense,
} from "react";
import { DataSet, Network } from "vis-network/standalone";
import Loading from "./Loading";
import { Button } from "./ui/button";

const Graph = () => {
  const visJsRef = useRef<HTMLDivElement | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isZoomedOut, setIsZoomedOut] = useState<boolean>(false); // Track zoom state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null);
  interface Node {
    id: number;
    label: string;
    color?: {
      background?: string;
      highlight?: {
        background?: string;
        border?: string;
      };
      border?: string;
    };
    font?: { color?: string };
    physics?: boolean;
  }

  interface Edge {
    id: number;
    from: number;
    to: number;
    color?: {
      color?: string;
      highlight?: string;
    };
  }

  const fetchGraphData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch("/api/graph");
      if (!response.ok) {
        throw new Error("Failed to fetch graph data");
      }

      const result = await response.json();
      // Transform the nodes to include color and physics properties
      const accentColors = [
        "#3498db", // blue
        "#1abc9c", // teal
        "#9b59b6", // purple
        "#FFD700", // yellow
        "#f39c12", // orange
        "#2ecc71", // green
      ];

      const transformedNodes = result.data.nodes.map(
        (node: any, index: number) => ({
          ...node, // Spread the existing properties
          color: {
            background: accentColors[index % accentColors.length], // Use defined accent colors
            highlight: {
              background: "#e74c3c", // Highlight color
              border: "#FEFEFE", // White border on hover
            },
            border: "#111", // Primary color for node borders
          },
          font: { color: "#23f" }, // Keep text white for visibility
          physics: true, // Enable physics for initial animation
        })
      );

      // Transform the edges to include color properties
      const transformedEdges = result.data.edges.map((edge: any) => ({
        ...edge, // Spread the existing properties
        color: {
          color: "#bdc3c7", // Neutral gray for default edges
          highlight: "#e74c3c", // Highlight color on hover
        },
      }));

      const nodes = new DataSet<Node>(transformedNodes);
      const edges = new DataSet<Edge>(transformedEdges);

      const data = { nodes, edges };
      const options = {
        nodes: {
          shape: "dot",
          size: 30,
        },
        edges: {
          width: 2,
          smooth: true,
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
          hover: true,
        },
      };

      if (visJsRef.current) {
        const newNetwork = new Network(visJsRef.current, data, options);
        setNetwork(newNetwork);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
      setError("Failed to load graph data. Please try again."); // Set error message
    } finally {
      setLoading(false); // Loading is done
    }
  }, []);

  useEffect(() => {
    fetchGraphData(); // Fetch data on mount

    return () => {
      if (network) {
        network.destroy(); // Clean up when the component is unmounted
      }
    };
  }, [fetchGraphData]);

  // Debounce the zoom toggle function
  const handleZoomToggle = useCallback(() => {
    if (!network) return;

    const scale = isZoomedOut ? 1 : 0.5; // Determine scale based on current state
    network?.moveTo({
      scale,
      animation: {
        duration: 1000,
        easingFunction: "easeInOutQuad",
      },
    });

    setIsZoomedOut(!isZoomedOut); // Toggle the zoom state
  }, [network, isZoomedOut]);

  return (
    <div className="bg-gray-200 min-h-72 md:h-[700px] flex flex-col md:flex-row justify-center p-5 md:px-40 py-10 items-center">
      {loading ? (
        <div className="h-60 md:h-[400px] w-full">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div> // Show error message
      ) : (
        <div
          className="overflow-visible w-full max-w-5xl h-72 md:h-[700px] border hover:border-gray-300"
          ref={visJsRef}
          />
      )}
      <div className="flex flex-col justify-center items-center">
        <Button className="w-24 md:w-44" onClick={handleZoomToggle}>
          <Image
            src="/logo/obsidian.svg"
            width={300}
            height={300}
            alt="Obsidian Icon"
            className="w-44 h-44"
            priority={true} // Optional: Improves loading for important images
          />
        </Button>
        <p className="text-purple-600 mt-5 md:mt-10 text-center font-semibold">
          Obsidian as my second brain
        </p>
      </div>
    </div>
  );
};

export default Graph;
