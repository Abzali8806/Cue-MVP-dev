import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Effective Date:</strong> June 14, 2025 &nbsp;&nbsp;
            <strong>Last Updated:</strong> June 14, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            <h2>Agreement to Terms</h2>
            <p>
              Welcome to Cue ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of our platform that transforms natural language workflow descriptions into deployable AWS Lambda code (the "Service"), operated by Cue.
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <h2>Description of Service</h2>
            <p>
              Cue is a comprehensive platform designed to democratize workflow automation by converting natural language descriptions into production-ready Python code optimized for AWS Lambda deployment. Our Service provides an innovative solution that bridges the gap between business requirements and technical implementation.
            </p>

            <h3>Core Functionality</h3>
            <p>
              Our platform accepts natural language descriptions of workflows and business processes, processes these descriptions using advanced natural language processing and artificial intelligence algorithms, generates syntactically correct and optimized Python code suitable for AWS Lambda deployment, provides a node-based user interface for credential management and code customization, validates generated code for quality, security, and best practices compliance, and delivers comprehensive deployment guides tailored to specific AWS configurations.
            </p>
            
            <p>
              The Service is designed to serve users with varying levels of technical expertise, from business analysts and product managers to experienced developers seeking to accelerate their workflow automation projects.
            </p>

            <h3>Platform Features</h3>
            <p>
              Our platform includes intelligent tool identification and integration recommendations, comprehensive code validation and security scanning, interactive node-based interface for workflow visualization and credential management, customizable code templates optimized for different use cases, detailed deployment guides tailored to specific AWS configurations, and ongoing support for generated code and deployment processes.
            </p>

            <h2>User Accounts and Registration</h2>

            <h3>Account Creation</h3>
            <p>
              To access certain features of our Service, you must sign in using either Google OAuth or GitHub OAuth. When you authenticate through these providers, we receive basic profile information including your name, email address, and profile picture. You are responsible for maintaining the security of your authentication provider account and for all activities that occur under your account.
            </p>

            <h3>Account Responsibilities</h3>
            <p>
              You are responsible for ensuring the security of your Google or GitHub account used for authentication. You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with these security obligations or from unauthorized access to your authentication provider account.
            </p>
            
            <p>
              You agree to use your account only for lawful purposes and in accordance with these Terms. You may not use your account to engage in any activity that violates applicable laws or regulations, infringes on the rights of others, or interferes with the proper functioning of our Service.
            </p>

            <h3>Account Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
            </p>

            <h2>Acceptable Use Policy</h2>

            <h3>Permitted Uses</h3>
            <p>
              You may use our Service to create legitimate workflow automation solutions for business, personal, or educational purposes. You may generate code for automating data processing, integration tasks, notification systems, and other lawful business processes. You may share generated code within your organization or with clients as part of your professional services.
            </p>

            <h3>Prohibited Uses</h3>
            <p>
              You may not use our Service to generate code for illegal activities, malicious purposes, or activities that violate the rights of others. Specifically, you may not create workflows designed to spam, harass, or harm others, access systems or data without authorization, violate intellectual property rights, distribute malware or malicious code, or engage in any form of cybercrime or unauthorized data collection.
            </p>
            
            <p>
              You may not attempt to reverse engineer, decompile, or otherwise derive the source code of our platform, use automated tools to access our Service in ways that exceed normal human usage patterns, interfere with or disrupt the integrity or performance of our Service, or attempt to gain unauthorized access to our systems or user accounts.
            </p>

            <h3>Content Standards</h3>
            <p>
              All natural language inputs and generated content must comply with applicable laws and regulations. You are responsible for ensuring that your workflow descriptions and intended use cases are lawful and do not infringe on the rights of others. We reserve the right to review and remove content that violates these standards.
            </p>

            <h2>Intellectual Property Rights</h2>

            <h3>Our Intellectual Property</h3>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of Cue and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>

            <h3>User-Generated Content</h3>
            <p>
              You retain ownership of the natural language descriptions you provide to our Service. However, by using our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and analyze your inputs for the purpose of providing and improving our Service.
            </p>

            <h3>Generated Code</h3>
            <p>
              The code generated by our platform based on your inputs is provided to you under a license that allows you to use, modify, and deploy the code for your intended purposes. However, you acknowledge that the underlying algorithms, templates, and methodologies used to generate the code remain our intellectual property.
            </p>
            
            <p>
              You may not claim ownership of the code generation algorithms or attempt to replicate our Service using the generated code as a basis for competing platforms.
            </p>

            <h2>Data and Privacy</h2>

            <h3>Data Processing</h3>
            <p>
              We process your data in accordance with our Privacy Policy, which is incorporated into these Terms by reference. By using our Service, you consent to the collection, use, and processing of your information as described in our Privacy Policy.
            </p>

            <h3>API Credentials and Security</h3>
            <p>
              Our Service is designed to help you integrate with third-party services through API credentials. We do not store your actual API keys or sensitive credentials on our servers. You are responsible for the security and proper use of your API credentials and for ensuring that you have the necessary permissions to integrate with third-party services.
            </p>

            <h3>Data Retention and Deletion</h3>
            <p>
              We retain your data in accordance with our Privacy Policy and applicable legal requirements. You may request deletion of your data at any time, subject to certain limitations related to legal compliance and operational requirements.
            </p>

            <h2>Third-Party Services and Integrations</h2>

            <h3>Third-Party Dependencies</h3>
            <p>
              Our Service may integrate with or recommend third-party services and APIs. We are not responsible for the availability, functionality, or terms of service of these third-party providers. Your use of third-party services is subject to their respective terms and conditions.
            </p>

            <h3>AWS Lambda Deployment</h3>
            <p>
              While our Service generates code optimized for AWS Lambda deployment, we are not affiliated with Amazon Web Services. Your use of AWS services is subject to AWS's terms of service and pricing. We provide guidance and best practices for deployment but are not responsible for AWS-related costs or issues.
            </p>

            <h3>Integration Responsibilities</h3>
            <p>
              You are responsible for ensuring that you have the necessary permissions and licenses to integrate with third-party services. You must comply with the terms of service of all third-party providers you choose to integrate with through our platform.
            </p>

            <h2>Service Availability and Performance</h2>

            <h3>Service Uptime</h3>
            <p>
              We strive to maintain high availability of our Service but do not guarantee uninterrupted access. We may experience downtime for maintenance, updates, or due to factors beyond our control. We will make reasonable efforts to provide advance notice of planned maintenance.
            </p>

            <h3>Performance Standards</h3>
            <p>
              While we work to ensure optimal performance of our code generation algorithms, we do not guarantee specific performance metrics or outcomes. The quality and effectiveness of generated code may vary based on the complexity of your requirements and the clarity of your natural language inputs.
            </p>

            <h3>Service Modifications</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of our Service at any time, with or without notice. We may also impose limits on certain features or restrict access to parts of the Service without notice or liability.
            </p>

            <h2>Limitation of Liability</h2>

            <h3>Disclaimer of Warranties</h3>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            
            <p>
              We do not warrant that the Service will be uninterrupted, secure, or error-free, that defects will be corrected, or that the Service or the servers that make it available are free of viruses or other harmful components.
            </p>

            <h3>Limitation of Damages</h3>
            <p>
              In no event shall Cue, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
            
            <p>
              Our total liability to you for any claims arising from or related to these Terms or the Service shall not exceed the amount you have paid us for the Service in the twelve months preceding the claim.
            </p>

            <h3>Code Quality and Deployment</h3>
            <p>
              While we implement comprehensive validation and quality assurance measures, we do not guarantee that generated code will be error-free or suitable for all deployment environments. You are responsible for testing and validating generated code before deployment in production environments.
            </p>

            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Cue and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>
            
            <p>
              This indemnification obligation applies to claims arising from your use of the Service, violation of these Terms, infringement of any intellectual property or other right of any person or entity, or any other party's access and use of the Service with your unique username, password, or other appropriate security code.
            </p>

            <h2>Governing Law and Dispute Resolution</h2>

            <h3>Governing Law</h3>
            <p>
              These Terms shall be interpreted and governed by the laws of [Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h3>Dispute Resolution</h3>
            <p>
              Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization]. The arbitration shall be conducted in [Location], and the arbitrator's decision shall be final and binding.
            </p>

            <h3>Class Action Waiver</h3>
            <p>
              You agree that any arbitration or legal proceeding shall be limited to the dispute between us and you individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>

            <h2>Termination</h2>

            <h3>Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting our support team or using the account deletion features in your account settings. Upon termination, you will lose access to your account and any data associated with it.
            </p>

            <h3>Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Reasons for termination may include violation of these Terms, fraudulent or illegal activity, abuse of the Service, or extended periods of inactivity.
            </p>

            <h3>Effect of Termination</h3>
            <p>
              Upon termination of your account, your access to the Service will immediately cease. Any data associated with your account may be deleted, and you will lose access to any generated code or workflows stored on our platform. We recommend downloading or backing up any important data before terminating your account.
            </p>

            <h2>Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by posting the updated Terms on our website and, where appropriate, sending you an email notification.
            </p>
            
            <p>
              Your continued use of the Service after any changes to these Terms constitutes your acceptance of the updated Terms. If you do not agree to the updated Terms, you must stop using the Service.
            </p>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect. The invalid or unenforceable provision will be replaced by a valid and enforceable provision that most closely matches the intent of the original provision.
            </p>

            <h2>Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and us concerning the Service. These Terms supersede all prior or contemporaneous communications and proposals between you and us.
            </p>

            <h2>Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            
            <p>
              <strong>Email:</strong> legal@cue.com<br />
              <strong>Address:</strong> [Company Address]<br />
              <strong>Phone:</strong> [Phone Number]
            </p>

            <hr className="my-8" />
            
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}