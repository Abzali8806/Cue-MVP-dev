import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Effective Date:</strong> June 14, 2025 &nbsp;&nbsp;
            <strong>Last Updated:</strong> June 14, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            <h2>Introduction</h2>
            <p>
              Welcome to Cue ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform that transforms natural language workflow descriptions into deployable AWS Lambda code (the "Service").
            </p>
            <p>
              We are committed to protecting your privacy and ensuring the security of your personal information. This policy describes our practices regarding data collection, use, and protection, and your rights concerning your personal data.
            </p>

            <h2>Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>When you create an account or use our Service, we may collect the following personal information:</p>
            
            <p>
              <strong>Account Information:</strong> When you sign in using Google OAuth or GitHub OAuth, we receive basic profile information including your name, email address, and profile picture from your chosen authentication provider. We use this information to create and manage your account, authenticate your access to the Service, and communicate with you about your account. We do not store passwords as authentication is handled entirely through these trusted third-party providers.
            </p>
            
            <p>
              <strong>Profile Information:</strong> Any additional information you choose to provide in your user profile, such as your company name, job title, or professional background. This information helps us personalize your experience and provide relevant features.
            </p>
            
            <p>
              <strong>Contact Information:</strong> Information you provide when contacting our support team, including your name, email address, and any details about your inquiry or issue.
            </p>

            <h3>Technical Information</h3>
            <p>We automatically collect certain technical information when you use our Service:</p>
            
            <p>
              <strong>Usage Data:</strong> Information about how you interact with our platform, including the workflows you create, the natural language descriptions you input, the code generated, and the features you use. This data helps us understand user behavior, improve our algorithms, and enhance the Service.
            </p>
            
            <p>
              <strong>Device Information:</strong> Details about the device you use to access our Service, including device type, operating system, browser type and version, screen resolution, and device identifiers.
            </p>
            
            <p>
              <strong>Log Data:</strong> Server logs that include your IP address, access times, pages viewed, time spent on pages, unique device identifiers, and other diagnostic data. This information helps us monitor the performance and security of our Service.
            </p>
            
            <p>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar tracking technologies to enhance your experience, remember your preferences, and analyze usage patterns.
            </p>

            <h3>Workflow and Code Data</h3>
            <p>Given the nature of our Service, we collect and process:</p>
            
            <p>
              <strong>Natural Language Inputs:</strong> The workflow descriptions you provide to our platform for code generation. We process this information to understand your requirements and generate appropriate code.
            </p>
            
            <p>
              <strong>Generated Code:</strong> The Python code our platform creates based on your inputs, including any modifications you make through our node-based interface.
            </p>
            
            <p>
              <strong>API Credentials and Configuration:</strong> Information about third-party services you integrate with your workflows. However, we do not store your actual API keys or sensitive credentials on our servers.
            </p>
            
            <p>
              <strong>Deployment Information:</strong> Details about your AWS Lambda deployments and configuration preferences to provide relevant guidance and support.
            </p>

            <h2>How We Use Your Information</h2>
            
            <h3>Service Provision and Improvement</h3>
            <p>
              We use your information to provide, maintain, and improve our Service. This includes processing your natural language inputs to generate code, validating the generated code for quality and security, providing the node-based interface for credential management, and generating deployment instructions tailored to your specific requirements.
            </p>
            
            <p>
              We continuously analyze usage patterns and user feedback to enhance our algorithms, improve code generation quality, develop new features and capabilities, and optimize the user experience across our platform.
            </p>

            <h3>Communication and Support</h3>
            <p>
              We use your contact information to respond to your inquiries and provide customer support, send important updates about our Service, including security notifications and policy changes, provide technical assistance and troubleshooting guidance, and share relevant educational content and best practices for workflow automation.
            </p>

            <h3>Security and Compliance</h3>
            <p>
              We process your information to monitor for suspicious activities and potential security threats, prevent fraud and unauthorized access to accounts, ensure compliance with our Terms of Service and applicable laws, and maintain the integrity and security of our platform.
            </p>

            <h3>Analytics and Research</h3>
            <p>
              We use aggregated and anonymized data to conduct research on workflow automation trends, analyze the effectiveness of our code generation algorithms, understand user needs and preferences, and develop insights that benefit our entire user community.
            </p>

            <h2>Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:</p>

            <h3>Service Providers</h3>
            <p>
              We work with trusted third-party service providers who assist us in operating our platform and providing our Service. These providers may have access to your information only to perform specific tasks on our behalf and are obligated to protect your information and use it only for the purposes we specify.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid legal processes, such as subpoenas, court orders, or government requests. We will make reasonable efforts to notify you of such requests unless prohibited by law.
            </p>

            <h3>Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will provide notice of such transfer and any changes to this Privacy Policy.
            </p>

            <h3>Protection of Rights</h3>
            <p>
              We may disclose information when we believe it is necessary to protect our rights, property, or safety, or the rights, property, or safety of our users or others.
            </p>

            <h2>Data Security</h2>
            
            <h3>Technical Safeguards</h3>
            <p>
              We use industry-standard encryption to protect data in transit and at rest, maintain secure servers with regular security updates and monitoring, implement access controls to limit who can access your information, and conduct regular security audits and vulnerability assessments.
            </p>

            <h3>Operational Safeguards</h3>
            <p>
              Our team follows strict data handling procedures and receives regular security training. We maintain incident response procedures to address any potential security breaches promptly and effectively.
            </p>

            <h3>Credential Security</h3>
            <p>
              We take special care with API credentials and sensitive configuration data. We do not store your actual API keys or tokens on our servers. Instead, we provide secure interfaces for you to input credentials directly into your generated code, and we use temporary, encrypted storage only during the validation process.
            </p>

            <h2>Data Retention</h2>
            <p>We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy:</p>
            
            <p>
              <strong>Account Information:</strong> Retained while your account is active and for a reasonable period after account closure to comply with legal obligations.
            </p>
            
            <p>
              <strong>Usage Data:</strong> Retained for analytical purposes in aggregated or anonymized form to improve our Service.
            </p>
            
            <p>
              <strong>Generated Code and Workflows:</strong> Retained according to your preferences and our data retention policies, with options for you to delete your data.
            </p>
            
            <p>
              <strong>Support Communications:</strong> Retained for a reasonable period to provide ongoing support and improve our Service.
            </p>
            
            <p>You may request deletion of your personal information at any time, subject to legal and operational requirements.</p>

            <h2>Your Rights and Choices</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>

            <h3>Access and Portability</h3>
            <p>You have the right to access the personal information we hold about you and receive a copy of your data in a portable format.</p>

            <h3>Correction and Updates</h3>
            <p>You can update your account information and profile details through your account settings. You may also contact us to correct any inaccuracies in your personal information.</p>

            <h3>Deletion</h3>
            <p>You may request deletion of your personal information, subject to certain legal and operational limitations. We will respond to deletion requests promptly and in accordance with applicable laws.</p>

            <h3>Opt-Out</h3>
            <p>You may opt out of certain communications from us, such as marketing emails, while still receiving essential service-related communications.</p>

            <h3>Data Processing Limitations</h3>
            <p>You may request limitations on how we process your personal information in certain circumstances.</p>

            <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section below.</p>

            <h2>International Data Transfers</h2>
            <p>
              Our Service may involve the transfer of your information to countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information promptly.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our website and, where appropriate, sending you an email notification.
            </p>
            
            <p>
              Your continued use of our Service after any changes to this Privacy Policy constitutes your acceptance of the updated policy.
            </p>

            <h2>Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            
            <p>
              <strong>Email:</strong> privacy@cue.com<br />
              <strong>Address:</strong> [Company Address]<br />
              <strong>Phone:</strong> [Phone Number]
            </p>
            
            <p>We are committed to addressing your privacy concerns promptly and transparently.</p>

            <hr className="my-8" />
            
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              This Privacy Policy is designed to be comprehensive and transparent about our data practices. We encourage you to read it carefully and contact us with any questions.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}