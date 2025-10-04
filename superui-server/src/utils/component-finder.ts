/**
 * Component finder utility for SuperUI API Server
 * Manages the component library and provides search functionality
 */

export interface ComponentInfo {
  componentName: string;
  displayName: string;
  packageName: string;
  importStatement: string;
  usage: string;
  description: string;
  category: string;
  tags: string[];
}

/**
 * Comprehensive component library
 * Based on shadcn/ui components
 */
const COMPONENT_LIBRARY: Record<string, ComponentInfo> = {
  // Form Components
  "button": {
    componentName: "button",
    displayName: "Button",
    packageName: "@radix-ui/react-button",
    importStatement: `import { Button } from "@/components/ui/button"`,
    usage: `<Button variant="default">Click me</Button>`,
    description: "A versatile button component with multiple variants and sizes",
    category: "form",
    tags: ["button", "click", "action", "primary", "secondary"]
  },
  "input": {
    componentName: "input",
    displayName: "Input",
    packageName: "@radix-ui/react-input",
    importStatement: `import { Input } from "@/components/ui/input"`,
    usage: `<Input placeholder="Enter text..." />`,
    description: "A text input component for user input",
    category: "form",
    tags: ["input", "text", "form", "field", "type"]
  },
  "textarea": {
    componentName: "textarea",
    displayName: "Textarea",
    packageName: "@radix-ui/react-textarea",
    importStatement: `import { Textarea } from "@/components/ui/textarea"`,
    usage: `<Textarea placeholder="Enter your message..." />`,
    description: "A multi-line text input component",
    category: "form",
    tags: ["textarea", "text", "multiline", "message", "comment"]
  },
  "select": {
    componentName: "select",
    displayName: "Select",
    packageName: "@radix-ui/react-select",
    importStatement: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`,
    usage: `<Select><SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger><SelectContent><SelectItem value="option1">Option 1</SelectItem></SelectContent></Select>`,
    description: "A dropdown select component",
    category: "form",
    tags: ["select", "dropdown", "option", "choice", "form"]
  },
  "checkbox": {
    componentName: "checkbox",
    displayName: "Checkbox",
    packageName: "@radix-ui/react-checkbox",
    importStatement: `import { Checkbox } from "@/components/ui/checkbox"`,
    usage: `<Checkbox />`,
    description: "A checkbox input component",
    category: "form",
    tags: ["checkbox", "check", "form", "boolean", "toggle"]
  },
  "radio": {
    componentName: "radio-group",
    displayName: "Radio Group",
    packageName: "@radix-ui/react-radio-group",
    importStatement: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`,
    usage: `<RadioGroup><RadioGroupItem value="option1" />Option 1</RadioGroup>`,
    description: "A radio button group component",
    category: "form",
    tags: ["radio", "group", "choice", "form", "option"]
  },

  // Layout Components
  "card": {
    componentName: "card",
    displayName: "Card",
    packageName: "@radix-ui/react-card",
    importStatement: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"`,
    usage: `<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Content</CardContent></Card>`,
    description: "A flexible card component for content display",
    category: "layout",
    tags: ["card", "container", "content", "panel", "box"]
  },
  "sheet": {
    componentName: "sheet",
    displayName: "Sheet",
    packageName: "@radix-ui/react-dialog",
    importStatement: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"`,
    usage: `<Sheet><SheetTrigger>Open</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Title</SheetTitle></SheetHeader></SheetContent></Sheet>`,
    description: "A slide-out panel component",
    category: "layout",
    tags: ["sheet", "panel", "drawer", "slide", "overlay"]
  },
  "dialog": {
    componentName: "dialog",
    displayName: "Dialog",
    packageName: "@radix-ui/react-dialog",
    importStatement: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`,
    usage: `<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader></DialogContent></Dialog>`,
    description: "A modal dialog component",
    category: "layout",
    tags: ["dialog", "modal", "popup", "overlay", "window"]
  },
  "popover": {
    componentName: "popover",
    displayName: "Popover",
    packageName: "@radix-ui/react-popover",
    importStatement: `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"`,
    usage: `<Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Content</PopoverContent></Popover>`,
    description: "A floating panel component",
    category: "layout",
    tags: ["popover", "tooltip", "floating", "panel", "hover"]
  },

  // Navigation Components
  "tabs": {
    componentName: "tabs",
    displayName: "Tabs",
    packageName: "@radix-ui/react-tabs",
    importStatement: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
    usage: `<Tabs><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList><TabsContent value="tab1">Content</TabsContent></Tabs>`,
    description: "A tabbed interface component",
    category: "navigation",
    tags: ["tabs", "navigation", "menu", "switching", "panel"]
  },
  "accordion": {
    componentName: "accordion",
    displayName: "Accordion",
    packageName: "@radix-ui/react-accordion",
    importStatement: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"`,
    usage: `<Accordion><AccordionItem><AccordionTrigger>Title</AccordionTrigger><AccordionContent>Content</AccordionContent></AccordionItem></Accordion>`,
    description: "A collapsible content component",
    category: "navigation",
    tags: ["accordion", "collapse", "expand", "content", "faq"]
  },
  "breadcrumb": {
    componentName: "breadcrumb",
    displayName: "Breadcrumb",
    packageName: "@radix-ui/react-breadcrumb",
    importStatement: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"`,
    usage: `<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>`,
    description: "A navigation breadcrumb component",
    category: "navigation",
    tags: ["breadcrumb", "navigation", "path", "hierarchy", "location"]
  },

  // Data Display Components
  "table": {
    componentName: "table",
    displayName: "Table",
    packageName: "@radix-ui/react-table",
    importStatement: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"`,
    usage: `<Table><TableHeader><TableRow><TableHead>Header</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Cell</TableCell></TableRow></TableBody></Table>`,
    description: "A data table component",
    category: "data",
    tags: ["table", "data", "grid", "rows", "columns"]
  },
  "badge": {
    componentName: "badge",
    displayName: "Badge",
    packageName: "@radix-ui/react-badge",
    importStatement: `import { Badge } from "@/components/ui/badge"`,
    usage: `<Badge variant="default">Badge</Badge>`,
    description: "A small status indicator component",
    category: "data",
    tags: ["badge", "label", "status", "indicator", "tag"]
  },
  "avatar": {
    componentName: "avatar",
    displayName: "Avatar",
    packageName: "@radix-ui/react-avatar",
    importStatement: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`,
    usage: `<Avatar><AvatarImage src="/img.jpg" /><AvatarFallback>CN</AvatarFallback></Avatar>`,
    description: "A user profile image component",
    category: "data",
    tags: ["avatar", "profile", "image", "user", "picture"]
  },
  "progress": {
    componentName: "progress",
    displayName: "Progress",
    packageName: "@radix-ui/react-progress",
    importStatement: `import { Progress } from "@/components/ui/progress"`,
    usage: `<Progress value={33} />`,
    description: "A progress bar component",
    category: "data",
    tags: ["progress", "bar", "loading", "percent", "status"]
  },
  "skeleton": {
    componentName: "skeleton",
    displayName: "Skeleton",
    packageName: "@radix-ui/react-skeleton",
    importStatement: `import { Skeleton } from "@/components/ui/skeleton"`,
    usage: `<Skeleton className="h-4 w-[250px]" />`,
    description: "A loading skeleton component",
    category: "data",
    tags: ["skeleton", "loading", "placeholder", "shimmer", "wait"]
  },

  // Feedback Components
  "alert": {
    componentName: "alert",
    displayName: "Alert",
    packageName: "@radix-ui/react-alert",
    importStatement: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`,
    usage: `<Alert><AlertTitle>Title</AlertTitle><AlertDescription>Description</AlertDescription></Alert>`,
    description: "An alert notification component",
    category: "feedback",
    tags: ["alert", "notification", "message", "warning", "info"]
  },
  "toast": {
    componentName: "toast",
    displayName: "Toast",
    packageName: "@radix-ui/react-toast",
    importStatement: `import { Toast, ToastAction, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"`,
    usage: `<Toast><ToastTitle>Title</ToastTitle><ToastDescription>Description</ToastDescription><ToastAction>Action</ToastAction><ToastClose /></Toast>`,
    description: "A toast notification component",
    category: "feedback",
    tags: ["toast", "notification", "message", "popup", "temporary"]
  },
  "separator": {
    componentName: "separator",
    displayName: "Separator",
    packageName: "@radix-ui/react-separator",
    importStatement: `import { Separator } from "@/components/ui/separator"`,
    usage: `<Separator />`,
    description: "A visual separator component",
    category: "feedback",
    tags: ["separator", "divider", "line", "border", "split"]
  }
};

