/**
 * Template service for SuperUI API Server
 * Handles template generation and conversation flow
 */

import { 
  processConversationStep, 
  ConversationState, 
  TemplateAnswers,
  getNextQuestion 
} from '../utils/template-conversation.js';

export interface TemplateRequest {
  message: string;
  conversationState?: ConversationState;
  absolutePathToCurrentFile: string;
  absolutePathToProjectDirectory: string;
  standaloneRequestQuery: string;
}

/**
 * Process template request and handle conversation flow
 * @param request - Template request from MCP server
 * @returns Conversation response or generated template
 */
export async function getTemplate(request: TemplateRequest): Promise<string> {
  const { message, conversationState, absolutePathToCurrentFile, absolutePathToProjectDirectory } = request;
  
  console.log(`🎨 Processing template request: ${message}`);
  
  // If no conversation state, start new conversation
  if (!conversationState) {
    return startNewTemplateConversation();
  }
  
  // If conversation is in progress, process the current step
  if (conversationState.currentStep <= 4) {
    return processTemplateConversation(conversationState, message);
  }
  
  // If conversation is complete, generate template
  return generateTemplateFromConversation(conversationState, absolutePathToProjectDirectory);
}

/**
 * Start a new template conversation
 * @returns First question in the conversation
 */
function startNewTemplateConversation(): string {
  return `
# 🎨 Landing Page Template Generator

Let's create a custom landing page template for you! I'll ask you a few questions to understand your needs and recommend the perfect sections and components.

## Question 1 of 4

**What is this landing page for?**

Please choose one of the following options:

1. **SaaS Product** - Software as a Service application
2. **Mobile App** - Mobile application or app store listing
3. **Ecommerce Product** - Online store or product showcase
4. **Personal Portfolio** - Personal website or portfolio
5. **Event** - Conference, workshop, or event page
6. **Other** - Something else (please specify)

Please respond with the number or name of your choice, and I'll ask the next question!
  `;
}

/**
 * Process the current conversation step
 * @param conversationState - Current conversation state
 * @param userAnswer - User's answer
 * @returns Next question or template result
 */
function processTemplateConversation(conversationState: ConversationState, userAnswer: string): string {
  const result = processConversationStep(conversationState, userAnswer);
  
  if (result.type === 'question') {
    const nextState = result.data as ConversationState;
    return generateNextQuestion(nextState);
  } else {
    return result.data as string;
  }
}

/**
 * Generate the next question in the conversation
 * @param conversationState - Updated conversation state
 * @returns Formatted next question
 */
function generateNextQuestion(conversationState: ConversationState): string {
  const { currentStep, totalSteps, answers } = conversationState;
  
  let questionText = '';
  let options: string[] = [];
  
  switch (currentStep) {
    case 2:
      questionText = "Who is your target audience?";
      options = ["Customers", "Investors", "Partners", "Job Applicants", "General Users"];
      break;
    case 3:
      questionText = "What action do you want visitors to take?";
      options = ["Sign up", "Request a demo", "Buy", "Subscribe to newsletter", "Contact you"];
      break;
    case 4:
      questionText = "What style or tone do you prefer?";
      options = ["Professional", "Friendly", "Creative", "Minimalist"];
      break;
  }
  
  return `
# 🎨 Landing Page Template Generator

## Question ${currentStep} of ${totalSteps}

**${questionText}**

Please choose one of the following options:

${options.map((option, index) => `${index + 1}. **${option}**`).join('\n')}

Please respond with the number or name of your choice, and I'll ask the next question!

---

**Previous answers:**
${Object.entries(answers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}
  `;
}

/**
 * Generate template from completed conversation
 * @param conversationState - Completed conversation state
 * @param projectPath - Project root path
 * @returns Generated template
 */
function generateTemplateFromConversation(
  conversationState: ConversationState, 
  projectPath: string
): string {
  const { answers } = conversationState;
  
  // Generate sections based on answers
  const templateAnswers: TemplateAnswers = {
    purpose: answers.purpose || '',
    targetAudience: answers.targetAudience || '',
    desiredAction: answers.desiredAction || '',
    style: answers.style || ''
  };
  const sections = generateSectionsFromAnswers(templateAnswers);
  
  return `
# 🎨 Your Custom Landing Page Template

Based on your answers, here's your personalized template:

## 📋 Your Requirements

- **Purpose**: ${answers.purpose}
- **Target Audience**: ${answers.targetAudience}
- **Desired Action**: ${answers.desiredAction}
- **Style**: ${answers.style}

## 🏗️ Recommended Page Structure

${sections.map((section, index) => `
### ${index + 1}. ${section.name}
- **Tailark Component**: \`@tailark/${section.tailarkComponent}\`
- **Description**: ${section.description}
- **Priority**: ${section.priority}/10
- **Installation**: \`npx shadcn@latest add @tailark/${section.tailarkComponent}\`
`).join('')}

## 🚀 Quick Setup

\`\`\`bash
cd ${projectPath}

# Install all recommended components
${sections.map(section => `npx shadcn@latest add @tailark/${section.tailarkComponent}`).join('\n')}
\`\`\`

## 📁 Suggested File Structure

\`\`\`
src/
├── components/
│   ├── sections/
│   │   ${sections.map(section => `├── ${section.tailarkComponent}.tsx`).join('\n    ')}
│   └── ui/
│       └── (shadcn components)
├── app/
│   └── page.tsx
└── lib/
    └── utils.ts
\`\`\`

## 💡 Implementation Tips

### Hero Section
- Make it compelling and action-oriented
- Include a clear value proposition
- Add a prominent call-to-action button

### Features Section
- Highlight your unique value proposition
- Use icons and visual elements
- Keep it scannable and easy to read

### Pricing Section (if applicable)
- Be transparent and competitive
- Show value clearly
- Include testimonials or social proof

### Call-to-Action
- Make it prominent and clear
- Use action-oriented language
- Reduce friction in the signup process

## 🎨 Style Recommendations

Based on your **${answers.style}** preference:

${getStyleRecommendations(answers.style)}

## 🔧 Next Steps

1. **Install Components**: Run the installation commands above
2. **Create Layout**: Set up your main page structure
3. **Customize Content**: Add your brand copy and images
4. **Style & Brand**: Apply your brand colors and fonts
5. **Test & Optimize**: Test on different devices and optimize

## 📚 Additional Resources

- [Tailark Documentation](https://tailark.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Need Help?

If you need assistance with:
- Component customization
- Layout adjustments
- Brand integration
- Performance optimization

Just ask and I'll provide specific guidance!
  `;
}

