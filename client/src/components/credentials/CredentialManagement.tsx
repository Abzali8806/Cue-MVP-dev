import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { toggleSection, updateCredentialValue } from "../../store/slices/credentialsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CredentialSection from "./CredentialSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface CredentialManagementProps {
  onOpenHelp: (title: string, content: string) => void;
}

export default function CredentialManagement({ onOpenHelp }: CredentialManagementProps) {
  const dispatch = useDispatch();
  const { credentials, expandedSections } = useSelector((state: RootState) => state.credentials);
  const { nodes } = useSelector((state: RootState) => state.nodes);

  // Group credentials by service type
  const credentialSections = Object.values(credentials).reduce((acc, credential) => {
    if (!acc[credential.serviceType]) {
      acc[credential.serviceType] = [];
    }
    acc[credential.serviceType].push(credential);
    return acc;
  }, {} as Record<string, typeof credentials[string][]>);

  const handleToggleSection = (serviceType: string) => {
    dispatch(toggleSection(serviceType));
  };

  const handleCredentialChange = (credentialId: string, value: string) => {
    dispatch(updateCredentialValue({ id: credentialId, value }));
  };

  const getServiceIcon = (serviceType: string): string => {
    switch (serviceType.toLowerCase()) {
      case 'stripe':
      case 'webhook':
        return 'payment';
      case 'sendgrid':
        return 'email';
      case 'dynamodb':
      case 'aws':
        return 'storage';
      default:
        return 'settings';
    }
  };

  const getServiceDisplayName = (serviceType: string): string => {
    switch (serviceType.toLowerCase()) {
      case 'stripe':
        return 'Stripe API';
      case 'sendgrid':
        return 'SendGrid API';
      case 'dynamodb':
        return 'AWS DynamoDB';
      case 'webhook':
        return 'Webhook Configuration';
      default:
        return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
    }
  };

  const isServiceRequired = (serviceType: string): boolean => {
    const serviceCredentials = credentialSections[serviceType] || [];
    return serviceCredentials.some(cred => cred.isRequired);
  };

  const getHelpContent = (serviceType: string): { title: string; content: string } => {
    switch (serviceType.toLowerCase()) {
      case 'stripe':
        return {
          title: 'How to get Stripe API credentials',
          content: `
            <div class="space-y-4">
              <p>Follow these steps to obtain your Stripe API credentials:</p>
              <ol class="list-decimal list-inside space-y-2 ml-4">
                <li>Log in to your Stripe Dashboard at <a href="https://dashboard.stripe.com" class="text-primary hover:underline" target="_blank">dashboard.stripe.com</a></li>
                <li>Navigate to the "Developers" section in the left sidebar</li>
                <li>Click on "API keys" to view your keys</li>
                <li>Copy your "Secret key" (starts with sk_test_ or sk_live_)</li>
                <li>For webhook endpoints, go to "Webhooks" and create a new endpoint</li>
                <li>Copy the "Signing secret" for webhook verification</li>
              </ol>
              <div class="bg-warning/10 border border-warning/20 rounded-md p-3">
                <p class="text-warning-foreground"><strong>Important:</strong> Never share your secret keys publicly or commit them to version control.</p>
              </div>
            </div>
          `
        };
      case 'sendgrid':
        return {
          title: 'How to get SendGrid API credentials',
          content: `
            <div class="space-y-4">
              <p>To obtain your SendGrid API key:</p>
              <ol class="list-decimal list-inside space-y-2 ml-4">
                <li>Log in to your SendGrid account at <a href="https://sendgrid.com" class="text-primary hover:underline" target="_blank">sendgrid.com</a></li>
                <li>Navigate to Settings > API Keys</li>
                <li>Click "Create API Key"</li>
                <li>Choose "Restricted Access" and select the permissions you need</li>
                <li>Give your key a name and click "Create & View"</li>
                <li>Copy the API key (starts with SG.)</li>
              </ol>
              <div class="bg-info/10 border border-info/20 rounded-md p-3">
                <p class="text-info-foreground"><strong>Note:</strong> You can only view the full API key once after creation.</p>
              </div>
            </div>
          `
        };
      default:
        return {
          title: `${getServiceDisplayName(serviceType)} Setup`,
          content: `
            <div class="space-y-4">
              <p>Please refer to the official documentation for ${getServiceDisplayName(serviceType)} to obtain the required credentials.</p>
            </div>
          `
        };
    }
  };

  return (
    <Card className="flex-1 border-0 shadow-none rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Required Credentials</CardTitle>
        {Object.keys(credentialSections).length === 0 && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Generate a workflow to see required credentials.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className="h-[calc(100%-5rem)] p-0">
        <ScrollArea className="h-full px-6 custom-scrollbar">
          <div className="space-y-4 pb-6">
            {Object.entries(credentialSections).map(([serviceType, serviceCredentials]) => (
              <CredentialSection
                key={serviceType}
                serviceType={serviceType}
                displayName={getServiceDisplayName(serviceType)}
                icon={getServiceIcon(serviceType)}
                isRequired={isServiceRequired(serviceType)}
                isExpanded={expandedSections[serviceType] || false}
                credentials={serviceCredentials}
                onToggleSection={() => handleToggleSection(serviceType)}
                onCredentialChange={handleCredentialChange}
                onOpenHelp={() => {
                  const help = getHelpContent(serviceType);
                  onOpenHelp(help.title, help.content);
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
