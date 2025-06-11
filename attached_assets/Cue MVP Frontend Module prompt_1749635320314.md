# Comprehensive Replit Prompt for Cue MVP Frontend Module

## Project Overview
Create a complete frontend module for the Cue MVP, a platform that transforms natural language workflow descriptions into deployable AWS Lambda code. The frontend will be a React-based web application with a node-based UI for visualizing workflows, providing credential input, and displaying validation feedback.

## Technical Requirements

### Core Technologies
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI v5)
- **Node-Based Visualization**: React Flow
- **Form Handling**: React Hook Form
- **API Communication**: Axios
- **Routing**: React Router v6
- **Type Safety**: TypeScript
- **Speech-to-Text**: Web Speech API with Azure Speech Services fallback

### Project Structure
Create a well-organized project structure following best practices:
```
src/
├── assets/            # Static assets, images, icons
├── components/        # Reusable UI components
│   ├── common/        # Generic components (buttons, inputs, etc.)
│   ├── layout/        # Layout components (header, footer, etc.)
│   ├── workflow/      # Workflow-specific components
│   └── nodes/         # Node-specific components
├── features/          # Feature-based modules
│   ├── auth/          # Authentication-related components and logic
│   ├── workflow/      # Workflow creation and visualization
│   ├── credentials/   # Credential management
│   └── deployment/    # Deployment instructions
├── hooks/             # Custom React hooks
├── services/          # API services and external integrations
├── store/             # Redux store configuration and slices
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Main application component
```

## Key Features to Implement

### 1. User Interface Layout
- Create a responsive layout with a header, main content area, and footer
- Implement a sidebar for navigation between different sections
- Design a clean, modern UI using Material-UI components
- Ensure the interface is intuitive and accessible

### 2. Workflow Input
- Create a form for users to input natural language workflow descriptions
- Include a text area with appropriate placeholder text and character count
- Add validation for minimum/maximum length
- Implement speech-to-text functionality using the Web Speech API with Azure Speech Services as fallback
- Add a prominent microphone button for voice input
- Include visual feedback during voice recording
- Implement real-time transcription display
- Allow users to edit the transcribed text before submission

### 3. Node-Based Workflow Visualization
- Implement a React Flow canvas to display the generated workflow as nodes
- Create custom node types for different workflow steps and tools
- Design nodes to clearly show:
  - Step name/description
  - Associated tool/service
  - Required credentials
  - Connections between steps
- Allow basic interaction (selecting nodes, panning, zooming)
- Implement a mini-map for navigation in complex workflows

### 4. Credential Management UI
- Create expandable sections within nodes for credential input
- Design form fields for various credential types (API keys, tokens, etc.)
- Implement field validation with clear error messages
- Add information tooltips explaining each credential
- Include "Learn More" links that open modal windows with detailed instructions
- Add visual indicators for validation status (pending, valid, invalid)

### 5. Code Preview
- Create a code preview panel with syntax highlighting
- Implement tabs to switch between different code files
- Add a "Copy to Clipboard" button
- Include line numbers and proper code formatting
- Add a "Download as Python File" button that allows users to download the generated code as .py files

### 6. Deployment Instructions
- Design a step-by-step instruction panel for AWS Lambda deployment
- Include expandable sections for detailed explanations
- Add visual indicators for completed steps

### 7. State Management
- Configure Redux store with appropriate slices:
  - workflowSlice: Manages workflow data and processing state
  - nodesSlice: Handles node data and visualization state
  - credentialsSlice: Manages credential inputs (without storing sensitive data)
  - validationSlice: Tracks validation status and feedback
  - speechToTextSlice: Manages speech recognition state and transcription
- Implement proper action creators and reducers
- Use Redux Toolkit's createAsyncThunk for API calls

### 8. API Integration
- Create service modules for API communication:
  - workflowService: Submits workflow descriptions and receives generated code
  - validationService: Sends credentials for validation and receives feedback
  - deploymentService: Retrieves deployment instructions
  - speechService: Handles speech recognition and transcription
