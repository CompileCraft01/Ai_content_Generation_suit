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
 * Strips HTML tags from content
 */
function stripHtmlTags(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
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

  // Clean and normalize content - strip HTML first
  const cleanContent = stripHtmlTags(content).trim();
  
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
    subtopicDetails.slice(0, 3).forEach((detail, detailIndex) => { // Limit to 3 details per subtopic
      const detailNode: MindMapNode = {
        id: `detail-${index}-${detailIndex}`,
        text: detail.length > 60 ? detail.substring(0, 60) + '...' : detail,
        level: 2,
        type: 'detail',
        children: []
      };
      subtopicNode.children.push(detailNode);
    });

    rootNode.children.push(subtopicNode);
  });

  // If no subtopics found, create a more comprehensive structure from content
  if (rootNode.children.length === 0) {
    console.log('No subtopics found, creating structure from content paragraphs');
    const cleanContent = stripHtmlTags(content);
    const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 30);
    
    paragraphs.slice(0, 6).forEach((paragraph, index) => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const mainSentence = sentences[0]?.trim();
      
      if (mainSentence && mainSentence.length > 10) {
        const topicNode: MindMapNode = {
          id: `topic-${index}`,
          text: mainSentence.length > 50 ? mainSentence.substring(0, 50) + '...' : mainSentence,
          level: 1,
          type: 'subtopic',
          children: []
        };
        
        // Add additional sentences as details
        sentences.slice(1, 3).forEach((sentence, sentIndex) => {
          const cleanSentence = sentence.trim();
          if (cleanSentence.length > 10) {
            topicNode.children.push({
              id: `detail-${index}-${sentIndex}`,
              text: cleanSentence.length > 60 ? cleanSentence.substring(0, 60) + '...' : cleanSentence,
              level: 2,
              type: 'detail',
              children: []
            });
          }
        });
        
        rootNode.children.push(topicNode);
      }
    });
  }

  // Final fallback if still no children
  if (rootNode.children.length === 0) {
    const contentPreview = stripHtmlTags(content);
    const words = contentPreview.split(' ').slice(0, 15).join(' ');
    rootNode.children.push({
      id: 'content-preview',
      text: 'Content Overview',
      level: 1,
      type: 'subtopic',
      children: [{
        id: 'preview-detail',
        text: words + (contentPreview.split(' ').length > 15 ? '...' : ''),
        level: 2,
        type: 'detail',
        children: []
      }]
    });
  }

  console.log('Generated mind map structure:', rootNode);
  return rootNode;
}

/**
 * Extracts the main topic from content
 */
function extractMainTopic(firstLine: string, fullContent: string): string {
  const cleanContent = stripHtmlTags(fullContent);
  const cleanFirstLine = stripHtmlTags(firstLine);
  
  // If first line is short and looks like a title, use it
  if (cleanFirstLine.length < 120 && !cleanFirstLine.includes('.') && cleanFirstLine.length > 5) {
    return cleanFirstLine.trim();
  }

  // Look for common title patterns
  const titlePatterns = [
    /^#\s*(.+)/, // Markdown heading
    /^(.+?):\s*$/, // Title with colon
    /^(.+?)\n\n/, // Title followed by double newline
    /^(.+?)\s*-\s*/, // Title followed by dash
  ];

  for (const pattern of titlePatterns) {
    const match = cleanContent.match(pattern);
    if (match && match[1].length < 120 && match[1].length > 5) {
      return stripHtmlTags(match[1]).trim();
    }
  }

  // Look for blog-style titles (common patterns)
  const blogPatterns = [
    /^(.+?(?:guide|tips|ideas|ways|steps|methods|strategies|secrets|ultimate|complete|best|top|how to).+?)(?:\.|$)/i,
    /^(how to .+?)(?:\.|$)/i,
    /^(\d+.+?(?:tips|ideas|ways|steps|methods|strategies).+?)(?:\.|$)/i,
  ];

  for (const pattern of blogPatterns) {
    const match = cleanContent.match(pattern);
    if (match && match[1].length < 120 && match[1].length > 10) {
      return match[1].trim();
    }
  }

  // Extract first sentence if it's reasonable length
  const sentences = cleanContent.split(/[.!?]+/);
  const firstSentence = sentences[0]?.trim();
  if (firstSentence && firstSentence.length < 100 && firstSentence.length > 10) {
    return firstSentence;
  }

  // Fallback to truncated first line
  const fallback = cleanFirstLine.length > 60 ? cleanFirstLine.substring(0, 60) + '...' : cleanFirstLine;
  return fallback || 'Content Topic';
}

/**
 * Extracts subtopics from content with improved criteria
 */
