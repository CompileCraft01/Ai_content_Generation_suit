"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStorage, useMutation, useOthers, useMyPresence } from '@/liveblocks.config';
import { generateMindMapFromContent, MindMapNode } from '@/lib/contentAnalyzer';

// Custom node component for editable text
const EditableNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || '');
  
  const updateNodeText = useMutation(({ storage }, nodeId: string, newText: string) => {
    const mindMap = storage.get('mindMap');
    if (mindMap) {
      const updateNode = (node: any): any => {
        if (node.id === nodeId) {
          return { ...node, text: newText };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(updateNode)
          };
        }
        return node;
      };
      
      const updatedRoot = updateNode(mindMap.get('root'));
      mindMap.set('root', updatedRoot);
    }
  }, []);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== data.label) {
      updateNodeText(id, text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  useEffect(() => {
    setText(data.label || '');
  }, [data.label]);

  const level = data.level || 0;
  const nodeType = data.type || 'detail';

  // Dynamic styling based on node level and type
  const getNodeStyle = () => {
    switch (level) {
      case 0: // Root node
        return "px-6 py-4 shadow-xl rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-yellow-600 min-w-[150px] hover:scale-105 transition-all duration-200";
      case 1: // Main topics
        return "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 border-3 border-blue-700 min-w-[130px] hover:scale-105 transition-all duration-200";
      default: // Subtopics and details
        return "px-3 py-2 shadow-md rounded-lg bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-700 min-w-[120px] hover:scale-105 transition-all duration-200";
    }
  };

  const getTextStyle = () => {
    switch (level) {
      case 0:
        return "text-center text-black font-bold text-lg break-words";
      case 1:
        return "text-center text-white font-semibold text-base break-words";
      default:
        return "text-center text-white font-medium text-sm break-words";
    }
  };

  const getInputStyle = () => {
    switch (level) {
      case 0:
        return "w-full bg-transparent border-none outline-none text-center text-black font-bold text-lg";
      case 1:
        return "w-full bg-transparent border-none outline-none text-center text-white font-semibold text-base";
      default:
        return "w-full bg-transparent border-none outline-none text-center text-white font-medium text-sm";
    }
  };

  return (
    <div
      className={getNodeStyle()}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          className={getInputStyle()}
          autoFocus
        />
      ) : (
        <div className={getTextStyle()}>{text}</div>
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  editable: EditableNode,
};

// Convert mind map data to ReactFlow nodes and edges
const convertToReactFlowData = (mindMapData: any): { nodes: Node[]; edges: Edge[] } => {
  if (!mindMapData || !mindMapData.root) {
    return { nodes: [], edges: [] };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  // First pass: collect all nodes with their relationships
  const nodeMap = new Map<string, any>();
  const collectNodes = (node: any, parentId?: string, level: number = 0): void => {
    const currentId = node.id || `node-${nodeId++}`;
    nodeMap.set(currentId, {
      ...node,
      id: currentId,
      parentId,
      level,
      children: node.children || []
    });

    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => {
        collectNodes(child, currentId, level + 1);
      });
    }
  };

  // Second pass: position nodes and create edges
  const positionNodes = (): void => {
    const rootNode = nodeMap.get('root');
    if (!rootNode) return;

    // Position root node at center
    rootNode.position = { x: 400, y: 200 };
    nodes.push({
      id: rootNode.id,
      type: 'editable',
      position: rootNode.position,
      data: { 
        label: rootNode.text || 'Central Topic',
        level: 0,
        type: 'main'
      },
    });

    // Position level 1 nodes in a circle around root
    const level1Nodes = Array.from(nodeMap.values()).filter(n => n.level === 1);
    level1Nodes.forEach((node, index) => {
      const angle = (index / level1Nodes.length) * 2 * Math.PI;
      const radius = 300;
      node.position = {
        x: 400 + radius * Math.cos(angle),
        y: 200 + radius * Math.sin(angle)
      };
      
      nodes.push({
        id: node.id,
        type: 'editable',
        position: node.position,
        data: { 
          label: node.text || 'Main Topic',
          level: 1,
          type: 'subtopic'
        },
      });

      // Create edge from root to level 1
      edges.push({
        id: `edge-root-${node.id}`,
        source: 'root',
        target: node.id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
          width: 35,
          height: 35,
        },
        style: {
          stroke: '#3b82f6',
          strokeWidth: 4,
          strokeDasharray: '0',
        },
        animated: true,
      });
    });

    // Position level 2+ nodes around their parents
    const higherLevelNodes = Array.from(nodeMap.values()).filter(n => n.level >= 2);
    higherLevelNodes.forEach((node, index) => {
      const parent = nodeMap.get(node.parentId);
      if (parent && parent.position) {
        const siblingNodes = higherLevelNodes.filter(n => n.parentId === node.parentId);
        const siblingIndex = siblingNodes.indexOf(node);
        const angle = (siblingIndex / siblingNodes.length) * 2 * Math.PI;
        const radius = 180;
        
        node.position = {
          x: parent.position.x + radius * Math.cos(angle),
          y: parent.position.y + radius * Math.sin(angle)
        };
        
        nodes.push({
          id: node.id,
          type: 'editable',
          position: node.position,
          data: { 
            label: node.text || 'Sub Topic',
            level: node.level,
            type: 'detail'
          },
        });

        // Create edge from parent to child
        edges.push({
          id: `edge-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#10b981',
            width: 25,
            height: 25,
          },
          style: {
            stroke: '#10b981',
            strokeWidth: 3,
            strokeDasharray: '8,4',
          },
        });
      }
    });
  };

  // Execute the two-pass algorithm
  collectNodes(mindMapData.root);
  positionNodes();

  return { nodes, edges };
};

interface CollaborativeMindMapProps {
  content?: string;
  initialMindMap?: any;
}

const CollaborativeMindMap: React.FC<CollaborativeMindMapProps> = ({ content, initialMindMap }) => {
  const mindMapData = useStorage((root) => root.mindMap);
  const textContent = useStorage((root) => root.content);
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastContentHash, setLastContentHash] = useState<string>('');

  // Add new node mutation
  const addNode = useMutation(({ storage }, parentId: string, text: string) => {
    const mindMap = storage.get('mindMap');
    if (mindMap) {
      const addNodeToTree = (node: any): any => {
        if (node.id === parentId) {
          const newNode = {
            id: `node-${Date.now()}`,
            text: text || 'New Node',
            children: []
          };
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(addNodeToTree)
          };
        }
        return node;
      };
      
      const updatedRoot = addNodeToTree(mindMap.get('root'));
      mindMap.set('root', updatedRoot);
    }
  }, []);

  // Generate mind map from content
  const generateMindMapFromText = useMutation(({ storage }, content: string) => {
    const mindMap = storage.get('mindMap');
    if (mindMap && content && content.trim().length > 0) {
      setIsRegenerating(true);
      try {
        const generatedMindMap = generateMindMapFromContent(content);
        mindMap.set('root', generatedMindMap);
      } catch (error) {
        console.error('Error generating mind map from content:', error);
        // Fallback to default structure
        const defaultRoot = {
          id: 'root',
          text: 'Content Analysis',
          children: [
            {
              id: 'child1',
              text: 'Key Points',
              children: []
            },
            {
              id: 'child2',
              text: 'Details',
              children: []
            }
          ]
        };
        mindMap.set('root', defaultRoot);
      } finally {
        setTimeout(() => setIsRegenerating(false), 1000); // Show loading for 1 second
      }
    }
  }, []);

  // Initialize mind map with default data if empty
  const initializeMindMap = useMutation(({ storage }) => {
    const mindMap = storage.get('mindMap');
    if (mindMap) {
      const root = mindMap.get('root');
      if (!root) {
        const defaultRoot = {
          id: 'root',
          text: 'Central Topic',
          children: [
            {
              id: 'child1',
              text: 'Branch 1',
              children: []
            },
            {
              id: 'child2',
              text: 'Branch 2',
              children: []
            }
          ]
        };
        mindMap.set('root', defaultRoot);
      }
    }
  }, []);

  // Initialize mind map when data is available
  useEffect(() => {
    if (mindMapData && !isInitialized) {
      // Check if we have root data, if not initialize
      if (!mindMapData.root) {
        // Use AI-generated mind map if available
        if (initialMindMap && initialMindMap.root) {
          console.log('Using AI-generated mind map:', initialMindMap);
          initializeMindMap(initialMindMap.root);
        } else {
          // If we have text content, generate mind map from it
          const currentContent = textContent || content;
          if (currentContent && currentContent.trim().length > 0) {
            generateMindMapFromText(currentContent);
          } else {
            initializeMindMap();
          }
        }
      }
      setIsInitialized(true);
    }
  }, [mindMapData, isInitialized, initializeMindMap, generateMindMapFromText, textContent, content, initialMindMap]);

  // Update ReactFlow data when mind map data changes
  useEffect(() => {
    if (mindMapData && isInitialized) {
      const { nodes: newNodes, edges: newEdges } = convertToReactFlowData(mindMapData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [mindMapData, setNodes, setEdges, isInitialized]);

  // Simple hash function to detect content changes
  const getContentHash = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  // Auto-regenerate mind map when text content changes significantly
  useEffect(() => {
    if (textContent && isInitialized && mindMapData) {
      const currentContent = textContent.trim();
      const currentHash = getContentHash(currentContent);
      
      // Only regenerate if content has actually changed and is substantial
      if (currentContent.length > 50 && currentHash !== lastContentHash) {
        // Debounce the regeneration to avoid too frequent updates
        const timeoutId = setTimeout(() => {
          generateMindMapFromText(currentContent);
          setLastContentHash(currentHash);
        }, 3000); // Wait 3 seconds after last change
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [textContent, isInitialized, mindMapData, generateMindMapFromText, lastContentHash]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep', // Smooth curved lines for better visual flow
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#10b981',
        width: 30,
        height: 30,
      },
      style: {
        stroke: '#10b981',
        strokeWidth: 3,
        strokeDasharray: '8,4', // Dashed line for manually added connections
      },
      animated: true, // Animate manually added connections
    }, eds)),
    [setEdges]
  );

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Update presence when user interacts with mind map
    updateMyPresence({ isTyping: true });
    // The double-click handling is done in the EditableNode component
  }, [updateMyPresence]);

  const onPaneMouseMove = useCallback((event: React.MouseEvent) => {
    // Update cursor position for other users
    updateMyPresence({
      cursor: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  }, [updateMyPresence]);

  const onPaneMouseLeave = useCallback(() => {
    // Clear cursor when mouse leaves the pane
    updateMyPresence({
      cursor: null,
    });
  }, [updateMyPresence]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    const newNodeText = prompt('Enter text for new child node:');
    if (newNodeText) {
      addNode(node.id, newNodeText);
    }
  }, [addNode]);

  if (!isInitialized) {
    return (
      <div className="w-full h-[600px] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing collaborative mind map...</p>
        </div>
      </div>
    );
  }

  const handleRegenerateFromContent = () => {
    const currentContent = textContent || content;
    if (currentContent && currentContent.trim().length > 0) {
      generateMindMapFromText(currentContent);
      setLastContentHash(getContentHash(currentContent.trim()));
    }
  };

  return (
    <div className="w-full h-[600px] bg-gray-50 relative">
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-sm">
        💡 Double-click nodes to edit • Right-click to add children • Drag to move
      </div>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* Active Collaborators */}
        {others.length > 0 && (
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm border">
            <div className="flex -space-x-1">
              {others.slice(0, 3).map(({ connectionId, info }) => (
                <div
                  key={connectionId}
                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: info?.color || '#f783ac' }}
                  title={info?.name || 'Anonymous'}
                >
                  {(info?.name || 'A').charAt(0).toUpperCase()}
                </div>
              ))}
              {others.length > 3 && (
                <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-medium text-white">
                  +{others.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              {others.length} collaborator{others.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        {isRegenerating && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            Updating...
          </div>
        )}
        <button
          onClick={handleRegenerateFromContent}
          disabled={isRegenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
          title="Regenerate mind map from text content"
        >
          🔄 Sync from Text
        </button>
      </div>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeContextMenu={onNodeContextMenu}
          onPaneMouseMove={onPaneMouseMove}
          onPaneMouseLeave={onPaneMouseLeave}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
          defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#10b981',
              width: 30,
              height: 30,
            },
            style: {
              stroke: '#10b981',
              strokeWidth: 3,
            },
          }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default CollaborativeMindMap;