- Implement proper error handling and loading states
- Use environment variables for API endpoints
- Design the frontend to work with a real backend API (no mocks)
- Include configuration options for API base URL

## UI/UX Requirements

### Design System
- Implement a consistent color scheme based on:
  - Primary: #3f51b5 (indigo)
  - Secondary: #f50057 (pink)
  - Background: #f5f5f5 (light grey)
  - Surface: #ffffff (white)
  - Error: #f44336 (red)
  - Success: #4caf50 (green)
  - Warning: #ff9800 (orange)
- Use Material-UI's theming system to apply consistent styling
- Ensure proper spacing using MUI's spacing system
- Implement responsive breakpoints for all screen sizes

### User Experience
- Add loading indicators for all asynchronous operations
- Implement smooth transitions between states
- Add tooltips for complex features
- Include helpful empty states for initial load
- Design clear error states with recovery actions
- Add confirmation dialogs for important actions

### Accessibility
- Ensure proper contrast ratios for all text
- Add ARIA labels to interactive elements
- Implement keyboard navigation
- Test with screen readers
- Make speech-to-text controls accessible with keyboard shortcuts

## Speech-to-Text Implementation
- Implement a dedicated speech recognition service using Web Speech API
- Add Azure Speech Services as a fallback for better accuracy and language support
- Create a SpeechToText component with:
  - Start/stop recording button with visual feedback
  - Real-time transcription display
  - Language selection dropdown
  - Error handling for unsupported browsers
  - Permission request handling
- Integrate speech recognition with the workflow input form
- Add ability to append multiple speech segments to the workflow description
- Implement confidence scoring for transcriptions
- Allow manual correction of transcribed text

## Python File Download Implementation
- Create a utility function to generate downloadable Python files from code strings
- Implement a file download service that:
  - Preserves proper Python formatting and indentation
  - Maintains comments and docstrings
  - Sets the correct MIME type for Python files
  - Names files appropriately based on their function
- Add a prominent "Download Python File" button in the code preview section
- Support downloading multiple Python files as individual files or as a zip archive
- Include proper error handling for download failures

## Implementation Details

### React Flow Setup
- Configure React Flow with:
  - Custom node types
  - Orthogonal edge routing
  - Node resizing
  - Mini-map
  - Controls for zoom and fit view
- Implement custom node components with:
  - Header section with step name
  - Body section with description
  - Footer section with credential inputs
  - Expansion/collapse functionality

### Form Implementation
- Use React Hook Form for all forms
- Implement validation rules:
  - Required fields
  - Format validation (email, API keys, etc.)
  - Length requirements
- Add real-time validation feedback
- Design clear error messages

### Responsive Design
- Implement a responsive layout that works on:
  - Desktop (1200px+)
  - Laptop (992px-1199px)
  - Tablet (768px-991px)
  - Mobile (576px-767px)
  - Small mobile (<576px)
- Use MUI's Grid system and responsive utilities
- Adapt the node visualization for smaller screens

### Performance Optimization
- Implement code splitting for larger components
- Use React.memo for pure components
- Optimize Redux selectors with reselect
- Implement virtualization for large lists

## Testing Requirements
- Write unit tests for utility functions
- Create component tests for key UI elements
- Test Redux actions and reducers
- Ensure responsive design works across breakpoints
- Test speech recognition in various browsers and devices

## Deliverables
1. Complete React application with all features implemented
2. Well-organized, commented code following best practices
3. Responsive design that works across device sizes
4. Sample workflow visualization as described
5. Fully functional speech-to-text capability
6. Python file download functionality

## Additional Notes
- Focus on creating a polished, intuitive user experience
- Prioritize visual clarity in the node-based visualization
- Ensure the credential input process is straightforward with clear guidance
- Make the deployment instructions comprehensive yet easy to follow
- The frontend should be designed to communicate with a real backend API (which will be developed separately)
- Do NOT implement any mock backend or mock data - focus solely on the frontend components
- Speech-to-text functionality is a core requirement, not an optional feature
- Code download must be as Python files (.py), not PDF
