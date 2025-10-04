/**
 * Template conversation flow for SuperUI API Server
 * Handles the interactive conversation to gather user requirements
 */

export interface ConversationState {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, string>;
  nextQuestion?: string;
}

export interface TemplateAnswers {
  purpose: string;
  targetAudience: string;
  desiredAction: string;
  style: string;
}

export interface TemplateSection {
  name: string;
  priority: number;
  tailarkComponent: string;
  description: string;
}

/**
 * Conversation questions for template generation
 */
export const CONVERSATION_QUESTIONS = {
  1: {
    question: "What is this landing page for?",
    options: [
      "SaaS Product",
      "Mobile App", 
      "Ecommerce Product",
      "Personal Portfolio",
      "Event",
      "Other"
    ],
    key: "purpose"
  },
  2: {
    question: "Who is your target audience?",
    options: [
      "Customers",
      "Investors", 
      "Partners",
      "Job Applicants",
      "General Users"
    ],
    key: "targetAudience"
  },
  3: {
    question: "What action do you want visitors to take?",
    options: [
      "Sign up",
      "Request a demo",
      "Buy",
      "Subscribe to newsletter",
      "Contact you"
    ],
    key: "desiredAction"
  },
  4: {
    question: "What style or tone do you prefer?",
    options: [
      "Professional",
      "Friendly",
      "Creative",
      "Minimalist"
    ],
    key: "style"
  }
};

/**
 * Process conversation step and return next question or template
 * @param conversationState - Current conversation state
 * @param userAnswer - User's answer to current question
 * @returns Updated conversation state or template result
 */
export function processConversationStep(
  conversationState: ConversationState,
  userAnswer: string
): { type: 'question' | 'template', data: ConversationState | string } {
  
  const { currentStep, answers } = conversationState;
  
  // Store the current answer
  const currentQuestion = CONVERSATION_QUESTIONS[currentStep as keyof typeof CONVERSATION_QUESTIONS];
  if (currentQuestion) {
    answers[currentQuestion.key] = userAnswer;
  }
  
  // Check if we have all answers
  if (currentStep >= 4) {
  // Generate template based on all answers
  const templateAnswers: TemplateAnswers = {
    purpose: answers.purpose || '',
    targetAudience: answers.targetAudience || '',
    desiredAction: answers.desiredAction || '',
    style: answers.style || ''
  };
  const template = generateTemplateFromAnswers(templateAnswers);
    return { type: 'template', data: template };
  }
  
  // Move to next question
  const nextStep = currentStep + 1;
  const nextQuestion = CONVERSATION_QUESTIONS[nextStep as keyof typeof CONVERSATION_QUESTIONS];
  
  return {
    type: 'question',
    data: {
      currentStep: nextStep,
      totalSteps: 4,
      answers,
      nextQuestion: nextQuestion.question
    }
  };
}

/**
 * Generate template based on user answers
 * @param answers - User's answers to all questions
 * @returns Generated template structure
 */
function generateTemplateFromAnswers(answers: TemplateAnswers): string {
  const sections = selectSectionsForTemplate(answers);
  
  return `
# 🎨 Custom Landing Page Template

Based on your requirements, here's your personalized template:

## 📋 Template Configuration

- **Purpose**: ${answers.purpose}
- **Target Audience**: ${answers.targetAudience}
- **Desired Action**: ${answers.desiredAction}
- **Style**: ${answers.style}

## 🏗️ Recommended Sections

${sections.map((section, index) => `
### ${index + 1}. ${section.name}
- **Component**: \`@tailark/${section.tailarkComponent}\`
- **Description**: ${section.description}
- **Priority**: ${section.priority}/10
`).join('')}

## 🚀 Installation Commands

\`\`\`bash
# Install all recommended components
${sections.map(section => `npx shadcn@latest add @tailark/${section.tailarkComponent}`).join('\n')}
\`\`\`

## 📁 File Structure

\`\`\`
src/
├── components/
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── pricing.tsx
│   │   └── footer.tsx
│   └── ui/
│       └── (shadcn components)
└── app/
    └── page.tsx
\`\`\`

## 💡 Next Steps

1. Run the installation commands above
2. Import the components in your main page
3. Customize the content for your brand
4. Add your own styling and branding
5. Test the page on different devices

## 🎯 Optimization Tips

- **Hero Section**: Make it compelling and action-oriented
- **Features**: Highlight your unique value proposition
- **Pricing**: Be transparent and competitive
- **Testimonials**: Build trust with social proof
- **CTA**: Make it prominent and clear

## 🔧 Customization

Each section can be customized with:
- Your brand colors and fonts
- Custom content and copy
- Additional animations and interactions
- Mobile-responsive adjustments
  `;
}

