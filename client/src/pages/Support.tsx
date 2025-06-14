import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageCircle, Book, Video, Users } from "lucide-react";
import { Link } from "wouter";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with Cue and learn how to make the most of our platform
          </p>
        </div>

        {/* Quick Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Email Support</CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="mailto:support@cue.com">Contact Support</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Book className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">Documentation</CardTitle>
              <CardDescription>Browse our comprehensive guides</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" asChild>
                <a href="#documentation">View Docs</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Community</CardTitle>
              <CardDescription>Connect with other users</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" asChild>
                <a href="#community">Join Community</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We're here to help you make the most of our platform that transforms natural language workflow descriptions into deployable AWS Lambda code. Whether you're just getting started or you're an experienced user looking to optimize your workflows, our comprehensive support resources are designed to provide you with the assistance you need.
            </p>

            <h2>Getting Started</h2>

            <h3>Quick Start Guide</h3>
            <p>
              If you're new to Cue, we recommend beginning with our comprehensive onboarding process. Start by signing in with your Google or GitHub account to access the platform. The dashboard provides an intuitive overview of your projects and recent activity, making it easy to navigate between different workflows and generated code.
            </p>
            
            <p>
              Begin with a simple workflow to understand how our natural language processing works. Try describing a basic automation task, such as "Send an email notification when a new file is uploaded to an S3 bucket" or "Process CSV data and store results in a database." Our platform will guide you through the code generation process and help you understand how your natural language descriptions translate into functional Python code.
            </p>

            <h3>Platform Overview</h3>
            <p>
              Cue consists of several key components designed to work together seamlessly. The natural language input interface allows you to describe your workflows in plain English, while our AI-powered processing engine analyzes your requirements and identifies the appropriate tools and integrations needed for your automation.
            </p>
            
            <p>
              The node-based visualization system presents your workflow as an interactive diagram, making it easy to understand the flow of data and operations. Each node represents a specific step in your process, and you can click on nodes to view the generated code, add API credentials, or modify configuration settings.
            </p>
            
            <p>
              Our validation system ensures that all generated code meets quality and security standards before deployment. This includes syntax checking, security vulnerability scanning, and verification that all required dependencies are current and properly configured.
            </p>

            <h2>Common Use Cases</h2>

            <h3>Data Processing Workflows</h3>
            <p>
              Many users leverage Cue for data processing and transformation tasks. These workflows typically involve extracting data from various sources, applying transformations or calculations, and storing results in databases or data warehouses. Our platform excels at generating code for ETL (Extract, Transform, Load) processes that can be deployed as serverless functions.
            </p>
            
            <p>
              For example, you might describe a workflow that "Reads sales data from a CSV file in S3, calculates monthly totals by region, and updates a PostgreSQL database with the results." Our platform will generate the necessary code to handle file reading, data processing using pandas, database connections, and error handling.
            </p>

            <h3>Integration and Automation</h3>
            <p>
              Cue is particularly powerful for creating integrations between different business systems. Whether you need to sync data between CRM and marketing platforms, automate invoice processing, or create custom notification systems, our platform can generate the necessary code to connect disparate systems.
            </p>
            
            <p>
              These integrations often involve API calls, data transformation, and conditional logic based on business rules. Our platform understands common integration patterns and can generate robust code that handles authentication, rate limiting, error handling, and data validation.
            </p>

            <h3>Notification and Alert Systems</h3>
            <p>
              Creating automated notification systems is another common use case. Users frequently describe workflows that monitor specific conditions and trigger alerts or notifications when certain criteria are met. This might include monitoring system health, tracking business metrics, or alerting teams about important events.
            </p>
            
            <p>
              Our platform can generate code that integrates with email services, Slack, SMS providers, and other communication channels. The generated code includes proper error handling and retry logic to ensure reliable delivery of notifications.
            </p>

            <h2>Troubleshooting</h2>

            <h3>Code Generation Issues</h3>
            <p>
              If you're experiencing issues with code generation, the most common cause is ambiguity in the natural language description. Our AI system works best when provided with clear, specific descriptions of the desired workflow. Instead of saying "process some data," try to be more specific: "read customer data from a MySQL database, filter for active customers, and export to a CSV file."
            </p>
            
            <p>
              When describing integrations with third-party services, include specific details about the APIs or services you want to use. For example, instead of "send notifications," specify "send Slack messages to the #alerts channel" or "send emails using SendGrid API."
            </p>
            
            <p>
              If the generated code doesn't match your expectations, try refining your description with additional details about data formats, business logic, or specific requirements. Our platform learns from these refinements and can generate more accurate code with clearer inputs.
            </p>

            <h3>Validation and Quality Issues</h3>
            <p>
              Our validation system checks generated code for common issues, but you may occasionally encounter validation errors. These typically fall into several categories: syntax errors, deprecated dependencies, security vulnerabilities, or configuration issues.
            </p>
            
            <p>
              Syntax errors are usually resolved automatically by our system, but if you encounter persistent syntax issues, try simplifying your workflow description and building complexity gradually. Start with a basic version of your workflow and add features incrementally.
            </p>
            
            <p>
              Deprecated dependency warnings indicate that the generated code uses libraries or APIs that may become obsolete. Our system regularly updates its knowledge base, but you can help by providing feedback about specific tools or services you prefer to use.
            </p>
            
            <p>
              Security vulnerability warnings are important to address before deployment. These might include issues like hardcoded credentials, insecure API calls, or insufficient input validation. Our platform provides guidance on resolving these issues while maintaining functionality.
            </p>

            <h3>Deployment Challenges</h3>
            <p>
              Deployment issues often relate to AWS configuration, credential management, or environment-specific requirements. Our platform generates detailed deployment instructions, but every AWS environment is unique, and you may need to adapt the instructions to your specific setup.
            </p>
            
            <p>
              Common deployment challenges include IAM permission issues, VPC configuration problems, and environment variable management. We provide comprehensive guides for these scenarios, and our support team can help you troubleshoot specific deployment issues.
            </p>
            
            <p>
              If you're new to AWS Lambda deployment, we recommend starting with our step-by-step deployment tutorial, which walks through the entire process from code generation to successful deployment and testing.
            </p>

            <h2>Feature Requests and Feedback</h2>

            <h3>Submitting Feature Requests</h3>
            <p>
              We actively encourage user feedback and feature requests to help us improve the platform. When submitting a feature request, please provide as much context as possible about your use case and how the requested feature would benefit your workflows.
            </p>
            
            <p>
              Describe the specific problem you're trying to solve and how you envision the feature working within the existing platform. If you have examples of similar functionality in other tools or platforms, that context can be helpful for our development team.
            </p>
            
            <p>
              We prioritize feature requests based on user demand, technical feasibility, and alignment with our platform roadmap. While we can't implement every request immediately, we carefully consider all feedback and communicate our development priorities through regular platform updates.
            </p>

            <h3>Beta Testing Opportunities</h3>
            <p>
              We regularly release new features and improvements through our beta testing program. Beta testers get early access to new functionality and help us identify issues before general release. If you're interested in participating in beta testing, you can sign up through your account settings.
            </p>
            
            <p>
              Beta testing typically involves using new features in your actual workflows and providing feedback about functionality, usability, and performance. We provide dedicated support channels for beta testers and actively incorporate feedback into the final release versions.
            </p>

            <h2>Technical Support</h2>

            <h3>Support Channels</h3>
            <p>
              We offer multiple channels for technical support to accommodate different preferences and urgency levels. For general questions and non-urgent issues, our knowledge base and community forums provide comprehensive resources and peer support.
            </p>
            
            <p>
              For more complex technical issues or urgent problems, you can contact our support team directly through email or our in-platform support chat. We aim to respond to all support requests within 24 hours during business days, with faster response times for urgent issues.
            </p>

            <h3>Support Response Times</h3>
            <p>
              Our support team operates during standard business hours in multiple time zones to provide timely assistance to users worldwide. Response times vary based on the complexity of your issue and your support plan level.
            </p>
            
            <p>
              General inquiries and how-to questions typically receive responses within 4-8 hours during business days. Technical issues and troubleshooting requests are prioritized based on severity, with critical issues affecting platform functionality receiving immediate attention.
            </p>
            
            <p>
              For users with premium support plans, we offer expedited response times and dedicated support representatives who become familiar with your specific use cases and requirements.
            </p>

            <h3>Escalation Process</h3>
            <p>
              If your issue requires escalation beyond our standard support team, we have clear processes for involving senior technical staff and engineering resources. Escalation typically occurs for complex technical issues, platform bugs, or situations where standard troubleshooting steps haven't resolved the problem.
            </p>
            
            <p>
              When escalating an issue, we'll keep you informed about the process and expected timeline for resolution. Our escalation process includes regular status updates and clear communication about any workarounds or temporary solutions available while we work on a permanent fix.
            </p>

            <h2 id="documentation">Resources and Documentation</h2>

            <h3>Comprehensive Documentation</h3>
            <p>
              Our documentation covers all aspects of the platform, from basic concepts to advanced use cases. The documentation is organized by topic and skill level, making it easy to find relevant information whether you're a beginner or an experienced user.
            </p>
            
            <p>
              Key documentation sections include platform overview and concepts, step-by-step tutorials for common workflows, API reference and integration guides, deployment best practices and troubleshooting, and security guidelines and compliance information.
            </p>
            
            <p>
              We regularly update our documentation based on user feedback and platform changes. Each documentation page includes a feedback mechanism where you can suggest improvements or report inaccuracies.
            </p>

            <h3>Video Tutorials and Webinars</h3>
            <p>
              In addition to written documentation, we provide video tutorials that demonstrate platform features and walk through common use cases. These videos are particularly helpful for visual learners and provide step-by-step guidance for complex workflows.
            </p>
            
            <p>
              We host regular webinars covering advanced topics, new features, and best practices. These sessions include live Q&A opportunities where you can ask questions directly to our product and engineering teams.
            </p>
            
            <p>
              All video content is available on-demand through our learning portal, with searchable transcripts and supplementary materials for each session.
            </p>

            <h3 id="community">Community Resources</h3>
            <p>
              Our user community is an excellent resource for peer support, sharing best practices, and discovering creative uses of the platform. The community forums are organized by topic and include sections for general discussion, technical questions, feature requests, and showcase projects.
            </p>
            
            <p>
              Community members often share workflow templates, integration patterns, and troubleshooting tips that can help you solve similar challenges. Our team actively participates in community discussions and uses community feedback to guide platform development.
            </p>
            
            <p>
              We also maintain a curated collection of community-contributed resources, including workflow templates, integration examples, and deployment guides for specific use cases.
            </p>

            <h2>Account and Billing Support</h2>

            <h3>Account Management</h3>
            <p>
              For account-related questions, including password resets, email changes, and account settings, you can use the self-service options in your account dashboard or contact our support team for assistance.
            </p>
            
            <p>
              Account security is a priority, and we provide tools and guidance to help you maintain the security of your account. This includes enabling two-factor authentication through your OAuth provider and monitoring account activity.
            </p>

            <h3>Billing and Subscription</h3>
            <p>
              Questions about billing, subscription changes, or payment methods can be addressed through your account settings or by contacting our billing support team. We provide detailed billing statements and usage reports to help you understand your charges.
            </p>
            
            <p>
              If you need to upgrade or downgrade your subscription, change payment methods, or request billing adjustments, our billing support team can assist you with these changes.
            </p>

            <h2>Contact Information</h2>
            <p>For additional support, please contact us:</p>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
              <p className="mb-2"><strong>General Support:</strong> support@cue.com</p>
              <p className="mb-2"><strong>Technical Support:</strong> tech@cue.com</p>
              <p className="mb-2"><strong>Billing Support:</strong> billing@cue.com</p>
              <p className="mb-2"><strong>Sales Inquiries:</strong> sales@cue.com</p>
              <p><strong>Phone:</strong> [Phone Number]</p>
            </div>

            <hr className="my-8" />
            
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              We're committed to providing excellent support and helping you succeed with Cue. Don't hesitate to reach out with any questions or feedback.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}