/**
 * Find component by search query
 * @param query - Search query string
 * @returns Component information or null if not found
 */
export function findComponent(query: string): ComponentInfo | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Direct match
  if (COMPONENT_LIBRARY[normalizedQuery]) {
    return COMPONENT_LIBRARY[normalizedQuery];
  }
  
  // Alias matching
  const aliases: Record<string, string> = {
    "btn": "button",
    "text": "input",
    "textfield": "input",
    "text area": "textarea",
    "text-area": "textarea",
    "dropdown": "select",
    "check": "checkbox",
    "check box": "checkbox",
    "radio button": "radio-group",
    "radiobutton": "radio-group",
    "container": "card",
    "panel": "card",
    "box": "card",
    "drawer": "sheet",
    "sidebar": "sheet",
    "modal": "dialog",
    "tooltip": "popover",
    "menu": "tabs",
    "nav": "tabs",
    "collapse": "accordion",
    "expand": "accordion",
    "navigation": "breadcrumb",
    "path": "breadcrumb",
    "data": "table",
    "grid": "table",
    "label": "badge",
    "tag": "badge",
    "status": "badge",
    "profile": "avatar",
    "user": "avatar",
    "image": "avatar",
    "loading": "progress",
    "percent": "progress",
    "bar": "progress",
    "wait": "skeleton",
    "placeholder": "skeleton",
    "shimmer": "skeleton",
    "notification": "alert",
    "message": "alert",
    "warning": "alert",
    "info": "alert",
    "popup": "toast",
    "temporary": "toast",
    "divider": "separator",
    "line": "separator",
    "border": "separator"
  };
  
  if (aliases[normalizedQuery]) {
    return COMPONENT_LIBRARY[aliases[normalizedQuery]];
  }
  
  // Tag-based search
  for (const [componentName, componentInfo] of Object.entries(COMPONENT_LIBRARY)) {
    if (componentInfo.tags.some(tag => tag.includes(normalizedQuery) || normalizedQuery.includes(tag))) {
      return componentInfo;
    }
  }
  
  // Partial match in component name
  for (const [componentName, componentInfo] of Object.entries(COMPONENT_LIBRARY)) {
    if (componentName.includes(normalizedQuery) || normalizedQuery.includes(componentName)) {
      return componentInfo;
    }
  }
  
  return null;
}

/**
 * Get all available components
 * @returns Array of all component information
 */
export function getAllComponents(): ComponentInfo[] {
  return Object.values(COMPONENT_LIBRARY);
}

/**
 * Get components by category
 * @param category - Component category
 * @returns Array of components in the category
 */
export function getComponentsByCategory(category: string): ComponentInfo[] {
  return Object.values(COMPONENT_LIBRARY).filter(component => component.category === category);
}

/**
 * Search components by text
 * @param searchText - Text to search for
 * @returns Array of matching components
 */
export function searchComponents(searchText: string): ComponentInfo[] {
  const normalizedSearch = searchText.toLowerCase().trim();
  
  return Object.values(COMPONENT_LIBRARY).filter(component => 
    component.componentName.includes(normalizedSearch) ||
    component.displayName.toLowerCase().includes(normalizedSearch) ||
    component.description.toLowerCase().includes(normalizedSearch) ||
    component.tags.some(tag => tag.includes(normalizedSearch))
  );
}
