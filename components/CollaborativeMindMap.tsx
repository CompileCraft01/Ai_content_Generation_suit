"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useStorage, useMutation, useOthers, useMyPresence } from '@/liveblocks.config';
import { generateMindMapFromContent, MindMapNode } from '@/lib/contentAnalyzer';
import { Modal } from '@/components/ui/modal';

// Custom node component for editable text
const EditableNode = ({ data, id, position, onPositionChange, onAddResearchNode }: { 
  data: any; 
  id: string; 
  position: { x: number; y: number };
  onPositionChange: (id: string, newPosition: { x: number; y: number }) => void;
  onAddResearchNode: (parentId: string, title: string, content: string, type: 'quick' | 'deep') => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || '');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showButtons, setShowButtons] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentSearchType, setCurrentSearchType] = useState<'quick' | 'deep'>('quick');
  
  const updateNodeText = useMutation(({ storage }, nodeId: string, newText: string) => {
    const mindMap = storage.get('mindMap');
    if (mindMap && mindMap.root) {
      const updateNode = (node: any): any => {
        // Add null check for node
        if (!node || !node.id) {
          return node;
        }
        
        if (node.id === nodeId) {
          return { ...node, text: newText };
        }
        
        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children.map(updateNode)
          };
        }
        
        return node;
      };
      
      try {
        const updatedRoot = updateNode(mindMap.root);
        if (updatedRoot) {
          mindMap.set('root', updatedRoot);
        }
      } catch (error) {
        console.error('Error updating node text:', error);
      }
    }
  }, []);

  const handleDoubleClick = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      onPositionChange(id, newPosition);
    }
  }, [isDragging, dragStart, id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    setText(data.label || '');
  }, [data.label]);

  // Quick search using fallback APIs
  const handleQuickSearch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSearching) return;
    
    setIsSearching(true);
    setCurrentSearchType('quick');
    try {
      const response = await fetch('/api/quick-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text }),
      });
      
      const data = await response.json();
      if (data.success && data.result) {
        setSearchResult(data.result);
        setModalTitle(`Quick Search: ${text}`);
        setShowModal(true);
      } else {
        console.error('Quick search error:', data);
        alert('Quick search failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Quick search error:', error);
      alert('Quick search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Deep research using Jina AI
  const handleDeepResearch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSearching) return;
    
    setIsSearching(true);
    setCurrentSearchType('deep');
    try {
      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text }),
      });
      
      const data = await response.json();
      if (data.success && data.result) {
        setSearchResult(data.result);
        setModalTitle(`Deep Research: ${text}`);
        setShowModal(true);
      } else {
        console.error('Deep research error:', data);
        alert('Deep research failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Deep research error:', error);
      alert('Deep research failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle adding research as a new node
  const handleAddAsNode = () => {
    if (searchResult && onAddResearchNode && text) {
      try {
        const title = `${currentSearchType === 'quick' ? 'Quick' : 'Deep'} Research: ${text}`;
        console.log('Adding research node:', { id, title, searchResult: searchResult.substring(0, 100) + '...' });
        onAddResearchNode(id, title, searchResult, currentSearchType);
        setShowModal(false);
        // Show success message
        alert('Research added as new node successfully!');
      } catch (error) {
        console.error('Error adding research node:', error);
        alert('Failed to add research as node. Please try again.');
      }
    } else {
      console.warn('Cannot add research node:', { searchResult: !!searchResult, onAddResearchNode: !!onAddResearchNode, text });
      alert('Unable to add research node. Missing required data.');
    }
  };

  const level = data.level || 0;
  const nodeType = data.type || 'detail';

  // Dynamic styling based on node level and type
  const getNodeStyle = () => {
    switch (level) {
      case 0: // Root node
        return "px-6 py-4 shadow-xl rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 border-4 border-yellow-600 min-w-[150px] hover:scale-105 transition-all duration-200";
      case 1: // Main topics
        return "px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 border-3 border-gray-600 min-w-[130px] hover:scale-105 transition-all duration-200";
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
      className="relative group"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {/* Research buttons - positioned on sides */}
      {showButtons && !isEditing && !isDragging && (
        <>
          {/* Quick Search Button - Left side */}
          <button
            onClick={handleQuickSearch}
            disabled={isSearching}
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10 transition-all duration-200"
            title="Quick Search (Gemini)"
          >
            {isSearching ? '...' : 'Q'}
          </button>
          
          {/* Deep Research Button - Right side */}
          <button
            onClick={handleDeepResearch}
            disabled={isSearching}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10 transition-all duration-200"
            title="Deep Research (Jina AI)"
          >
            {isSearching ? '...' : 'D'}
          </button>
        </>
      )}
      
      {/* Main node */}
      <div
        className={`${getNodeStyle()} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none relative`}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
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
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {/* Search Result Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <div className="prose max-w-none">
          <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed mb-4">
            {searchResult}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleAddAsNode}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Add as New Node
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Convert mind map data to simple node structure
const convertToSimpleNodes = (mindMapData: any): any[] => {
  if (!mindMapData || !mindMapData.root) {
    return [];
  }

  const nodes: any[] = [];
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

  // Second pass: position nodes in a simple grid layout
  const positionNodes = (): void => {
    const rootNode = nodeMap.get('root');
    if (!rootNode) return;

    // Position root node at center of larger canvas
    rootNode.position = { x: 800, y: 600 };
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

    // Position level 1 nodes in a circle around root with larger radius
    const level1Nodes = Array.from(nodeMap.values()).filter(n => n.level === 1);
    level1Nodes.forEach((node, index) => {
      const angle = (index / level1Nodes.length) * 2 * Math.PI;
      const radius = 400; // Increased radius for more space
      node.position = {
        x: 800 + radius * Math.cos(angle),
        y: 600 + radius * Math.sin(angle)
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
    });

    // Position level 2+ nodes around their parents
    const higherLevelNodes = Array.from(nodeMap.values()).filter(n => n.level >= 2);
    higherLevelNodes.forEach((node, index) => {
      const parent = nodeMap.get(node.parentId);
      if (parent && parent.position) {
        const siblingNodes = higherLevelNodes.filter(n => n.parentId === node.parentId);
        const siblingIndex = siblingNodes.indexOf(node);
        const angle = (siblingIndex / siblingNodes.length) * 2 * Math.PI;
        const radius = 250; // Increased radius for more space
        
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
      }
    });
  };

  // Execute the two-pass algorithm
  collectNodes(mindMapData.root);
  positionNodes();

  return nodes;
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
  const [nodes, setNodes] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastContentHash, setLastContentHash] = useState<string>('');

  // Handle position changes for dragging
  const handlePositionChange = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, position: newPosition }
          : node
      )
    );
  }, []);

  // Add research result as a new node
  const addResearchNode = useMutation(({ storage }, parentId: string, title: string, content: string, type: 'quick' | 'deep') => {
    const mindMap = storage.get('mindMap');
    if (mindMap && mindMap.root) {
      const findAndAddToNode = (node: any): any => {
        // Add null check for node
        if (!node || !node.id) {
          return node;
        }
        
        if (node.id === parentId) {
          const newNodeId = `research-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newChild = {
            id: newNodeId,
            text: title,
            children: [{
              id: `${newNodeId}-content`,
              text: content.length > 100 ? content.substring(0, 100) + '...' : content,
              children: []
            }]
          };
          console.log('Adding research node to parent:', parentId, 'New node:', newChild);
          return {
            ...node,
            children: [...(node.children || []), newChild]
          };
        }
        
        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children.map(findAndAddToNode)
          };
        }
        
        return node;
      };
      
      try {
        const updatedRoot = findAndAddToNode(mindMap.root);
        if (updatedRoot) {
          mindMap.set('root', updatedRoot);
          console.log('Research node added successfully, updated root:', updatedRoot);
          
          // Force immediate node refresh
          setTimeout(() => {
            const newNodes = convertToSimpleNodes({ root: updatedRoot });
            console.log('Forcing immediate node refresh with', newNodes.length, 'nodes');
            setNodes(newNodes);
          }, 50);
        }
      } catch (error) {
        console.error('Error adding research node:', error);
      }
    }
  }, []);

  const handleAddResearchNode = useCallback((parentId: string, title: string, content: string, type: 'quick' | 'deep') => {
    addResearchNode(parentId, title, content, type);
  }, [addResearchNode]);

  // Add new node mutation
  const addNode = useMutation(({ storage }, parentId: string, text: string) => {
    const mindMap = storage.get('mindMap');
    if (mindMap && mindMap.root) {
      const addNodeToTree = (node: any): any => {
        // Add null check for node
        if (!node || !node.id) {
          return node;
        }
        
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
        
        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children.map(addNodeToTree)
          };
        }
        
        return node;
      };
      
      try {
        const updatedRoot = addNodeToTree(mindMap.root);
        if (updatedRoot) {
          mindMap.set('root', updatedRoot);
        }
      } catch (error) {
        console.error('Error adding node:', error);
      }
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
      const root = mindMap.root;
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
      // Always regenerate from content if available
      const currentContent = textContent || content;
      if (currentContent && currentContent.trim().length > 20) {
        console.log('Generating mind map from content:', currentContent.substring(0, 100) + '...');
        generateMindMapFromText(currentContent);
      } else if (!mindMapData.root) {
        initializeMindMap();
      }
      setIsInitialized(true);
    }
  }, [mindMapData, isInitialized, initializeMindMap, generateMindMapFromText, textContent, content]);

  // Force regeneration when content prop changes
  useEffect(() => {
    if (content && content.trim().length > 20 && isInitialized) {
      console.log('Content prop changed, regenerating mind map');
      generateMindMapFromText(content);
    }
  }, [content, generateMindMapFromText, isInitialized]);

  // Update nodes when mind map data changes
  useEffect(() => {
    if (mindMapData && isInitialized) {
      const newNodes = convertToSimpleNodes(mindMapData);
      console.log('Setting nodes:', newNodes.length);
      setNodes(newNodes);
      
      // Fallback: If no nodes, create a default structure
      if (newNodes.length === 0) {
        console.log('No nodes found, creating default structure');
        const defaultNodes = [
          {
            id: 'default-root',
            type: 'editable',
            position: { x: 400, y: 200 },
            data: { 
              label: 'Central Topic',
              level: 0,
              type: 'main'
            },
          }
        ];
        setNodes(defaultNodes);
      }
    }
  }, [mindMapData, setNodes, isInitialized]);

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

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    // Update presence when user interacts with mind map
    updateMyPresence({ isTyping: true });
    // The double-click handling is done in the EditableNode component
  }, [updateMyPresence]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    const newNodeText = prompt('Enter text for new child node:');
    if (newNodeText) {
      addNode(node.id, newNodeText);
    }
  }, [addNode]);

  if (!isInitialized) {
    return (
      <div className="w-full h-[800px] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing collaborative mind map...</p>
          <p className="text-xs text-gray-500 mt-2">Loading mind map data...</p>
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

  // Debug logging
  console.log('Mind map render - isInitialized:', isInitialized);
  console.log('Mind map render - mindMapData:', mindMapData);
  console.log('Mind map render - nodes:', nodes);

  return (
    <div className="w-full h-[800px] bg-gray-50 relative overflow-auto">
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-sm">
        💡 Double-click nodes to edit • Right-click to add children • Drag to move
        <br />
        <span className="text-gray-600">Nodes: {nodes.length}</span>
      </div>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {/* Active Collaborators */}
        {others.length > 0 && (
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm border">
            <div className="flex -space-x-1">
              {others.slice(0, 3).map(({ connectionId, info, presence }) => (
                <div
                  key={connectionId}
                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white relative"
                  style={{ backgroundColor: info?.color || '#f783ac' }}
                  title={`${info?.name || 'Anonymous'} ${presence?.isTyping ? '(typing...)' : ''}`}
                >
                  {(info?.name || 'A').charAt(0).toUpperCase()}
                  {presence?.isTyping && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
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
            {/* Typing indicator for mind map */}
            {others.some(({ presence }) => presence?.isTyping) && (
              <div className="text-xs text-green-600 ml-2">
                {others.filter(({ presence }) => presence?.isTyping).map(({ info }) => info?.name || 'Someone').join(', ')} typing...
              </div>
            )}
          </div>
        )}
        
        {isRegenerating && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
            Updating...
          </div>
        )}
        <button
          onClick={handleRegenerateFromContent}
          disabled={isRegenerating}
          className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-1 rounded-md text-xs font-medium transition-colors"
          title="Regenerate mind map from text content"
        >
          🔄 {isRegenerating ? 'Generating...' : 'Sync from Text'}
        </button>
      </div>
      
      {/* Mind map visualization with arrows */}
      <div className="relative w-[1600px] h-[1200px] p-8 min-w-full min-h-full">
        {/* Render SVG arrows first (behind nodes) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#4f46e5"
                stroke="#4f46e5"
                strokeWidth="1"
              />
            </marker>
          </defs>
          {(() => {
            const connections: JSX.Element[] = [];
            
            // Create connections based on the mind map structure
            const createConnections = (parentNode: any, parentPosition: any) => {
              if (parentNode.children && parentNode.children.length > 0) {
                parentNode.children.forEach((child: any) => {
                  // Find the child node in our nodes array
                  const childNodeData = nodes.find(n => n.id === child.id);
                  if (childNodeData) {
                    connections.push(
                      <line
                        key={`${parentNode.id}-${child.id}`}
                        x1={parentPosition.x}
                        y1={parentPosition.y}
                        x2={childNodeData.position.x}
                        y2={childNodeData.position.y}
                        stroke="#4f46e5"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                        opacity="0.8"
                      />
                    );
                    
                    // Recursively create connections for children
                    createConnections(child, childNodeData.position);
                  }
                });
              }
            };
            
            // Start from root
            if (mindMapData?.root) {
              const rootNode = nodes.find(n => n.id === 'root');
              if (rootNode) {
                createConnections(mindMapData.root, rootNode.position);
              }
            }
            
            return connections;
          })()}
        </svg>
        
        {/* Render nodes on top of arrows */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.position.x,
              top: node.position.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
            onContextMenu={(e) => onNodeContextMenu(e, node)}
          >
                    <EditableNode
                      data={node.data}
                      id={node.id}
                      position={node.position}
                      onPositionChange={handlePositionChange}
                      onAddResearchNode={handleAddResearchNode}
                    />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborativeMindMap;