// Content analysis utilities for generating mind maps from text content

export interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  level: number;
  type: 'main' | 'subtopic' | 'detail';
}

export interface ContentAnalysis {
  mainTopic: string;
  subtopics: string[];
  details: { [key: string]: string[] };
  keywords: string[];
}

/**
 * Analyzes text content and extracts key information for mind map generation
 */
export function analyzeContent(content: string): ContentAnalysis {
  if (!content || content.trim().length === 0) {
    return {
      mainTopic: 'Untitled Content',
      subtopics: [],
      details: {},
      keywords: []
    };
  }

  // Clean and normalize content
  const cleanContent = content.trim();
  
  // Extract main topic (first line or first sentence)
  const lines = cleanContent.split('\n').filter(line => line.trim().length > 0);
  const firstLine = lines[0] || '';
  const mainTopic = extractMainTopic(firstLine, cleanContent);
  
  // Extract subtopics from headings, bullet points, and paragraphs
  const subtopics = extractSubtopics(cleanContent);
  
  // Extract details for each subtopic
  const details = extractDetails(cleanContent, subtopics);
  
  // Extract keywords
  const keywords = extractKeywords(cleanContent);

  return {
    mainTopic,
    subtopics,
    details,
    keywords
  };
}

/**
 * Generates a mind map structure from analyzed content
 */
export function generateMindMapFromContent(content: string): MindMapNode {
  const analysis = analyzeContent(content);
  
  const rootNode: MindMapNode = {
    id: 'root',
    text: analysis.mainTopic,
    level: 0,
    type: 'main',
    children: []
  };

  // Add subtopics as children
  analysis.subtopics.forEach((subtopic, index) => {
    const subtopicNode: MindMapNode = {
      id: `subtopic-${index}`,
      text: subtopic,
      level: 1,
      type: 'subtopic',
      children: []
    };

    // Add details as children of subtopics
    const subtopicDetails = analysis.details[subtopic] || [];
    subtopicDetails.forEach((detail, detailIndex) => {
      const detailNode: MindMapNode = {
        id: `detail-${index}-${detailIndex}`,
        text: detail,
        level: 2,
        type: 'detail',
        children: []
      };
      subtopicNode.children.push(detailNode);
    });

    rootNode.children.push(subtopicNode);
  });

  // If no subtopics found, create a basic structure
  if (rootNode.children.length === 0) {
    const contentPreview = content.length > 100 ? content.substring(0, 100) + '...' : content;
    rootNode.children.push({
      id: 'content-preview',
      text: 'Content Overview',
      level: 1,
      type: 'subtopic',
      children: [{
        id: 'preview-detail',
        text: contentPreview,
        level: 2,
        type: 'detail',
        children: []
      }]
    });
  }

  return rootNode;
}

/**
 * Extracts the main topic from content
 */
function extractMainTopic(firstLine: string, fullContent: string): string {
  // If first line is short and looks like a title, use it
  if (firstLine.length < 100 && !firstLine.includes('.')) {
    return firstLine.trim();
  }

  // Look for common title patterns
  const titlePatterns = [
    /^#\s*(.+)/, // Markdown heading
    /^(.+?):\s*$/, // Title with colon
    /^(.+?)\n\n/, // Title followed by double newline
  ];

  for (const pattern of titlePatterns) {
    const match = fullContent.match(pattern);
    if (match && match[1].length < 100) {
      return match[1].trim();
    }
  }

  // Extract first sentence if it's reasonable length
  const firstSentence = firstLine.split('.')[0];
  if (firstSentence.length < 80 && firstSentence.length > 10) {
    return firstSentence.trim();
  }

  // Fallback to truncated first line
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
}

/**
 * Extracts subtopics from content
 */
