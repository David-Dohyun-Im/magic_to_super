/**
 * Template routes for SuperUI API Server
 * Handles template generation and conversation flow
 */

import express from 'express';
import { getTemplate } from '../services/template-service.js';

const router = express.Router();

/**
 * POST /api/template - Generate template or continue conversation
 * This endpoint handles the MCP server's template requests
 */
router.post('/template', async (req, res) => {
  try {
    console.log('🎨 Received template request:', req.body);
    
    const {
      message,
      conversationState,
      absolutePathToCurrentFile,
      absolutePathToProjectDirectory,
      standaloneRequestQuery
    } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({ 
        error: "Message is required",
        timestamp: new Date().toISOString()
      });
    }

    // Generate template or continue conversation
    const result = await getTemplate({
      message,
      conversationState,
      absolutePathToCurrentFile: absolutePathToCurrentFile || "/Users/test/project/src/App.tsx",
      absolutePathToProjectDirectory: absolutePathToProjectDirectory || "/Users/test/project",
      standaloneRequestQuery
    });

    console.log('📤 Sending template response');
    
    // Return the result
    res.json({ 
      result,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Template request error:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/template/start - Start a new template conversation
 * This endpoint can be used to start a new template generation process
 */
router.get('/template/start', async (req, res) => {
  try {
    console.log('🎨 Starting new template conversation');
    
    const result = await getTemplate({
      message: "Start new template conversation",
      absolutePathToCurrentFile: "/Users/test/project/src/App.tsx",
      absolutePathToProjectDirectory: "/Users/test/project",
      standaloneRequestQuery: "Start new template conversation"
    });

    res.json({ 
      result,
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Start template conversation error:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/template/help - Get help information about template generation
 * This endpoint provides information about how to use the template system
 */
router.get('/template/help', async (req, res) => {
  try {
    const helpInfo = {
      title: "SuperUI Template Generator",
      description: "Generate custom landing page templates through conversation",
      version: "1.0.0",
      features: [
        "Interactive conversation flow",
        "Tailark component integration",
        "Custom section recommendations",
        "Style and tone customization",
        "Installation commands"
      ],
      usage: {
        start: "Send a message to start template generation",
        conversation: "Answer 4 questions about your landing page",
        result: "Get a complete template with installation commands"
      },
      questions: [
        "What is this landing page for?",
        "Who is your target audience?",
        "What action do you want visitors to take?",
        "What style or tone do you prefer?"
      ],
      supportedComponents: [
        "hero", "features", "pricing", "testimonials", 
        "stats", "team", "content", "call-to-action", "footer"
      ]
    };

    res.json(helpInfo);
    
  } catch (error: any) {
    console.error('❌ Template help error:', error);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
