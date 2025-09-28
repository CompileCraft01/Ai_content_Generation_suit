export default  [
    {
        name:'Blog Title',
        desc:'An AI tool that generate blog title depends on yout blog information',
        category:'Blog',
        icon:'📝',
        aiPrompt:'Create 5 comprehensive blog topic ideas for the given niche and outline. For each topic, provide: 1) A compelling, SEO-optimized title (H2), 2) A detailed 3-4 sentence explanation of why this topic is valuable and engaging, 3) Target audience analysis, 4) 4-5 key points the blog should cover, 5) Suggested word count and tone. Format using HTML: <h1>Blog Topic Ideas for [Niche]</h1>, then for each idea use <h2> for titles, <p> for detailed explanations, <strong> for emphasis, <ul><li> for key points. Make each topic compelling with actionable insights and clear value propositions. Ensure comprehensive coverage with practical examples and expert-level depth.',
        slug:'generate-blog-title',
        form:[
            {
                label:'Enter your blog niche',
                field:'input',
                name:'niche',
                required:true
            },
            {
                label:'Enter blog outline',
                field:'textarea',
                name:'outline',
                
            }
        ]
    },
    {
        name: 'Blog Content',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        category: 'blog',
        icon: '📄',
        slug: 'blog-content-generation',
        aiPrompt: 'Create a comprehensive, engaging, and expertly crafted blog post based on the topic and outline. Structure the content as follows: 1) Compelling introduction with a strong hook, problem statement, and preview of what readers will learn, 2) Well-organized main sections with descriptive H2 headings, 3) Each section should include detailed explanations, real-world examples, statistics, and actionable insights, 4) Include practical tips, step-by-step guidance, and expert advice, 5) Add relevant quotes, case studies, or data points to support key arguments, 6) Strong conclusion with key takeaways and clear call-to-action. Format with HTML: <h1> for main title, <h2> for section headers, <h3> for subsections, <p> for paragraphs, <ul><li> for organized lists, <blockquote> for important quotes or insights, <strong> for key terms, <em> for emphasis. Aim for 1200-1500 words with comprehensive coverage, practical value, and engaging storytelling elements that keep readers interested throughout.',
        form: [
            {
                label: 'Enter your blog topic',
                field: 'input',
                name: 'topic',
                required:true
            },
            {
                label: 'Enter blog Outline here',
                field: 'textarea',
                name: 'outline'
            }
        ]
    },
    {
        name: 'Blog Topic Ideas',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        category: 'Blog',
        icon: '💡',
        slug: 'blog-topic-idea',
        aiPrompt: 'Generate 5 detailed and compelling blog topic ideas for the specified niche. For each topic, provide: 1) A catchy, SEO-optimized title that grabs attention, 2) A comprehensive 4-5 sentence description explaining the topic\'s value, relevance, and appeal to the target audience, 3) Detailed target audience analysis (demographics, pain points, interests), 4) Content structure suggestion with 5-6 main points to cover, 5) SEO keywords and phrases to target, 6) Estimated engagement potential and why it will perform well. Format using HTML: <h1>Top Blog Topic Ideas for [Niche]</h1>, then for each idea: <div class="topic-card"><h2>[Title]</h2><p><strong>Description:</strong> [detailed description]</p><p><strong>Target Audience:</strong> [analysis]</p><p><strong>Content Structure:</strong></p><ul><li>[point 1]</li><li>[point 2]</li>...</ul><p><strong>SEO Keywords:</strong> [keywords]</p><p><strong>Why It Works:</strong> [engagement analysis]</p></div>. Make each topic unique, valuable, and clearly differentiated with expert-level insights and practical appeal.',
        form: [
            {
                label: 'Enter your Niche',
                field: 'input',
                name: 'niche',
                required:true
            },
        ]
    },
    {
        name: 'Youtube SEO Title',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        category: 'Youtube Tools',
        icon: '🎥',
        slug: 'youtube-seo-title',
        aiPrompt: 'Create 5 highly optimized YouTube titles with comprehensive analysis and detailed explanations. For each title provide: 1) The SEO-optimized title (50-60 characters) designed for maximum click-through rate, 2) Detailed explanation of why this title works (psychology, keywords, hooks, emotional triggers), 3) SEO score breakdown with keyword density analysis, 4) Target audience appeal and demographic insights, 5) Suggested thumbnail concepts that complement the title, 6) Expected performance metrics and engagement predictions, 7) Variations for A/B testing. Format with HTML: <h1>YouTube SEO Title Analysis</h1>, then for each title: <div class="title-analysis"><h2>[Title]</h2><div class="explanation"><h3>Why This Title Works:</h3><p>[detailed psychological and SEO analysis]</p></div><div class="seo-metrics"><h3>SEO Analysis:</h3><ul><li>Primary Keywords: [list]</li><li>Secondary Keywords: [list]</li><li>Emotional Triggers: [analysis]</li><li>Character Count: [count]</li></ul></div><div class="audience"><h3>Target Audience:</h3><p>[demographic and psychographic analysis]</p></div><div class="thumbnail"><h3>Thumbnail Suggestions:</h3><p>[detailed thumbnail concepts]</p></div><div class="performance"><h3>Expected Performance:</h3><p>[engagement predictions with reasoning]</p></div></div>. Include trending keywords, viral elements, and platform-specific optimization strategies.',
        form: [
            {
                label: 'Enter your youtube video topic keyowords',
                field: 'input',
                name: 'keywords',
                required:true
            },
            {
                label: 'Enter youtube description Outline here',
                field: 'textarea',
                name: 'outline'
            }
        ]

    },
    {

        name: 'Youtube Description',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        category: 'Youtube Tool',
        icon: '📺',
        slug: 'youtube-description',
        aiPrompt: 'Create a comprehensive, engaging YouTube description optimized for discovery and engagement. Include: 1) Compelling hook in the first 2 lines to grab attention and encourage clicks, 2) Detailed video overview explaining exactly what viewers will learn and the value they\'ll get, 3) Structured content breakdown with timestamps (e.g., 0:00 Introduction, 2:30 Main Topic, etc.), 4) Strategic keyword integration for SEO without keyword stuffing, 5) Clear call-to-action sections encouraging likes, subscribes, and comments, 6) Relevant social media links and related video suggestions, 7) Strategic emoji usage to enhance readability and engagement, 8) Hashtags section with trending and relevant tags. Format with HTML: <div class="description-section"><h2>Video Description</h2><p><strong>Hook:</strong> [engaging opening lines]</p><p><strong>Overview:</strong> [detailed description of value and content]</p><div class="timestamps"><h3>What You\'ll Learn:</h3><ul><li>[timestamp] - [topic]</li><li>[timestamp] - [topic]</li></ul></div><div class="cta"><h3>Engagement:</h3><p>[call-to-action text with emojis]</p></div><div class="hashtags"><h3>Tags:</h3><p>[relevant hashtags]</p></div></div>. Aim for 150-200 words with high engagement potential and SEO optimization.',
        form: [
            {
                label: 'Enter your blog topic/title',
                field: 'input',
                name: 'topic',
                required:true
            },
            {
                label: 'Enter youtube Outline here',
                field: 'textarea',
                name: 'outline'
            }
        ]
    },
    {
        name: 'Youtube Tags',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        category: 'Youtube Tool',
        icon: '🏷',
        slug: 'youtube-tag',

        aiPrompt: 'Generate a comprehensive YouTube tag strategy with 15-20 optimized tags based on the title and outline. Provide: 1) Primary tags (3-5) - high-volume, directly related keywords, 2) Secondary tags (5-7) - long-tail keywords and specific phrases, 3) Trending tags (3-5) - current trending topics related to your content, 4) Niche tags (3-5) - specific to your target audience and community, 5) Competitive tags (2-3) - tags used by successful similar videos. For each category, explain why these tags work and their strategic purpose. Format with HTML: <h1>YouTube Tag Strategy</h1><div class="tag-category"><h2>Primary Tags (High Volume)</h2><ul><li><strong>[tag]</strong> - [explanation of why this tag works]</li></ul></div><div class="tag-category"><h2>Secondary Tags (Long-tail)</h2><ul><li><strong>[tag]</strong> - [search volume and competition analysis]</li></ul></div><div class="tag-category"><h2>Trending Tags</h2><ul><li><strong>[tag]</strong> - [trending analysis and relevance]</li></ul></div><div class="tag-category"><h2>Niche-Specific Tags</h2><ul><li><strong>[tag]</strong> - [audience targeting explanation]</li></ul></div><div class="tag-category"><h2>Competitive Tags</h2><ul><li><strong>[tag]</strong> - [competitor analysis]</li></ul></div>. Include search volume estimates and strategic recommendations for maximum discoverability.',

        form: [
            {
                label: 'Enter your youtube title',
                field: 'input',
                name: 'title',
                required:true
            },
            {
                label: 'Enter youtube video Outline here (Optional)',
                field: 'textarea',
                name: 'outline'
            }
        ]
    },

    {
        name: 'Rewrite Article (Plagiarism Free)',
        desc: 'Use this tool to rewrite existing Article or Blog Post which can bypass AI detectors and also make it plagiarism free.',
        icon: '✏',
        category: 'Rewriting Tool',
        slug: 'rewrite-article',
        aiPrompt: 'Completely rewrite and transform the provided article into original, plagiarism-free content while maintaining the core message and value. Process: 1) Analyze the original structure and key points, 2) Create a new outline with fresh angles and perspectives, 3) Rewrite each section using completely different sentence structures, vocabulary, and examples, 4) Add new insights, updated information, and additional value not present in the original, 5) Incorporate fresh examples, case studies, and analogies, 6) Enhance the content with improved transitions, better flow, and engaging elements, 7) Ensure 100% originality while preserving the educational value. Format with HTML: <h1>[New Creative Title]</h1>, then use <h2> for main sections, <h3> for subsections, <p> for paragraphs, <ul><li> for lists, <blockquote> for highlighted insights, <strong> for key terms. The rewritten version should be significantly different in expression while being more comprehensive, engaging, and valuable than the original. Add expert-level insights and make it feel like completely new content written by a different author.',
        form: [
            {
                label: '🤖 Provide your Article/Blogpost or any other content to rewrite.',
                field: 'textarea',
                name: 'article',
                required:true
            }
        ]
    },
    {
        name: 'Text Improver',
        desc: 'This handy tool refines your writing, eliminating errors and redundancies for a clear, readable result. It also offers a comprehensive tone analysis and suggests better word choices.',
        icon: '✨',
        category: 'Writing Assistant',
        slug: 'text-improver',
        aiPrompt: 'Transform the provided text into polished, professional, and compelling content. Improvements include: 1) Grammar and syntax perfection with error-free language, 2) Enhanced vocabulary using sophisticated yet accessible word choices, 3) Improved sentence structure with varied length and rhythm for better readability, 4) Professional tone adjustment appropriate for the intended audience, 5) Clarity enhancement by removing ambiguity and redundancy, 6) Flow improvement with better transitions and logical progression, 7) Engagement boost through stronger opening, compelling examples, and persuasive language, 8) Formatting optimization for better visual presentation and scannability. Format with HTML: <div class="improved-content"><h2>Enhanced Version</h2><p>[improved content with proper structure]</p></div><div class="improvements-made"><h3>Key Improvements:</h3><ul><li><strong>Grammar & Style:</strong> [specific improvements made]</li><li><strong>Clarity:</strong> [how clarity was enhanced]</li><li><strong>Professional Tone:</strong> [tone adjustments made]</li><li><strong>Engagement:</strong> [elements added for better engagement]</li></ul></div>. The result should be significantly more professional, clear, and impactful than the original while maintaining the core message and intent.',
        form: [
            {
                label: 'Enter text that you want to re-write or improve',
                field: 'textarea',
                name: 'textToImprove'
            }
        ]
    },
    {
        name: 'Add Emojis to Text',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        icon: '😊',
        category: 'blog',
        slug: 'add-emoji-to-text',
        aiPrompt: 'Transform the provided text by strategically adding emojis to enhance engagement, readability, and visual appeal. Process: 1) Analyze the text tone and context to select appropriate emojis, 2) Add relevant emojis that complement and enhance the message without overwhelming it, 3) Use emojis to break up text blocks and improve scannability, 4) Include emojis that reinforce key points and emotions, 5) Ensure emoji placement feels natural and adds value, 6) Consider cultural appropriateness and universal understanding, 7) Balance emoji usage for professional yet engaging tone. Format with HTML: <div class=\"emoji-enhanced-content\"><h2>Enhanced Text with Emojis</h2><div class=\"enhanced-text\"><p>[text with strategically placed emojis]</p></div></div><div class=\"emoji-strategy\"><h2>Emoji Strategy Used</h2><div class=\"emoji-analysis\"><h3>Emoji Placement Strategy:</h3><ul><li><strong>Opening Impact:</strong> [how opening emojis grab attention]</li><li><strong>Content Enhancement:</strong> [how emojis support the message]</li><li><strong>Emotional Connection:</strong> [emojis that create emotional resonance]</li><li><strong>Visual Breaks:</strong> [how emojis improve readability]</li></ul></div><div class=\"engagement-boost\"><h3>Engagement Benefits:</h3><ul><li>[how emojis increase engagement]</li><li>[psychological impact of emoji usage]</li><li>[platform-specific benefits]</li></ul></div></div><div class=\"usage-tips\"><h2>Emoji Usage Best Practices</h2><ul><li><strong>Context Appropriateness:</strong> [why these emojis work for this content]</li><li><strong>Audience Consideration:</strong> [how emojis appeal to target audience]</li><li><strong>Platform Optimization:</strong> [how to adapt for different social platforms]</li></ul></div>. Ensure emojis enhance rather than distract from the core message while maintaining professionalism and cultural sensitivity.',
        form: [
            {
                label: 'Enter your text to add emojis',
                field: 'textarea',
                name: 'outline',
                required:true
            }
        ]
    },
    {
        name: 'Instagram Post Generator',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        icon: '📸',
        category: 'blog',
       
        slug: 'instagram-post-generator',
        aiPrompt: 'Create 3 highly engaging Instagram posts based on the provided keywords. For each post provide: 1) Compelling caption with strong hook in the first line to stop the scroll, 2) Storytelling elements that create emotional connection with the audience, 3) Strategic hashtag integration (8-12 relevant hashtags), 4) Call-to-action that encourages engagement (comments, saves, shares), 5) Visual content suggestions including photo/video concepts, 6) Best posting time recommendations, 7) Engagement strategy and conversation starters. Format with HTML: <div class="instagram-post"><h2>Post [Number]: [Theme/Topic]</h2><div class="caption"><h3>Caption:</h3><p>[engaging caption with emojis and line breaks]</p></div><div class="hashtags"><h3>Hashtags:</h3><p>[strategic hashtag mix]</p></div><div class="visual"><h3>Visual Concept:</h3><p>[detailed visual content suggestions]</p></div><div class="engagement"><h3>Engagement Strategy:</h3><p>[how to maximize engagement]</p></div><div class="timing"><h3>Best Time to Post:</h3><p>[optimal posting time with reasoning]</p></div></div>. Each post should be unique, valuable, and designed for maximum engagement and reach on Instagram\'s algorithm.',
        form: [
            {
                label: 'Enter Keywords for your post',
                field: 'input',
                name: 'keywords',
                required:true
            },
           
        ]
    },
    {
        name: 'Instagram Hash Tag Generator',
        desc: 'An AI tool that serves as your personal blog post title writer, generating catchy and viral-worthy titles in your chosen language.',
        icon: '#️⃣',
        category: 'blog',
       
        slug: 'instagram-hash-tag-generator',
        aiPrompt: 'Generate a comprehensive Instagram hashtag strategy with 20-25 strategic hashtags based on the keywords. Organize into categories: 1) High-volume hashtags (3-5) - popular tags with millions of posts, 2) Medium-volume hashtags (8-10) - moderately popular with good engagement, 3) Low-volume hashtags (5-7) - niche-specific with higher engagement rates, 4) Branded/community hashtags (2-3) - for building community, 5) Trending hashtags (2-3) - current trends related to your content. For each category, explain the strategy and expected results. Format with HTML: <h1>Instagram Hashtag Strategy</h1><div class="hashtag-strategy"><h2>Complete Hashtag Set</h2><p class="hashtag-list">[all hashtags in copy-ready format]</p></div><div class="category-breakdown"><h2>Strategic Breakdown</h2><div class="high-volume"><h3>High-Volume Hashtags (1M+ posts)</h3><ul><li><strong>#[hashtag]</strong> - [volume and purpose]</li></ul><p><strong>Strategy:</strong> [why these work for reach]</p></div><div class="medium-volume"><h3>Medium-Volume Hashtags (100K-1M posts)</h3><ul><li><strong>#[hashtag]</strong> - [engagement potential]</li></ul><p><strong>Strategy:</strong> [balance of reach and engagement]</p></div><div class="low-volume"><h3>Niche Hashtags (10K-100K posts)</h3><ul><li><strong>#[hashtag]</strong> - [targeted audience]</li></ul><p><strong>Strategy:</strong> [higher engagement rates explanation]</p></div></div><div class="usage-tips"><h2>Usage Recommendations</h2><ul><li>Mix ratios for optimal performance</li><li>Hashtag placement strategy</li><li>Rotation schedule to avoid shadowbanning</li></ul></div>. Include engagement predictions and performance optimization tips.',
        form: [
            {
                label: 'Enter Keywords for your instagram hastag',
                field: 'input',
                name: 'keywords',
                required:true
            },
           
        ]
    },
    {
        name: 'Instagram Post/Reel Idea',
        desc: 'An AI tool that generate New and trending instagram idea depends on your niche',
        icon: '🎬',
        category: 'instagram',
       
        slug: 'instagram-post-idea-generator',
        aiPrompt: 'Generate 8-10 trending Instagram post and reel ideas based on the niche/keywords with current trends and viral potential. For each idea provide: 1) Content concept with detailed execution plan, 2) Trending audio/music suggestions for reels, 3) Visual style and aesthetic recommendations, 4) Hook and caption strategy for maximum engagement, 5) Hashtag strategy tailored to the specific content, 6) Call-to-action that drives engagement, 7) Viral potential analysis and why it will perform well, 8) Target audience appeal and demographics. Format with HTML: <h1>Trending Instagram Content Ideas for [Niche]</h1><div class="content-idea"><h2>Idea [Number]: [Catchy Title]</h2><div class="concept"><h3>Content Concept:</h3><p>[detailed execution plan]</p></div><div class="format"><h3>Content Format:</h3><p><strong>Type:</strong> [Post/Reel/Carousel]</p><p><strong>Style:</strong> [visual style]</p><p><strong>Duration:</strong> [if reel, optimal length]</p></div><div class="trending-elements"><h3>Trending Elements:</h3><ul><li><strong>Audio:</strong> [trending sound suggestions]</li><li><strong>Visual Trend:</strong> [current visual trends to incorporate]</li><li><strong>Hashtags:</strong> [trending hashtags to use]</li></ul></div><div class="engagement-hook"><h3>Hook Strategy:</h3><p>[first 3 seconds strategy for reels or opening line for posts]</p></div><div class="viral-potential"><h3>Why This Will Go Viral:</h3><p>[analysis of viral elements and appeal]</p></div></div>. Focus on current trends, relatable content, and high engagement potential with actionable execution details.',
        form: [
            {
                label: 'Enter Keywords / Niche for your instagram idea',
                field: 'input',
                name: 'keywords',
                required:true
            },
           
        ]
    },
    {
        name: 'English Grammer Check',
        desc: 'AI Model to Correct your english grammer by providing the text',
        icon:'📖',
        category: 'english',
       
        slug: 'english-grammer-checker',
        aiPrompt: 'Provide comprehensive English language correction and enhancement for the input text. Analysis and corrections include: 1) Grammar corrections with explanations of errors found, 2) Spelling and punctuation fixes, 3) Sentence structure improvements for better clarity and flow, 4) Word choice enhancements for more precise and professional language, 5) Style consistency and tone improvement, 6) Clarity enhancements to eliminate ambiguity, 7) Readability improvements with better paragraph structure. Format with HTML: <div class="grammar-analysis"><h2>Corrected Text</h2><div class="corrected-version"><p>[perfectly corrected and enhanced text]</p></div></div><div class="corrections-made"><h2>Corrections and Improvements</h2><div class="grammar-fixes"><h3>Grammar Corrections:</h3><ul><li><strong>Original:</strong> [error] → <strong>Corrected:</strong> [fix] - <em>[explanation]</em></li></ul></div><div class="style-improvements"><h3>Style Enhancements:</h3><ul><li><strong>Enhancement:</strong> [improvement made] - <em>[why this is better]</em></li></ul></div><div class="word-choice"><h3>Word Choice Improvements:</h3><ul><li><strong>Changed:</strong> [original word] → [better word] - <em>[reasoning]</em></li></ul></div></div><div class="language-tips"><h2>Writing Tips</h2><p>[personalized suggestions for better writing based on the errors found]</p></div>. Provide educational value by explaining why changes were made and how to avoid similar errors in the future.',
        form: [
            {
                label: 'Enter text to correct the grammer',
                field: 'input',
                name: 'inputText',
                required:true
            },
           
        ]
    },
    {
        name: 'Write Code',
        desc: 'AI Model to generate programming code in any language',
        icon:'💻',
        category: 'Coding',
       
        slug: 'write-code',
        aiPrompt: 'Generate comprehensive, well-documented code based on the user\'s description. Provide: 1) Complete, functional code with proper syntax and structure, 2) Detailed line-by-line explanations of what each section does, 3) Code comments explaining complex logic and algorithms, 4) Multiple implementation approaches with pros and cons, 5) Error handling and edge case considerations, 6) Performance optimization suggestions, 7) Best practices and coding standards, 8) Usage examples and test cases, 9) Dependencies and setup requirements. Format with HTML: <div class="code-solution"><h2>Complete Code Solution</h2><div class="main-code"><h3>Implementation:</h3><pre><code>[clean, well-formatted code with comments]</code></pre></div></div><div class="code-explanation"><h2>Code Explanation</h2><div class="line-by-line"><h3>Line-by-Line Breakdown:</h3><ul><li><strong>Lines [X-Y]:</strong> [detailed explanation of code section]</li></ul></div><div class="logic-explanation"><h3>Algorithm & Logic:</h3><p>[detailed explanation of the approach and reasoning]</p></div></div><div class="alternatives"><h2>Alternative Approaches</h2><div class="approach"><h3>Approach 2: [Name]</h3><pre><code>[alternative implementation]</code></pre><p><strong>Pros:</strong> [advantages]</p><p><strong>Cons:</strong> [disadvantages]</p></div></div><div class="best-practices"><h2>Best Practices & Optimization</h2><ul><li>[coding best practices applied]</li><li>[performance considerations]</li><li>[security considerations if applicable]</li></ul></div><div class="usage-examples"><h2>Usage Examples</h2><pre><code>[example usage with expected outputs]</code></pre></div>. Ensure code is production-ready, well-documented, and follows industry standards.',
        form: [
            {
                label: 'Enter description of code you want along with Programming Lang',
                field: 'textarea',
                name: 'codeDesscripton',
                required:true
            },
           
        ]
    },
    {
        name: 'Explain Code',
        desc: 'AI Model to explain programming code in any language',
        icon:'🔍',
        category: 'Coding',
       
        slug: 'explain-code',
        aiPrompt: 'Provide comprehensive, educational explanation of the provided code. Include: 1) Overall purpose and functionality summary, 2) Detailed line-by-line breakdown with clear explanations, 3) Algorithm and logic flow analysis, 4) Variable and function purpose explanations, 5) Code structure and design pattern identification, 6) Performance analysis and complexity assessment, 7) Potential improvements and optimizations, 8) Security considerations and best practices, 9) Common use cases and applications, 10) Related concepts and learning resources. Format with HTML: <div class="code-analysis"><h2>Code Overview</h2><div class="original-code"><h3>Original Code:</h3><pre><code>[formatted original code]</code></pre></div><div class="purpose"><h3>Purpose & Functionality:</h3><p>[comprehensive explanation of what the code does]</p></div></div><div class="detailed-explanation"><h2>Detailed Code Breakdown</h2><div class="line-analysis"><h3>Line-by-Line Analysis:</h3><ul><li><strong>Line [number]:</strong> <code>[code snippet]</code><br><em>[detailed explanation of what this line does and why]</em></li></ul></div><div class="logic-flow"><h3>Algorithm & Logic Flow:</h3><ol><li>[step-by-step process explanation]</li></ol></div></div><div class="technical-analysis"><h2>Technical Analysis</h2><div class="variables-functions"><h3>Variables & Functions:</h3><ul><li><strong>[name]:</strong> [purpose and usage]</li></ul></div><div class="patterns"><h3>Design Patterns & Structure:</h3><p>[identification of patterns and architectural decisions]</p></div><div class="complexity"><h3>Performance & Complexity:</h3><p><strong>Time Complexity:</strong> [analysis]</p><p><strong>Space Complexity:</strong> [analysis]</p></div></div><div class="improvements"><h2>Suggestions & Best Practices</h2><ul><li><strong>Potential Improvements:</strong> [optimization suggestions]</li><li><strong>Best Practices:</strong> [coding standards and conventions]</li><li><strong>Security Considerations:</strong> [security implications if any]</li></ul></div><div class="learning-resources"><h2>Related Concepts & Learning</h2><p>[explanation of related programming concepts and where to learn more]</p></div>. Make explanations beginner-friendly while maintaining technical accuracy.',
        form: [
            {
                label: 'Enter code which you want to understand',
                field: 'textarea',
                name: 'codeDesscripton',
                required:true
            },
           
        ]
    },
    {
        name: 'Code Bug Detector',
        desc: 'This tool analyzes your input, like error messages and code snippets, to pinpoint and fix bugs, offering detailed solutions and alternatives in a straightforward, user-friendly way.',
        icon:'🐛',
        category: 'code-bug-detector',
       
        slug: 'code-bug-detector',
        aiPrompt: 'Perform comprehensive code debugging and provide detailed solutions. Analysis includes: 1) Bug identification with specific line numbers and error types, 2) Root cause analysis explaining why each bug occurs, 3) Step-by-step solution with corrected code, 4) Multiple fix approaches with trade-offs, 5) Prevention strategies to avoid similar bugs, 6) Code quality improvements and refactoring suggestions, 7) Testing recommendations to catch future issues, 8) Performance impact analysis of fixes. Format with HTML: <div class="bug-analysis"><h2>Bug Detection Report</h2><div class="original-code"><h3>Original Code (with issues):</h3><pre><code>[original code with line numbers]</code></pre></div></div><div class="bugs-found"><h2>Bugs Identified</h2><div class="bug-item"><h3>Bug #[number]: [Bug Type]</h3><p><strong>Location:</strong> Line [number]</p><p><strong>Issue:</strong> [detailed description of the problem]</p><p><strong>Root Cause:</strong> [explanation of why this bug occurs]</p><p><strong>Impact:</strong> [consequences of this bug]</p></div></div><div class="solutions"><h2>Solutions & Fixes</h2><div class="primary-solution"><h3>Recommended Fix:</h3><pre><code>[corrected code with improvements]</code></pre><p><strong>Explanation:</strong> [why this solution works]</p></div><div class="alternative-solutions"><h3>Alternative Approaches:</h3><div class="alternative"><h4>Approach [number]:</h4><pre><code>[alternative fix]</code></pre><p><strong>Pros:</strong> [advantages]</p><p><strong>Cons:</strong> [disadvantages]</p></div></div></div><div class="improvements"><h2>Code Quality Improvements</h2><ul><li><strong>Refactoring Suggestions:</strong> [structural improvements]</li><li><strong>Best Practices:</strong> [coding standards to follow]</li><li><strong>Error Handling:</strong> [exception handling improvements]</li><li><strong>Performance Optimizations:</strong> [efficiency improvements]</li></ul></div><div class="prevention"><h2>Bug Prevention Strategies</h2><ul><li>[strategies to prevent similar bugs]</li><li>[testing approaches]</li><li>[code review checklist items]</li></ul></div><div class="testing"><h2>Testing Recommendations</h2><pre><code>[test cases to verify the fixes]</code></pre></div>. Provide educational value by explaining debugging methodology and best practices.',
        form: [
            {
                label: 'Enter code which you want to test bug',
                field: 'textarea',
                name: 'codeInput',
                required:true
            },
           
        ]
    },
    {
        name: 'Tagline Generator',
        desc: 'Struggling to find the perfect tagline for your brand? Let our AI-tool assist you in creating a tagline that stands out.',
        icon:'🎯',
        category: 'Marketting',
       
        slug: 'tagline-generator',
        aiPrompt: 'Create 8-12 powerful, memorable taglines for the business/product with comprehensive analysis. For each tagline provide: 1) The tagline with explanation of its appeal and messaging strategy, 2) Target audience analysis and emotional impact, 3) Brand positioning and differentiation strategy, 4) Memorability and recall factors, 5) Versatility across different marketing channels, 6) Competitive advantage highlighting, 7) Psychological triggers and persuasion elements used. Format with HTML: <h1>Brand Tagline Strategy for [Product Name]</h1><div class="tagline-collection"><h2>Recommended Taglines</h2><div class="tagline-option"><h3>Option [number]: "[Tagline]"</h3><div class="analysis"><p><strong>Core Message:</strong> [what this tagline communicates]</p><p><strong>Emotional Appeal:</strong> [how it makes customers feel]</p><p><strong>Target Audience:</strong> [who this resonates with most]</p><p><strong>Unique Selling Point:</strong> [what differentiates the brand]</p><p><strong>Memorability Factor:</strong> [why customers will remember this]</p><p><strong>Marketing Applications:</strong> [where this works best - ads, website, packaging]</p></div><div class="psychological-elements"><h4>Psychological Triggers:</h4><ul><li>[trigger 1 and why it works]</li><li>[trigger 2 and its impact]</li></ul></div></div></div><div class="tagline-categories"><h2>Tagline Categories</h2><div class="category"><h3>Emotional Appeal Taglines:</h3><ul><li>"[tagline]" - [emotional connection explanation]</li></ul></div><div class="category"><h3>Benefit-Focused Taglines:</h3><ul><li>"[tagline]" - [benefit highlighting strategy]</li></ul></div><div class="category"><h3>Brand Personality Taglines:</h3><ul><li>"[tagline]" - [personality traits conveyed]</li></ul></div></div><div class="implementation-guide"><h2>Implementation Strategy</h2><p><strong>Primary Recommendation:</strong> [best tagline choice with reasoning]</p><p><strong>Usage Guidelines:</strong> [how to use across different channels]</p><p><strong>Testing Approach:</strong> [how to test effectiveness with target audience]</p></div>. Ensure taglines are memorable, differentiated, and aligned with brand values while being legally safe and culturally appropriate.',
        form: [
            {
                label: 'Product/Brand Name',
                field: 'input',
                name: 'productName',
                required:true
            },
            {
                label: 'What you are selling / Marketting',
                field: 'textarea',
                name: 'outline',
                required:true
            },
           
        ]
    },
    {
        name: 'Product Description',
        desc: 'This is your AI-powered SEO expert, creating captivating and keyword-rich e-commerce product descriptions to boost your online sales.',
        icon:'🛍',
        category: 'Marketting',
       
        slug: 'product-description',
        aiPrompt: 'Create a comprehensive, conversion-optimized e-commerce product description that drives sales. Include: 1) Compelling headline that captures attention and highlights the main benefit, 2) Detailed product overview with key features and specifications, 3) Benefit-focused bullet points that address customer pain points, 4) Emotional storytelling that connects with customer desires, 5) Social proof elements and credibility indicators, 6) SEO-optimized content with relevant keywords, 7) Clear call-to-action and urgency elements, 8) Technical specifications in an organized format, 9) Usage scenarios and target customer identification. Format with HTML: <div class="product-description"><h1>[Compelling Product Headline]</h1><div class="product-overview"><h2>Product Overview</h2><p>[engaging description that tells a story and creates desire]</p></div></div><div class="key-benefits"><h2>Why Customers Love This Product</h2><ul><li><strong>[Benefit 1]:</strong> [detailed explanation with customer impact]</li><li><strong>[Benefit 2]:</strong> [how this solves customer problems]</li><li><strong>[Benefit 3]:</strong> [unique advantage over competitors]</li></ul></div><div class="features-specs"><h2>Features & Specifications</h2><div class="feature-grid"><div class="feature"><h3>[Feature Name]</h3><p>[detailed feature description and customer value]</p></div></div><div class="technical-specs"><h3>Technical Specifications:</h3><ul><li><strong>[Spec 1]:</strong> [value]</li><li><strong>[Spec 2]:</strong> [value]</li></ul></div></div><div class="usage-scenarios"><h2>Perfect For</h2><ul><li>[usage scenario 1 with target customer]</li><li>[usage scenario 2 with specific benefits]</li></ul></div><div class="social-proof"><h2>What Customers Say</h2><blockquote>"[testimonial-style language that builds trust]"</blockquote></div><div class="guarantee-cta"><h2>Your Satisfaction Guaranteed</h2><p>[trust-building guarantee language]</p><p><strong>[Call-to-Action]: [Action-oriented text with urgency]</strong></p></div><div class="seo-keywords"><h3>SEO Elements Included:</h3><p>[relevant keywords naturally integrated for search optimization]</p></div>. Focus on conversion optimization, emotional connection, and addressing customer objections while maintaining authentic and trustworthy tone.',
        form: [
            {
                label: 'Product Name',
                field: 'input',
                name: 'productName',
                required:true
            },
            {
                label: 'Product Details',
                field: 'textarea',
                name: 'outline',
                required:true
            },
           
        ]
    },
    
    // LESSON PLANS TEMPLATES
    {
        name: 'Detailed Lesson Plan Creator',
        desc: 'Create comprehensive, standards-aligned lesson plans with learning objectives, activities, and assessments for any subject and grade level.',
        icon: '📚',
        category: 'Education',
        slug: 'lesson-plan-creator',
        aiPrompt: 'Create a comprehensive lesson plan with detailed structure. Include: 1) Lesson title and overview with duration, 2) Clear learning objectives using Bloom\'s taxonomy, 3) Standards alignment, 4) Required materials list, 5) Step-by-step lesson structure with timing (opening, instruction, practice, closure), 6) Differentiated instruction strategies, 7) Assessment methods and rubrics, 8) Extension activities, 9) Homework assignments. Format with HTML: use <h1> for title, <h2> for main sections, <h3> for subsections, <ul><li> for lists, <p> for descriptions, <strong> for emphasis. Make it practical and educationally sound with clear progression.',
        form: [
            {
                label: 'Subject Area',
                field: 'input',
                name: 'subject',
                required: true
            },
            {
                label: 'Grade Level',
                field: 'input',
                name: 'gradeLevel',
                required: true
            },
            {
                label: 'Lesson Topic',
                field: 'input',
                name: 'topic',
                required: true
            },
            {
                label: 'Lesson Duration (minutes)',
                field: 'input',
                name: 'duration'
            },
            {
                label: 'Specific Learning Goals (Optional)',
                field: 'textarea',
                name: 'goals'
            }
        ]
    },

    // ASSESSMENTS TEMPLATES
    {
        name: 'Comprehensive Assessment Creator',
        desc: 'Generate detailed assessments, quizzes, and rubrics with multiple question types, answer keys, and scoring guides for any subject.',
        icon: '📝',
        category: 'Education',
        slug: 'assessment-creator',
        aiPrompt: 'Create a comprehensive assessment with diverse question types. Include: 1) Assessment title and clear instructions, 2) Multiple choice questions (4-5), 3) True/false questions (3-4), 4) Short answer questions (3-4), 5) Essay questions (1-2), 6) Detailed answer key with explanations, 7) Scoring rubric with performance levels, 8) Time allocation suggestions, 9) Accommodations for diverse learners. Format with HTML: use <h1> for title, <h2> for sections, <h3> for question types, <ul><li> for options, <strong> for emphasis, <table> for rubrics. Ensure questions are fair and appropriately challenging.',
        form: [
            {
                label: 'Subject Area',
                field: 'input',
                name: 'subject',
                required: true
            },
            {
                label: 'Assessment Topic',
                field: 'input',
                name: 'topic',
                required: true
            },
            {
                label: 'Grade Level',
                field: 'input',
                name: 'gradeLevel',
                required: true
            },
            {
                label: 'Assessment Type (Quiz, Test, Project, etc.)',
                field: 'input',
                name: 'assessmentType'
            },
            {
                label: 'Specific Learning Objectives to Assess',
                field: 'textarea',
                name: 'objectives'
            }
        ]
    },

    // CODE TEMPLATES
    {
        name: 'Advanced Code Generator',
        desc: 'Generate production-ready code with documentation, testing, and best practices for any programming language and project type.',
        icon: '💻',
        category: 'Programming',
        slug: 'advanced-code-generator',
        aiPrompt: 'Generate comprehensive, production-ready code. Include: 1) Complete functional code with proper architecture, 2) Detailed inline documentation and comments, 3) Error handling and input validation, 4) Unit tests with multiple test cases, 5) Performance optimizations, 6) Setup and configuration instructions, 7) Usage examples with sample inputs/outputs, 8) Dependencies and requirements list, 9) API documentation if applicable, 10) Best practices implementation. Format with HTML: use <h1> for title, <h2> for sections, <pre><code> for code blocks, <ul><li> for lists, <strong> for emphasis. Ensure code is secure, efficient, and follows industry standards.',
        form: [
            {
                label: 'Programming Language',
                field: 'input',
                name: 'language',
                required: true
            },
            {
                label: 'Project Description',
                field: 'textarea',
                name: 'description',
                required: true
            },
            {
                label: 'Specific Requirements & Features',
                field: 'textarea',
                name: 'requirements',
                required: true
            },
            {
                label: 'Complexity Level (Beginner/Intermediate/Advanced)',
                field: 'input',
                name: 'complexity'
            },
            {
                label: 'Framework/Libraries to Use (Optional)',
                field: 'input',
                name: 'frameworks'
            }
        ]
    },

    // BUSINESS DOCUMENTS TEMPLATES
    {
        name: 'Professional Business Document Creator',
        desc: 'Generate comprehensive business documents including proposals, reports, memos, policies, and strategic plans with professional formatting.',
        icon: '📋',
        category: 'Business',
        slug: 'business-document-creator',
        aiPrompt: 'Create a professional business document with comprehensive content. Include: 1) Professional header with company info and recipient details, 2) Executive summary with key points and recommendations, 3) Detailed content in logical sections with clear headings, 4) Data-driven insights with analysis, 5) Actionable recommendations with timelines, 6) Risk assessment and mitigation strategies, 7) Financial implications and cost-benefit analysis, 8) Clear conclusion with next steps, 9) Supporting documentation references. Format with HTML: use <h1> for title, <h2> for main sections, <h3> for subsections, <table> for data, <ul><li> for lists, <strong> for emphasis. Ensure professional tone and actionable insights.',
        form: [
            {
                label: 'Document Type (Proposal, Report, Memo, Policy, etc.)',
                field: 'input',
                name: 'documentType',
                required: true
            },
            {
                label: 'Document Title/Subject',
                field: 'input',
                name: 'title',
                required: true
            },
            {
                label: 'Target Audience (Executives, Board, Employees, etc.)',
                field: 'input',
                name: 'audience'
            },
            {
                label: 'Document Purpose & Objectives',
                field: 'textarea',
                name: 'purpose',
                required: true
            },
            {
                label: 'Key Information & Context',
                field: 'textarea',
                name: 'context',
                required: true
            }
        ]
    },

    // PRESENTATION TEMPLATES
    {
        name: 'Professional PowerPoint Presentation Creator',
        desc: 'Generate comprehensive PowerPoint presentations with detailed slide content, speaker notes, and visual design suggestions for any topic or audience.',
        icon: '📊',
        category: 'Presentations',
        slug: 'powerpoint-presentation-creator',
        aiPrompt: 'Create a comprehensive PowerPoint presentation with 8-12 detailed slides. Include: 1) Compelling title slide with subtitle and presenter info, 2) Agenda/outline slide with clear structure, 3) Problem statement or introduction slide with compelling hook, 4) Main content slides (5-8 slides) with clear hierarchy and detailed bullet points, 5) Supporting data slides with charts/graphs suggestions, 6) Solution or conclusion slides with actionable insights, 7) Call-to-action or next steps slide, 8) Thank you/Q&A slide. For each slide provide: detailed content, speaker notes (2-3 sentences), visual design suggestions, and slide transitions. Format with HTML: <div class="presentation-overview"><h1>[Presentation Title]</h1><p><strong>Duration:</strong> [estimated time]</p><p><strong>Target Audience:</strong> [audience analysis]</p><p><strong>Key Objectives:</strong> [main goals]</p></div><div class="slide-deck"><div class="slide"><h2>Slide [Number]: [Slide Title]</h2><div class="slide-content"><h3>Main Content:</h3><ul><li>[detailed bullet points with explanations]</li></ul></div><div class="speaker-notes"><h3>Speaker Notes:</h3><p>[detailed speaking points and timing guidance]</p></div><div class="visual-suggestions"><h3>Visual Design:</h3><p><strong>Layout:</strong> [layout recommendation]</p><p><strong>Images/Icons:</strong> [specific visual suggestions]</p><p><strong>Colors/Fonts:</strong> [design recommendations]</p></div><div class="slide-timing"><h3>Estimated Time:</h3><p>[time allocation for this slide]</p></div></div></div>. Ensure logical flow, engaging content, and professional design recommendations.',
        form: [
            {
                label: 'Presentation Topic/Title',
                field: 'input',
                name: 'topic',
                required: true
            },
            {
                label: 'Target Audience',
                field: 'input',
                name: 'audience',
                required: true
            },
            {
                label: 'Presentation Duration (minutes)',
                field: 'input',
                name: 'duration'
            },
            {
                label: 'Key Messages/Objectives',
                field: 'textarea',
                name: 'objectives',
                required: true
            },
            {
                label: 'Supporting Information/Context',
                field: 'textarea',
                name: 'context'
            },
            {
                label: 'Presentation Type (Business, Educational, Sales, etc.)',
                field: 'input',
                name: 'presentationType'
            }
        ]
    },

]