function extractSubtopics(content: string): string[] {
  const subtopics: string[] = [];
  
  // Extract from markdown headings
  const headingMatches = content.match(/^#{2,}\s*(.+)$/gm);
  if (headingMatches) {
    headingMatches.forEach(match => {
      const heading = match.replace(/^#+\s*/, '').trim();
      if (heading.length > 0 && heading.length < 100) {
        subtopics.push(heading);
      }
    });
  }

  // Extract from bullet points
  const bulletMatches = content.match(/^[\*\-\+]\s*(.+)$/gm);
  if (bulletMatches) {
    bulletMatches.forEach(match => {
      const bullet = match.replace(/^[\*\-\+]\s*/, '').trim();
      if (bullet.length > 0 && bullet.length < 100) {
        subtopics.push(bullet);
      }
    });
  }

  // Extract from numbered lists
  const numberedMatches = content.match(/^\d+\.\s*(.+)$/gm);
  if (numberedMatches) {
    numberedMatches.forEach(match => {
      const numbered = match.replace(/^\d+\.\s*/, '').trim();
      if (numbered.length > 0 && numbered.length < 100) {
        subtopics.push(numbered);
      }
    });
  }

  // Extract from paragraphs (if no other structure found)
  if (subtopics.length === 0) {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
    paragraphs.slice(0, 5).forEach(paragraph => {
      const firstSentence = paragraph.split('.')[0].trim();
      if (firstSentence.length > 10 && firstSentence.length < 100) {
        subtopics.push(firstSentence);
      }
    });
  }

  return subtopics.slice(0, 8); // Limit to 8 subtopics
}

/**
 * Extracts details for each subtopic
 */
function extractDetails(content: string, subtopics: string[]): { [key: string]: string[] } {
  const details: { [key: string]: string[] } = {};

  subtopics.forEach(subtopic => {
    const detailsList: string[] = [];
    
    // Find content related to this subtopic
    const lines = content.split('\n');
    let inSubtopicSection = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if we're entering this subtopic's section
      if (trimmedLine.toLowerCase().includes(subtopic.toLowerCase()) || 
          subtopic.toLowerCase().includes(trimmedLine.toLowerCase())) {
        inSubtopicSection = true;
        continue;
      }
      
      // If we're in the section, collect details
      if (inSubtopicSection) {
        // Stop if we hit another heading or bullet point
        if (trimmedLine.match(/^#{2,}\s*/) || trimmedLine.match(/^[\*\-\+]\s*/)) {
          break;
        }
        
        // Add meaningful lines as details
        if (trimmedLine.length > 10 && trimmedLine.length < 200 && !trimmedLine.match(/^\d+\./)) {
          detailsList.push(trimmedLine);
        }
      }
    }
    
    // If no specific details found, create some from the content
    if (detailsList.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      sentences.slice(0, 3).forEach(sentence => {
        if (sentence.trim().length < 150) {
          detailsList.push(sentence.trim());
        }
      });
    }
    
    details[subtopic] = detailsList.slice(0, 5); // Limit to 5 details per subtopic
  });

  return details;
}

/**
 * Extracts keywords from content
 */
function extractKeywords(content: string): string[] {
  // Simple keyword extraction - in a real app, you might use more sophisticated NLP
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !isCommonWord(word));

  // Count word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Return most frequent words
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Checks if a word is a common word that should be filtered out
 */
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use', 'with', 'this', 'that', 'they', 'have', 'from', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'these', 'think', 'want', 'what', 'your', 'into', 'more', 'only', 'other', 'right', 'should', 'through', 'under', 'water', 'would', 'write', 'years', 'before', 'great', 'might', 'never', 'place', 'small', 'sound', 'still', 'those', 'three', 'where', 'world', 'being', 'every', 'found', 'going', 'house', 'large', 'often', 'seems', 'shall', 'show', 'start', 'state', 'story', 'study', 'system', 'today', 'told', 'took', 'turn', 'until', 'using', 'white', 'whole', 'within', 'without', 'young'
  ]);
  
  return commonWords.has(word);
}