/**
 * Select appropriate sections based on user answers
 * @param answers - User's answers
 * @returns Array of recommended sections
 */
function selectSectionsForTemplate(answers: TemplateAnswers): TemplateSection[] {
  const sections: TemplateSection[] = [];
  
  // Always include hero section
  sections.push({
    name: "Hero Section",
    priority: 10,
    tailarkComponent: "hero",
    description: "Main landing section with headline and CTA"
  });
  
  // Add sections based on purpose
  switch (answers.purpose) {
    case "SaaS Product":
      sections.push(
        { name: "Features", priority: 9, tailarkComponent: "features", description: "Product features and benefits" },
        { name: "Pricing", priority: 8, tailarkComponent: "pricing", description: "Pricing plans and tiers" },
        { name: "Testimonials", priority: 7, tailarkComponent: "testimonials", description: "Customer testimonials and reviews" }
      );
      break;
      
    case "Mobile App":
      sections.push(
        { name: "Features", priority: 9, tailarkComponent: "features", description: "App features and functionality" },
        { name: "Stats", priority: 8, tailarkComponent: "stats", description: "Download numbers and user stats" },
        { name: "Testimonials", priority: 7, tailarkComponent: "testimonials", description: "User reviews and ratings" }
      );
      break;
      
    case "Ecommerce Product":
      sections.push(
        { name: "Features", priority: 9, tailarkComponent: "features", description: "Product features and benefits" },
        { name: "Testimonials", priority: 8, tailarkComponent: "testimonials", description: "Customer reviews" },
        { name: "Content", priority: 7, tailarkComponent: "content", description: "Product details and specifications" }
      );
      break;
      
    case "Personal Portfolio":
      sections.push(
        { name: "Content", priority: 9, tailarkComponent: "content", description: "About section and experience" },
        { name: "Testimonials", priority: 8, tailarkComponent: "testimonials", description: "Client testimonials" },
        { name: "Team", priority: 7, tailarkComponent: "team", description: "Personal information" }
      );
      break;
      
    case "Event":
      sections.push(
        { name: "Content", priority: 9, tailarkComponent: "content", description: "Event details and agenda" },
        { name: "Stats", priority: 8, tailarkComponent: "stats", description: "Event statistics and highlights" },
        { name: "Testimonials", priority: 7, tailarkComponent: "testimonials", description: "Previous event feedback" }
      );
      break;
  }
  
  // Add sections based on target audience
  if (answers.targetAudience === "Investors") {
    sections.push(
      { name: "Stats", priority: 8, tailarkComponent: "stats", description: "Key metrics and growth numbers" },
      { name: "Team", priority: 7, tailarkComponent: "team", description: "Founding team and advisors" }
    );
  }
  
  // Add sections based on desired action
  switch (answers.desiredAction) {
    case "Sign up":
      sections.push({ name: "Call to Action", priority: 9, tailarkComponent: "call-to-action", description: "Sign up form and benefits" });
      break;
    case "Request a demo":
      sections.push({ name: "Call to Action", priority: 9, tailarkComponent: "call-to-action", description: "Demo request form" });
      break;
    case "Buy":
      sections.push({ name: "Pricing", priority: 9, tailarkComponent: "pricing", description: "Product pricing and purchase options" });
      break;
    case "Subscribe to newsletter":
      sections.push({ name: "Call to Action", priority: 8, tailarkComponent: "call-to-action", description: "Newsletter signup form" });
      break;
    case "Contact you":
      sections.push({ name: "Call to Action", priority: 8, tailarkComponent: "call-to-action", description: "Contact form and information" });
      break;
  }
  
  // Always include footer
  sections.push({
    name: "Footer",
    priority: 1,
    tailarkComponent: "footer",
    description: "Site footer with links and information"
  });
  
  // Sort by priority (highest first)
  return sections.sort((a, b) => b.priority - a.priority);
}

/**
 * Get the next question in the conversation
 * @param currentStep - Current step number
 * @returns Next question or null if conversation is complete
 */
export function getNextQuestion(currentStep: number): string | null {
  const question = CONVERSATION_QUESTIONS[currentStep as keyof typeof CONVERSATION_QUESTIONS];
  return question ? question.question : null;
}