/**
 * Generate sections based on user answers
 * @param answers - User's answers
 * @returns Array of recommended sections
 */
function generateSectionsFromAnswers(answers: TemplateAnswers): Array<{
  name: string;
  tailarkComponent: string;
  description: string;
  priority: number;
}> {
  const sections: Array<{
    name: string;
    tailarkComponent: string;
    description: string;
    priority: number;
  }> = [];
  
  // Always include hero section
  sections.push({
    name: "Hero Section",
    tailarkComponent: "hero",
    description: "Main landing section with headline and CTA",
    priority: 10
  });
  
  // Add sections based on purpose
  switch (answers.purpose) {
    case "SaaS Product":
      sections.push(
        { name: "Features", tailarkComponent: "features", description: "Product features and benefits", priority: 9 },
        { name: "Pricing", tailarkComponent: "pricing", description: "Pricing plans and tiers", priority: 8 },
        { name: "Testimonials", tailarkComponent: "testimonials", description: "Customer testimonials", priority: 7 }
      );
      break;
      
    case "Mobile App":
      sections.push(
        { name: "Features", tailarkComponent: "features", description: "App features and functionality", priority: 9 },
        { name: "Stats", tailarkComponent: "stats", description: "Download numbers and user stats", priority: 8 },
        { name: "Testimonials", tailarkComponent: "testimonials", description: "User reviews and ratings", priority: 7 }
      );
      break;
      
    case "Ecommerce Product":
      sections.push(
        { name: "Features", tailarkComponent: "features", description: "Product features and benefits", priority: 9 },
        { name: "Testimonials", tailarkComponent: "testimonials", description: "Customer reviews", priority: 8 },
        { name: "Content", tailarkComponent: "content", description: "Product details", priority: 7 }
      );
      break;
      
    case "Personal Portfolio":
      sections.push(
        { name: "Content", tailarkComponent: "content", description: "About section and experience", priority: 9 },
        { name: "Testimonials", tailarkComponent: "testimonials", description: "Client testimonials", priority: 8 },
        { name: "Team", tailarkComponent: "team", description: "Personal information", priority: 7 }
      );
      break;
      
    case "Event":
      sections.push(
        { name: "Content", tailarkComponent: "content", description: "Event details and agenda", priority: 9 },
        { name: "Stats", tailarkComponent: "stats", description: "Event statistics", priority: 8 },
        { name: "Testimonials", tailarkComponent: "testimonials", description: "Previous event feedback", priority: 7 }
      );
      break;
  }
  
  // Add sections based on target audience
  if (answers.targetAudience === "Investors") {
    sections.push(
      { name: "Stats", tailarkComponent: "stats", description: "Key metrics and growth", priority: 8 },
      { name: "Team", tailarkComponent: "team", description: "Founding team and advisors", priority: 7 }
    );
  }
  
  // Add sections based on desired action
  switch (answers.desiredAction) {
    case "Sign up":
    case "Request a demo":
    case "Subscribe to newsletter":
    case "Contact you":
      sections.push({ 
        name: "Call to Action", 
        tailarkComponent: "call-to-action", 
        description: "Action-oriented section", 
        priority: 9 
      });
      break;
    case "Buy":
      sections.push({ 
        name: "Pricing", 
        tailarkComponent: "pricing", 
        description: "Product pricing", 
        priority: 9 
      });
      break;
  }
  
  // Always include footer
  sections.push({
    name: "Footer",
    tailarkComponent: "footer",
    description: "Site footer with links",
    priority: 1
  });
  
  // Sort by priority (highest first)
  return sections.sort((a, b) => b.priority - a.priority);
}

/**
 * Get style recommendations based on user preference
 * @param style - User's style preference
 * @returns Style recommendations
 */
function getStyleRecommendations(style: string): string {
  switch (style) {
    case "Professional":
      return `
- Use clean, corporate colors (blues, grays)
- Choose professional fonts (Inter, Roboto)
- Keep layouts structured and formal
- Use subtle animations and transitions
- Focus on trust and credibility indicators`;
      
    case "Friendly":
      return `
- Use warm, approachable colors (oranges, greens)
- Choose friendly fonts (Poppins, Open Sans)
- Add rounded corners and soft shadows
- Use conversational copy and tone
- Include social proof and testimonials`;
      
    case "Creative":
      return `
- Use bold, vibrant colors and gradients
- Choose creative fonts (Montserrat, Playfair)
- Add dynamic animations and interactions
- Use unique layouts and visual elements
- Showcase creativity and innovation`;
      
    case "Minimalist":
      return `
- Use lots of white space and clean lines
- Choose simple, readable fonts (Helvetica, Arial)
- Stick to monochromatic or limited color palettes
- Focus on typography and content
- Remove unnecessary elements and distractions`;
      
    default:
      return `
- Choose colors that match your brand
- Use fonts that reflect your personality
- Create a layout that serves your content
- Test different approaches and iterate
- Focus on user experience and conversion`;
  }
}