function extractSubtopics(content: string): string[] {
  const subtopics: string[] = [];
  
  // Strip HTML first
  const cleanContent = stripHtmlTags(content);
  
  // 1. Extract from markdown headings (highest priority)
  const headingMatches = cleanContent.match(/^#{1,4}\s+(.+)$/gm);
  if (headingMatches) {
    headingMatches.forEach(match => {
      const heading = match.replace(/^#+\s+/, '').trim();
      if (heading.length > 5 && heading.length < 120) {
        subtopics.push(heading);
      }
    });
  }

  // 2. Extract from bullet points and numbered lists (high priority)
  const listPatterns = [
    /^[\s]*[-*•]\s+(.+)$/gm,  // Bullet points
    /^[\s]*\d+\.\s+(.+)$/gm,  // Numbered lists
    /^[\s]*[a-zA-Z]\.\s+(.+)$/gm  // Lettered lists
  ];
  
  listPatterns.forEach(pattern => {
    const matches = cleanContent.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const item = match.replace(/^[\s]*[-*•\d+a-zA-Z\.\s]+/, '').trim();
        if (item.length > 8 && item.length < 120) {
          subtopics.push(item);
        }
      });
    }
  });

  // 3. Extract structured content patterns (medium priority)
  const structurePatterns = [
    // Sequential indicators
    /(?:first[ly]?|1st|initially)[,:]\s*(.{15,100})/gi,
    /(?:second[ly]?|2nd|then|next)[,:]\s*(.{15,100})/gi,
    /(?:third[ly]?|3rd|finally|lastly)[,:]\s*(.{15,100})/gi,
    /(?:fourth[ly]?|4th)[,:]\s*(.{15,100})/gi,
    
    // Topic indicators
    /(?:another|a|one)\s+(?:key|main|important|crucial|essential)\s+(?:aspect|point|factor|element|consideration)\s+(?:is|includes?|involves?)\s+(.{15,100})/gi,
    /(?:the\s+)?(?:key|main|primary|central|core)\s+(?:aspect|point|factor|element|idea|concept)\s+(?:is|of|includes?)\s+(.{15,100})/gi,
    
    // Benefits/advantages patterns
    /(?:benefits?|advantages?)\s+(?:include|are|of)\s+(.{15,100})/gi,
    /(?:this|it)\s+(?:helps?|allows?|enables?|provides?)\s+(.{15,100})/gi,
    
    // Problem/challenge patterns
    /(?:challenges?|problems?|issues?|difficulties)\s+(?:include|are|with)\s+(.{15,100})/gi,
    
    // Feature/characteristic patterns
    /(?:features?|characteristics?|properties?)\s+(?:include|are|of)\s+(.{15,100})/gi,
  ];
  
  structurePatterns.forEach(pattern => {
    const matches = cleanContent.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const topic = match[1].trim().replace(/[.!?]+$/, ''); // Remove trailing punctuation
        if (topic.length > 10 && topic.length < 120) {
          subtopics.push(topic);
        }
      }
    }
  });

  // 4. Extract from strong topic sentences (lower priority)
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 25);
  const topicSentencePatterns = [
    /^(.{20,80})\s+(?:is|are|can|will|should|must|may)\s+/i,
    /^(?:understanding|knowing|learning)\s+(.{20,80})\s+/i,
    /^(.{20,80})\s+(?:helps?|allows?|enables?|provides?)\s+/i,
  ];
  
  sentences.slice(0, 10).forEach(sentence => {
    topicSentencePatterns.forEach(pattern => {
      const match = sentence.trim().match(pattern);
      if (match && match[1]) {
        const topic = match[1].trim();
        if (topic.length > 15 && topic.length < 100) {
          subtopics.push(topic);
        }
      }
    });
  });

  // 5. Extract from paragraph beginnings (fallback)
  if (subtopics.length < 4) {
    const paragraphs = cleanContent.split(/\n\s*\n/).filter(p => p.trim().length > 40);
    paragraphs.slice(0, 8).forEach(paragraph => {
      const sentences = paragraph.split(/[.!?]/);
      const firstSentence = sentences[0]?.trim();
      
      if (firstSentence && firstSentence.length > 20 && firstSentence.length < 120) {
        subtopics.push(firstSentence);
      }
    });
  }

  // Clean, deduplicate, and prioritize
  const cleanedSubtopics = subtopics
    .map(topic => {
      // Clean up the topic text
      return topic
        .replace(/[^\w\s\-'",.:]/g, '') // Keep basic punctuation
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    })
    .filter(topic => {
      // Filter criteria
      return topic.length > 10 && 
             topic.length < 150 && 
             !topic.toLowerCase().includes('click here') &&
             !topic.toLowerCase().includes('read more') &&
             !/^\d+$/.test(topic) && // Not just numbers
             topic.split(' ').length > 2; // At least 3 words
    })
    .filter((topic, index, array) => {
      // Remove duplicates and very similar topics
      return array.findIndex(t => {
        const similarity = t.toLowerCase() === topic.toLowerCase() || 
          (t.length > 20 && topic.length > 20 && 
           t.toLowerCase().includes(topic.toLowerCase().substring(0, 20)));
        return similarity;
      }) === index;
    })
    .slice(0, 8); // Allow up to 8 subtopics for richer mind maps

  return cleanedSubtopics;
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
